import { LCDService } from '../services/lcdService.js';
import { dispatchCommand } from '../../domain/lcd/dispatcher.js';
export function executeSendCommand(service, byte) {
    // 1. Call domain logic
    return dispatchCommand(byte, service.state);
}
//# sourceMappingURL=sendCommand.js.map