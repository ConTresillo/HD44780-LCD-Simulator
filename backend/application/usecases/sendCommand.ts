import { LCDService } from '../services/lcdService';
import { dispatchCommand } from '../../domain/lcd/dispatcher';

export function executeSendCommand(service: LCDService, byte: number): void {
  // 1. Call domain logic
  dispatchCommand(byte, service.state);

  // 2. Log action
  service.logService.log('COMMAND', `Command 0x${byte.toString(16).padStart(2, '0')} executed`);

  // 3. Emit detailed and state events
  service.eventBus.emit({ type: 'COMMAND_EXECUTED' });
  service.emitStateUpdate();
}
