import type { LCDState } from './lcdState.js';
import type { BusTrace } from './types.js';
export interface ProcessedSignal {
    trace: BusTrace;
    hadFallingEdge: boolean;
}
/**
 * Hardware Bus Interface
 *
 * Simulated logic for handling 8-bit and 4-bit parallel interfaces.
 * Processes data on the falling edge of the Enable (EN) pin.
 */
export declare function processBusSignal(state: LCDState, data: number, rs: boolean, en: boolean, rw?: boolean): ProcessedSignal;
//# sourceMappingURL=busInterface.d.ts.map