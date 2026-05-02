import type { LCDService } from '../services/lcdService.js';
import type { LCDState } from '../../domain/lcd/lcdState.js';
import { DDRAM_SIZE, CGRAM_SIZE } from '../../domain/lcd/lcdState.js';
import { writeData } from '../../domain/lcd/writeEngine.js';

export function executeWriteData(service: LCDService, byte: number): void {
  // 1. Call domain logic
  writeData(byte, service.state);

  // 2. Log action
  const char = String.fromCharCode(byte);
  service.logService.log('DATA', `Data written: '${char}' (0x${byte.toString(16).padStart(2, '0')})`);

  // 3. Emit detailed and state events
  service.eventBus.emit({ type: 'DATA_WRITTEN' });
  service.emitStateUpdate();
}
