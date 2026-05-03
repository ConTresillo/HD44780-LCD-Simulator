import { CGRAM_SIZE } from '../lcdState.js';
/**
 * Set CGRAM Address Command
 *
 * Pattern: 0 1 A A A A A A
 * This command sets the CGRAM address to Binary AAAAAA.
 * Subsequent data writes will go to CGRAM.
 */
export function setCGRAMAddress(byte, state) {
    const address = byte & 0x3F;
    state.addressPointer = address;
    state.ramType = 'CGRAM';
}
//# sourceMappingURL=cgram.js.map