import type { LCDService } from '../services/lcdService.js';
import { writeData } from '../../domain/lcd/writeEngine.js';

export function executeWriteData(service: LCDService, byte: number): void {
  // 1. Call domain logic
  writeData(byte, service.state);
}
