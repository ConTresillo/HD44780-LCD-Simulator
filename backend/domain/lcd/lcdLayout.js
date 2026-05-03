/**
 * Returns starting DDRAM addresses for each visible row.
 *
 * These offsets are defined by the HD44780 addressing scheme.
 *
 * Examples:
 * 16x2  → [0x00, 0x40]
 * 20x4  → [0x00, 0x40, 0x14, 0x54]
 */
export function getRowOffsets(rows) {
    switch (rows) {
        case 1:
            return [0x00];
        case 2:
            return [0x00, 0x40];
        case 4:
            return [0x00, 0x40, 0x14, 0x54];
        default:
            // Fallback for 2-line mode which is the most common default
            return [0x00, 0x40];
    }
}
//# sourceMappingURL=lcdLayout.js.map