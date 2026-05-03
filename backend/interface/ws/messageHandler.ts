import type { LCDService } from '../../application/services/lcdService.js';
import type { ClientMessage } from './types.js';

export function handleMessage(msg: ClientMessage, service: LCDService): void {
  try {
    if (!msg || !msg.type) {
      throw new Error("Invalid message format");
    }

    switch (msg.type) {
      case 'COMMAND':
        service.sendCommand(msg.byte);
        break;
      case 'WRITE':
        service.writeData(msg.byte);
        break;
      case 'RESET':
        service.reset();
        break;
      case 'GPIO_SIGNAL':
        service.processGPIO(msg.data, msg.rs, msg.en, msg.rw);
        break;
      case 'UPDATE_CONFIG':
        service.updateConfig(msg.config);
        break;
      case 'PULSE_GPIO':
        service.pulseGPIO(msg.data, msg.rs, msg.rw);
        break;
      default:
        throw new Error(`Unknown message type: ${(msg as any).type}`);
    }
  } catch (err: any) {
    service.eventBus.emit({ type: 'ERROR', message: err.message });
  }
}
