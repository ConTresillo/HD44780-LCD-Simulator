import type { LCDState } from '../lcdState.js';
import { setBusy } from '../lcdTiming.js';

export function clearDisplay(state: LCDState): void {
  state.ddram.fill(0x20); // fill with spaces
  state.addressPointer = 0;
  state.shiftOffset = 0;
  state.ramType = 'DDRAM';

  // Override default with slow timing
  setBusy(state, 0x01);
}
