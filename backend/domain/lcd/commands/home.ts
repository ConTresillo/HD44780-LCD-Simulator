import type { LCDState } from '../lcdState.js';
import { setBusy } from '../lcdTiming.js';

export function returnHome(state: LCDState): void {
  state.addressPointer = 0;
  state.shiftOffset = 0;
  state.ramType = 'DDRAM';

  // Override default with slow timing
  setBusy(state, 0x02);
}
