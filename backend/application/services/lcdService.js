import { createInitialState } from '../../domain/lcd/lcdState.js';
import { EventBus } from '../events/eventBus.js';
import { LogService } from '../logs/logService.js';
import { ConfigService } from '../config/configService.js';
import { executeSendCommand } from '../usecases/sendCommand.js';
import { executeWriteData } from '../usecases/writeData.js';
import { executeClearDisplay, executeSetAddress, executeReset } from '../usecases/control.js';
import { LCD_CONSTANTS } from '../../domain/lcd/lcdConstants.js';
import { getRowOffsets } from '../../domain/lcd/lcdLayout.js';
import { getCGRAMGlyphs } from '../../domain/lcd/glyphEngine.js';
import { processBusSignal } from '../../domain/lcd/busInterface.js';
import { updateBusyStatus, setBusy, LCD_TIMING } from '../../domain/lcd/lcdTiming.js';
import { dispatchCommand } from '../../domain/lcd/dispatcher.js';
export class LCDService {
    state;
    eventBus;
    logService;
    configService;
    executionQueue = Promise.resolve();
    MAX_QUEUE_DEPTH = 100;
    currentQueueSize = 0;
    constructor() {
        this.state = createInitialState();
        this.eventBus = new EventBus();
        this.logService = new LogService(this.eventBus);
        this.configService = new ConfigService();
    }
    sendCommand(byte) {
        if (this.currentQueueSize >= this.MAX_QUEUE_DEPTH) {
            this.logService.log('ERROR', 'Command rejected: Task queue full');
            return Promise.resolve();
        }
        this.currentQueueSize++;
        this.executionQueue = this.executionQueue.then(async () => {
            try {
                await this.waitForHardwareReady();
                const handled = executeSendCommand(this, byte);
                if (handled) {
                    const fastMode = this.configService.getConfig().fastMode;
                    if (this.state.initialized && !fastMode) {
                        setBusy(this.state, byte);
                        this.scheduleBusyClearUpdate(byte);
                    }
                    this.logService.log('COMMAND', `Executed command: 0x${byte.toString(16).padStart(2, '0').toUpperCase()}`);
                    this.eventBus.emit({ type: 'COMMAND_EXECUTED' });
                    this.emitStateUpdate();
                }
            }
            finally {
                this.currentQueueSize--;
            }
        });
        return this.executionQueue;
    }
    async waitForHardwareReady() {
        updateBusyStatus(this.state);
        while (this.state.busyFlag) {
            const remaining = Math.max(1, this.state.busyUntil - performance.now());
            await new Promise(r => setTimeout(r, remaining));
            updateBusyStatus(this.state);
        }
    }
    scheduleBusyClearUpdate(byte) {
        // We use a longer delay for the UI update than the actual hardware simulation
        // to ensure the 'Busy' state is visible to the human eye (min 50ms)
        const delay = (byte === 0x01 || byte === 0x02) ? 500 : 50;
        setTimeout(() => {
            if (updateBusyStatus(this.state)) {
                this.emitStateUpdate();
            }
        }, delay);
    }
    writeData(byte) {
        const numericByte = typeof byte === 'string' ? byte.charCodeAt(0) : byte;
        if (!this.state.initialized) {
            this.logService.log('ERROR', 'Data write rejected: Controller not initialized');
            return Promise.resolve();
        }
        if (this.currentQueueSize >= this.MAX_QUEUE_DEPTH) {
            this.logService.log('ERROR', 'Data write rejected: Task queue full');
            return Promise.resolve();
        }
        this.currentQueueSize++;
        this.executionQueue = this.executionQueue.then(async () => {
            try {
                await this.waitForHardwareReady();
                executeWriteData(this, numericByte);
                const fastMode = this.configService.getConfig().fastMode;
                if (!fastMode) {
                    setBusy(this.state, 0xFF); // Generic data write busy
                    this.scheduleBusyClearUpdate(0xFF);
                }
                this.logService.log('DATA', `Wrote data: '${String.fromCharCode(numericByte)}' (0x${numericByte.toString(16).padStart(2, '0').toUpperCase()})`);
                this.eventBus.emit({ type: 'DATA_WRITTEN' });
                this.emitStateUpdate();
            }
            finally {
                this.currentQueueSize--;
            }
        });
        return this.executionQueue;
    }
    clearDisplay() {
        this.sendCommand(0x01);
    }
    setAddress(address) {
        this.sendCommand(0x80 | address);
    }
    updateConfig(newConfig) {
        this.configService.updateConfig(newConfig);
        if (newConfig.fastMode !== undefined) {
            this.state.fastMode = newConfig.fastMode;
        }
        this.emitStateUpdate();
    }
    reset() {
        executeReset(this);
        this.state.busyFlag = false;
        this.state.busyUntil = 0;
        this.state.fastMode = this.configService.getConfig().fastMode;
    }
    getState() {
        updateBusyStatus(this.state);
        // Return structured clone to prevent external mutation
        return structuredClone(this.state);
    }
    getVisibleDisplay() {
        const { displayRows: rows, displayCols: cols } = this.configService.getConfig();
        // Invariant: If display is OFF, characters are not visible (blank)
        if (!this.state.displayOn) {
            return Array(rows).fill(Array(cols).fill(0x20));
        }
        const offsets = getRowOffsets(rows);
        const display = [];
        const shift = this.state.shiftOffset;
        for (let r = 0; r < rows; r++) {
            const row = [];
            const base = offsets[r] ?? 0;
            for (let c = 0; c < cols; c++) {
                // Shift moves the window over a 40-character line limit
                const offset = (c + shift) % 40;
                const address = base + offset;
                row.push(this.state.ddram[address] ?? 0x20);
            }
            display.push(row);
        }
        return display;
    }
    getGlyphs() {
        return getCGRAMGlyphs(this.state.cgram);
    }
    getCursorPosition() {
        // Invariant: If display is OFF or cursor is OFF, it is not visible
        if (!this.state.displayOn || !this.state.cursorOn) {
            return { row: -1, col: -1 };
        }
        if (this.state.ramType === 'CGRAM')
            return { row: -1, col: -1 };
        const { displayRows: rows, displayCols: cols } = this.configService.getConfig();
        const offsets = getRowOffsets(rows);
        const ptr = this.state.addressPointer;
        const shift = this.state.shiftOffset;
        for (let r = 0; r < rows; r++) {
            const base = offsets[r] ?? 0;
            // Check if the cursor is physically located on this 40-char line
            if (ptr >= base && ptr < base + 40) {
                const offsetInLine = ptr - base;
                // Determine its visible column accounting for shift
                const col = (offsetInLine - shift + 40) % 40;
                // Is it within the visible window (cols)?
                if (col < cols) {
                    return { row: r, col };
                }
            }
        }
        return { row: -1, col: -1 };
    }
    processGPIO(data, rs, en, rw = false) {
        const { trace, hadFallingEdge } = processBusSignal(this.state, data, rs, en, rw);
        // Emit trace for EVERY signal change (or just falling edge? User said "on every EN falling edge... after nibble... after byte")
        // Let's emit on every GPIO pulse for maximum visibility.
        this.eventBus.emit({
            type: 'GPIO_TRACE',
            trace: trace
        });
        if (hadFallingEdge) {
            if (trace.executed) {
                this.eventBus.emit({ type: 'COMMAND_EXECUTED' });
                // If it was a write that set the busy flag, schedule a clear update
                const fastMode = this.configService.getConfig().fastMode;
                if (this.state.busyFlag && !fastMode) {
                    // We don't know the byte easily here without looking at trace, 
                    // but we can just use a generic delay or check trace.assembledByte
                    this.scheduleBusyClearUpdate(trace.assembledByte ?? 0xFF);
                }
            }
            this.emitStateUpdate();
        }
    }
    pulseGPIO(data, rs, rw) {
        // Atomic Hardware Pulse: 0 -> 1 -> 0
        // 1. Set pins + EN=High
        this.processGPIO(data, rs, true, rw);
        // 2. Small delay (simulated hardware strobe)
        setTimeout(() => {
            // 3. EN=Low (Falling edge triggers execution)
            this.processGPIO(data, rs, false, rw);
        }, 2); // 2ms hardware strobe
    }
    emitStateUpdate() {
        this.eventBus.emit({
            type: 'STATE_UPDATED',
            state: this.getState()
        });
    }
}
//# sourceMappingURL=lcdService.js.map