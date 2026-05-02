import type { LCDState } from './lcdState.js';
import { clearDisplay } from './commands/clear.js';
import { returnHome } from './commands/home.js';
import { setEntryMode } from './commands/entryMode.js';
import { setDisplayControl } from './commands/displayControl.js';
import { setDDRAMAddress } from './commands/setAddress.js';
import { setCGRAMAddress } from './commands/cgram.js';
import { setShift } from './commands/shift.js';
import { setFunctionSet } from './commands/functionSet.js';

export function dispatchCommand(byte: number, state: LCDState): boolean {
  // --- MANDATORY INITIALIZATION SEQUENCE ---
  // Only Function Set (0x20–0x3F) is allowed before initialized.
  // Only 8-bit mode pulses (DL=1, bit4 set) count toward the 3-pulse threshold.
  if (!state.initialized) {
    if ((byte & 0xE0) === 0x20) {
      const is8bit = (byte & 0x10) !== 0;
      if (is8bit) {
        state.initCount++;
      }
      if (state.initCount >= 3) {
        state.initialized = true;
      }
      state.dataLength = 8; // Force 8-bit during init
    }
    // Block everything else — including non-8-bit function set
    return false;
  }
  // 1. Clear Display (0x01)
  if (byte === 0x01) {
    clearDisplay(state);
    return true;
  }
  // 2. Return Home (0x02)
  else if (byte === 0x02) {
    returnHome(state);
    return true;
  }
  // 3. Entry Mode Set (0x04-0x07)
  else if ((byte & 0xFC) === 0x04) {
    setEntryMode(byte, state);
    return true;
  }
  // 4. Display Control (0x08-0x0F)
  else if ((byte & 0xF8) === 0x08) {
    setDisplayControl(byte, state);
    return true;
  }
  // 5. Cursor or Display Shift (0x10-0x1F)
  else if ((byte & 0xF0) === 0x10) {
    setShift(byte, state);
    return true;
  }
  // 6. Function Set (0x20-0x3F)
  else if ((byte & 0xE0) === 0x20) {
    setFunctionSet(byte, state);
    return true;
  }
  // 7. Set CGRAM Address (0x40-0x7F)
  else if ((byte & 0xC0) === 0x40) {
    setCGRAMAddress(byte, state);
    return true;
  }
  // 8. Set DDRAM Address (0x80-0xFF)
  else if ((byte & 0x80) === 0x80) {
    setDDRAMAddress(byte, state);
    return true;
  }

  return false;
}
