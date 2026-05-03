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
export declare function getCGRAMGlyphs(cgram: Uint8Array): number[][][];
//# sourceMappingURL=glyphEngine.d.ts.map