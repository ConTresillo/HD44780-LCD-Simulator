import type { LCDService } from '../application/services/lcdService.js';
import type { AICommand } from './types.js';

export class AIExecutor {
  constructor(private service: LCDService) {}

  public async execute(commands: AICommand[]): Promise<void> {
    for (const command of commands) {
      await this.executeCommand(command);
    }
  }

  private async executeCommand(command: AICommand): Promise<void> {
    const { cmd, args = [] } = command;

    switch (cmd) {
      // --- High-level macros ---
      case 'print': {
        const text = args.map(String).join(' ');
        for (let i = 0; i < text.length; i++) {
          await this.service.writeData(text.charCodeAt(i));
        }
        break;
      }
      case 'writec': {
        const char = String(args[0] ?? '');
        if (char.length > 0) {
          await this.service.writeData(char.charCodeAt(0));
        }
        break;
      }
      case 'cursor': {
        const row = Number(args[0] ?? 0);
        const col = Number(args[1] ?? 0);
        const offsets = [0x00, 0x40, 0x14, 0x54];
        const base = offsets[row] ?? 0x00;
        this.service.setAddress(base + col);
        break;
      }
      case 'clear':
        this.service.clearDisplay();
        break;
      case 'home':
        await this.service.sendCommand(0x02);
        break;
      case 'display': {
        const state = this.service.getState();
        let displayCtrl = 0x08;
        if (args[0] === 'on' || (args[0] !== 'off' && state.displayOn)) displayCtrl |= 0x04;
        if (state.cursorOn) displayCtrl |= 0x02;
        if (state.blinkOn) displayCtrl |= 0x01;
        await this.service.sendCommand(displayCtrl);
        break;
      }
      case 'cursor_mode': {
        const state = this.service.getState();
        let displayCtrl = 0x08;
        if (state.displayOn) displayCtrl |= 0x04;
        if (args[0] === 'on') displayCtrl |= 0x02;
        if (state.blinkOn) displayCtrl |= 0x01;
        await this.service.sendCommand(displayCtrl);
        break;
      }
      case 'blink': {
        const state = this.service.getState();
        let displayCtrl = 0x08;
        if (state.displayOn) displayCtrl |= 0x04;
        if (state.cursorOn) displayCtrl |= 0x02;
        if (args[0] === 'on') displayCtrl |= 0x01;
        await this.service.sendCommand(displayCtrl);
        break;
      }
      case 'shift': {
        const dir = args[0] === 'right' ? 0x04 : 0x00;
        await this.service.sendCommand(0x18 | dir);
        break;
      }
      case 'undo': {
        this.service.logService.log('AI_EXEC', 'Undo command received but state snapshots are pending Phase 4 implementation.');
        break;
      }

      // --- Low-level interface ---
      case 'cmd':
        await this.service.sendCommand(Number(args[0] ?? 0));
        break;
      case 'data':
        await this.service.writeData(Number(args[0] ?? 0));
        break;
      case 'reset':
        this.service.reset();
        break;
      case 'pulse': {
        const data = Number(args[0] ?? 0);
        const rs = Boolean(args[1]);
        const rw = Boolean(args[2]);
        this.service.pulseGPIO(data, rs, rw);
        break;
      }
      case 'set':
      case 'gpio':
        this.service.logService.log('AI_EXEC', 'Raw GPIO manipulation blocked by default executor policy.');
        break;

      // --- Debug / Read interface ---
      case 'state':
      case 'trace':
      case 'ddram':
        this.service.logService.log('AI_EXEC', `Read command '${cmd}' parsed. (Requires LLM feedback loop)`);
        break;

      default:
        this.service.logService.log('ERROR', `AI Executor encountered unhandled command: ${cmd}`);
    }
  }
}
