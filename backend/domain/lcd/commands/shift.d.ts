import type { LCDState } from '../lcdState.js';
/**
 * Handle Cursor or Display Shift Command
 *
 * Pattern: 0 0 0 1 S/C R/L x x
 * S/C (Shift/Cursor): 1 = Display Shift, 0 = Cursor Move
 * R/L (Right/Left): 1 = Right, 0 = Left
 */
export declare function setShift(byte: number, state: LCDState): void;
//# sourceMappingURL=shift.d.ts.map