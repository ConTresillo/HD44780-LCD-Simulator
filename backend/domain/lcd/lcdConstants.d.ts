/**
 * HD44780 Hardware Constants
 *
 * These values are fixed by the controller hardware and DO NOT depend on display size.
 *
 * DDRAM_SIZE:
 *   Total addressable display memory.
 *   The controller exposes 80 bytes of DDRAM.
 *
 * LINE_WIDTH:
 *   Each display line is internally backed by a 40-character buffer.
 *   Even a 16x2 display uses 40 bytes per line internally.
 */
export declare const LCD_CONSTANTS: {
    readonly DDRAM_SIZE: 80;
    readonly LINE_WIDTH: 40;
    readonly CGRAM_SIZE: 64;
};
//# sourceMappingURL=lcdConstants.d.ts.map