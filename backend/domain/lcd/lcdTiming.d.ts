import type { LCDState } from './lcdState.js';
/**
 * HD44780 Instruction Execution Timing (Simulated in ms)
 *
 * Note: Real hardware values are in microseconds (us).
 * We use ms here to make the simulation human-visible in the UI.
 */
export declare const LCD_TIMING: {
    readonly CLEAR: 2;
    readonly HOME: 2;
    readonly DEFAULT: 0.1;
};
/**
 * Updates the busy state based on the current timestamp.
 * Call this before checking the busyFlag.
 * @returns true if the busy flag was cleared.
 */
export declare function updateBusyStatus(state: LCDState): boolean;
/**
 * Sets the controller to busy based on the instruction type.
 */
export declare function setBusy(state: LCDState, byte: number): void;
//# sourceMappingURL=lcdTiming.d.ts.map