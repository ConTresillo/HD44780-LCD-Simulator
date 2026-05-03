import type { LCDState } from '../lcdState.js';
/**
 * Set CGRAM Address Command
 *
 * Pattern: 0 1 A A A A A A
 * This command sets the CGRAM address to Binary AAAAAA.
 * Subsequent data writes will go to CGRAM.
 */
export declare function setCGRAMAddress(byte: number, state: LCDState): void;
//# sourceMappingURL=cgram.d.ts.map