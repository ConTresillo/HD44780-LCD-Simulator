/**
 * Handle Function Set Command
 *
 * Pattern: 0 0 1 DL N F x x
 * DL: 1 = 8-bit, 0 = 4-bit
 * N: 1 = 2-line, 0 = 1-line
 * F: 1 = 5x10, 0 = 5x8
 */
export function setFunctionSet(byte, state) {
    const DL = (byte >> 4) & 0x01;
    const N = (byte >> 3) & 0x01;
    const F = (byte >> 2) & 0x01;
    const newDataLength = DL === 1 ? 8 : 4;
    const newNumLines = N === 1 ? 2 : 1;
    const newFont = F === 1 ? '5x10' : '5x8';
    // Mode Change Cleanup: Clear nibble buffers if length changes
    if (state.dataLength !== newDataLength) {
        state.pendingNibble = null;
        state.pendingRs = null;
    }
    state.dataLength = newDataLength;
    state.numLines = newNumLines;
    state.font = newFont;
}
//# sourceMappingURL=functionSet.js.map