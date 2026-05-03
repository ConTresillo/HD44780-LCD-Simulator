import React from 'react';
interface LCDDisplayProps {
    display: number[][];
    glyphs: number[][][];
    cursor: {
        row: number;
        col: number;
    };
    cursorVisible: boolean;
    blinkOn: boolean;
}
export declare const LCDDisplay: React.FC<LCDDisplayProps>;
export {};
//# sourceMappingURL=LCDDisplay.d.ts.map