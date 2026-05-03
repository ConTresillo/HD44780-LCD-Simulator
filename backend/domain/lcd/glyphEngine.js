import { LCD_CONSTANTS } from './lcdConstants.js';
/**
 * Transforms raw CGRAM bytes into a structured pixel representation.
 *
 * HD44780 CGRAM Structure:
 * - 8 characters total (index 0-7)
 * - 8 rows per character
 * - 5 pixels wide per row (bits 0-4)
 *
 * Output: number[8][8][5]
 *   Outer array: character index
 *   Middle array: row index
 *   Inner array: pixel column (0=OFF, 1=ON)
 */
export function getCGRAMGlyphs(cgram) {
    const glyphs = [];
    for (let charIdx = 0; charIdx < 8; charIdx++) {
        const glyph = [];
        const baseAddr = charIdx * 8;
        for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
            const byte = (cgram[baseAddr + rowIdx] ?? 0) & 0x1F;
            const pixels = [];
            // Bit 0 is typically the rightmost pixel in these 5x8 displays?
            // Actually, standard HD44780: 
            // Bit 4 is col 0 (leftmost)
            // Bit 3 is col 1
            // ...
            // Bit 0 is col 4 (rightmost)
            for (let colIdx = 4; colIdx >= 0; colIdx--) {
                pixels.push((byte >> colIdx) & 1);
            }
            glyph.push(pixels);
        }
        glyphs.push(glyph);
    }
    return glyphs;
}
//# sourceMappingURL=glyphEngine.js.map