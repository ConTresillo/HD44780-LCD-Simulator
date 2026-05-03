export function setEntryMode(byte, state) {
    // Command Pattern: 0b000001IS (I = Increment/Decrement, S = Shift)
    const isIncrement = (byte & 0x02) !== 0;
    const isShift = (byte & 0x01) !== 0;
    state.entryModeIncrement = isIncrement;
    state.entryModeShift = isShift; // Stored, but ignored in Phase 1 behavior
}
//# sourceMappingURL=entryMode.js.map