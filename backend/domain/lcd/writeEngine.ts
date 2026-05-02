import type { LCDState } from './lcdState.js';
import { LCD_CONSTANTS } from './lcdConstants.js';
export function writeData(byte: number, state: LCDState): void {
  const { DDRAM_SIZE, CGRAM_SIZE } = LCD_CONSTANTS;
  
  // 1. Write to target RAM
  if (state.ramType === 'DDRAM') {
    state.ddram[state.addressPointer] = byte;
  } else {
    state.cgram[state.addressPointer] = byte;
  }
  
  // 2. Update address pointer
  const size = state.ramType === 'DDRAM' ? DDRAM_SIZE : CGRAM_SIZE;
  if (state.entryModeIncrement) {
    state.addressPointer = (state.addressPointer + 1) % size;
  } else {
    state.addressPointer = (state.addressPointer - 1 + size) % size;
  }

  // 3. Shift display if entry mode shift is enabled and we are in DDRAM
  if (state.entryModeShift && state.ramType === 'DDRAM') {
    const shiftDir = state.entryModeIncrement ? 1 : -1;
    state.shiftOffset = (state.shiftOffset + shiftDir + DDRAM_SIZE) % DDRAM_SIZE;
  }
}
