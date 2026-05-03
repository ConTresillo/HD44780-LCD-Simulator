/**
 * HD44780 Instruction Execution Timing (Simulated in ms)
 *
 * Note: Real hardware values are in microseconds (us).
 * We use ms here to make the simulation human-visible in the UI.
 */
export const LCD_TIMING = {
    CLEAR: 2, // Clear Display
    HOME: 2, // Return Home
    DEFAULT: 0.1, // Most other instructions
};
/**
 * Updates the busy state based on the current timestamp.
 * Call this before checking the busyFlag.
 * @returns true if the busy flag was cleared.
 */
export function updateBusyStatus(state) {
    if (state.busyFlag && performance.now() >= state.busyUntil) {
        state.busyFlag = false;
        return true;
    }
    return false;
}
/**
 * Sets the controller to busy based on the instruction type.
 */
export function setBusy(state, byte) {
    if (state.fastMode)
        return;
    let delay = LCD_TIMING.DEFAULT;
    if (byte === 0x01)
        delay = LCD_TIMING.CLEAR;
    else if (byte === 0x02)
        delay = LCD_TIMING.HOME;
    state.busyFlag = true;
    state.busyUntil = performance.now() + delay;
}
//# sourceMappingURL=lcdTiming.js.map