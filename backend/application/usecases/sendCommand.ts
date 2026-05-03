import { LCDService } from '../services/lcdService.js';
import { dispatchCommand } from '../../domain/lcd/dispatcher.js';

export function executeSendCommand(service: LCDService, byte: number): boolean {
  // 1. Call domain logic
  return dispatchCommand(byte, service.state);
}
