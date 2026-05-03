import type { LCDState } from '../lcdState.js';
/**
 * Handle Function Set Command
 *
 * Pattern: 0 0 1 DL N F x x
 * DL: 1 = 8-bit, 0 = 4-bit
 * N: 1 = 2-line, 0 = 1-line
 * F: 1 = 5x10, 0 = 5x8
 */
export declare function setFunctionSet(byte: number, state: LCDState): void;
//# sourceMappingURL=functionSet.d.ts.map