import { CGRAM_SIZE } from '../lcdState.js';
export function setDDRAMAddress(byte, state) {
    // Command Pattern: 0b1xxxxxxx
    const address = byte & 0x7F; // Extract bottom 7 bits
    // Update address pointer correctly without clamping fidelity
    state.addressPointer = address;
    state.ramType = 'DDRAM';
}
//# sourceMappingURL=setAddress.js.map