/**
 * Returns starting DDRAM addresses for each visible row.
 *
 * These offsets are defined by the HD44780 addressing scheme.
 *
 * Examples:
 * 16x2  → [0x00, 0x40]
 * 20x4  → [0x00, 0x40, 0x14, 0x54]
 */
export declare function getRowOffsets(rows: number): number[];
//# sourceMappingURL=lcdLayout.d.ts.map