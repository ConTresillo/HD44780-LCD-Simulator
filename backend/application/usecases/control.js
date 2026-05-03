import { LCDService } from '../services/lcdService';
import { createInitialState } from '../../domain/lcd/lcdState';
export function executeClearDisplay(service) {
    // Uses existing sendCommand usecase to ensure log/event parity
    service.sendCommand(0x01);
}
export function executeSetAddress(service, address) {
    // Pattern 0b1xxxxxxx
    const command = 0x80 | (address & 0x7F);
    service.sendCommand(command);
}
export function executeReset(service) {
    // 1. Reset state manually to initial state
    service.state = createInitialState();
    // 2. Log action
    service.logService.log('CONTROL', `System state reset to initial`);
    // 3. Emit event
    service.emitStateUpdate();
}
//# sourceMappingURL=control.js.map