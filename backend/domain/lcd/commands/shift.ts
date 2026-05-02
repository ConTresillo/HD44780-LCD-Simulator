import type { LCDState } from '../lcdState.js';
import { LCD_CONSTANTS } from '../lcdConstants.js';

/**
 * Handle Cursor or Display Shift Command
 * 
 * Pattern: 0 0 0 1 S/C R/L x x
 * S/C (Shift/Cursor): 1 = Display Shift, 0 = Cursor Move
 * R/L (Right/Left): 1 = Right, 0 = Left
 */
export function setShift(byte: number, state: LCDState): void {
  const { DDRAM_SIZE } = LCD_CONSTANTS;
  const SC = (byte >> 3) & 1;
  const RL = (byte >> 2) & 1;
  const direction = RL === 1 ? 1 : -1;

  if (SC === 0) {
    // MODE A: Cursor Move
    state.addressPointer = (state.addressPointer + direction + DDRAM_SIZE) % DDRAM_SIZE;
  } else {
    // MODE B: Display Shift
    // Spec: "Display Shift Right" moves characters RIGHT, meaning window moves LEFT.
    // Spec: "Display Shift Left" moves characters LEFT, meaning window moves RIGHT.
    const shiftDirection = RL === 1 ? -1 : 1;
    state.shiftOffset = (state.shiftOffset + shiftDirection + DDRAM_SIZE) % DDRAM_SIZE;
  }
}
