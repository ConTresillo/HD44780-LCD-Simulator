import type { LCDState } from '../lcdState.js';

export function setDisplayControl(byte: number, state: LCDState): void {
  // Command Pattern: 0b00001DCB (D = Display, C = Cursor, B = Blink)
  const displayOn = (byte & 0x04) !== 0;
  const cursorOn = (byte & 0x02) !== 0;
  const blinkOn = (byte & 0x01) !== 0;

  state.displayOn = displayOn;
  state.cursorOn = cursorOn;
  state.blinkOn = blinkOn;
}
