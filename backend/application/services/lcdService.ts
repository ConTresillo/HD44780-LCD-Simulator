import type { LCDState } from '../../domain/lcd/lcdState.js';
import { createInitialState } from '../../domain/lcd/lcdState.js';
import { EventBus } from '../events/eventBus.js';
import { LogService } from '../logs/logService.js';
import { ConfigService } from '../config/configService.js';

import { executeSendCommand } from '../usecases/sendCommand.js';
import { executeWriteData } from '../usecases/writeData.js';
import { executeClearDisplay, executeSetAddress, executeReset } from '../usecases/control.js';

import { LCD_CONSTANTS } from '../../domain/lcd/lcdConstants.js';
import { getRowOffsets } from '../../domain/lcd/lcdLayout.js';
import type { Config } from '../../application/config/configService.js';
import type { LogEntry } from '../../application/logs/logService.js';
import { getCGRAMGlyphs } from '../../domain/lcd/glyphEngine.js';
import { processBusSignal } from '../../domain/lcd/busInterface.js';
import { updateBusyStatus, setBusy, LCD_TIMING } from '../../domain/lcd/lcdTiming.js';
import { dispatchCommand } from '../../domain/lcd/dispatcher.js';

export class LCDService {
  public state: LCDState;
  public eventBus: EventBus;
  public logService: LogService;
  public configService: ConfigService;

  constructor() {
    this.state = createInitialState();
    this.eventBus = new EventBus();
    this.logService = new LogService(this.eventBus);
    this.configService = new ConfigService();
  }

  public sendCommand(byte: number): void {
    updateBusyStatus(this.state);
    if (this.state.busyFlag) return;

    const handled = dispatchCommand(byte, this.state);
    if (handled) {
      // During power-on init dance, host uses fixed delays — no BF polling.
      // Don't set busy until the controller is initialized.
      if (this.state.initialized) {
        setBusy(this.state, byte);
      }
    }
  }

  public writeData(byte: number | string): void {
    const numericByte = typeof byte === 'string' ? byte.charCodeAt(0) : byte;
    
    // HARDWARE GATE: Reject all data writes until controller is initialized
    if (!this.state.initialized) return;

    updateBusyStatus(this.state);
    if (this.state.busyFlag) return;

    executeWriteData(this, numericByte);
    setBusy(this.state, 0xFF); // Generic data write busy
  }

  public clearDisplay(): void {
    this.sendCommand(0x01);
  }

  public setAddress(address: number): void {
    this.sendCommand(0x80 | address);
  }

  public reset(): void {
    executeReset(this);
    this.state.busyFlag = false;
    this.state.busyUntil = 0;
  }

  public getState(): LCDState {
    updateBusyStatus(this.state);
    // Return structured clone to prevent external mutation
    return structuredClone(this.state);
  }

  public getVisibleDisplay(): number[][] {
    const { displayRows: rows, displayCols: cols } = this.configService.getConfig();
    
    // Invariant: If display is OFF, characters are not visible (blank)
    if (!this.state.displayOn) {
      return Array(rows).fill(Array(cols).fill(0x20));
    }

    const { DDRAM_SIZE } = LCD_CONSTANTS;
    const offsets = getRowOffsets(rows);
    const display: number[][] = [];
    const shift = this.state.shiftOffset;
    
    for (let r = 0; r < rows; r++) {
      const row = [];
      const base = offsets[r] ?? 0;
      for (let c = 0; c < cols; c++) {
        const address = (base + c + shift) % DDRAM_SIZE;
        row.push(this.state.ddram[address] ?? 0x20);
      }
      display.push(row);
    }
    return display;
  }

  public getGlyphs(): number[][][] {
    return getCGRAMGlyphs(this.state.cgram);
  }
  
  public getCursorPosition(): { row: number, col: number } {
    // Invariant: If display is OFF or cursor is OFF, it is not visible
    if (!this.state.displayOn || !this.state.cursorOn) {
      return { row: -1, col: -1 };
    }

    if (this.state.ramType === 'CGRAM') return { row: -1, col: -1 };

    const { DDRAM_SIZE } = LCD_CONSTANTS;
    const { displayRows: rows, displayCols: cols } = this.configService.getConfig();
    const offsets = getRowOffsets(rows);
    const ptr = this.state.addressPointer;
    const shift = this.state.shiftOffset;

    // Apply GLOBAL shift projection
    const projected = (ptr - shift + DDRAM_SIZE) % DDRAM_SIZE;

    for (let r = 0; r < rows; r++) {
      const base = offsets[r] ?? 0;
      
      // If the projected address sits within this row's visible columns
      if (projected >= base && projected < base + cols) {
        return { row: r, col: projected - base };
      }
    }

    return { row: -1, col: -1 };
  }

  public processGPIO(data: number, rs: boolean, en: boolean, rw: boolean = false): void {
    const { trace, hadFallingEdge } = processBusSignal(this.state, data, rs, en, rw);
    
    // Emit trace for EVERY signal change (or just falling edge? User said "on every EN falling edge... after nibble... after byte")
    // Let's emit on every GPIO pulse for maximum visibility.
    this.eventBus.emit({
      type: 'GPIO_TRACE',
      trace: trace
    });

    if (hadFallingEdge && trace.executed) {
      this.eventBus.emit({ type: 'COMMAND_EXECUTED' });
      this.emitStateUpdate();
    }
  }

  public emitStateUpdate(): void {
    this.eventBus.emit({
      type: 'STATE_UPDATED',
      state: this.getState()
    });
  }
}
