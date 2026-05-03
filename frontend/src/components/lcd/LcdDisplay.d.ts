/**
 * LcdDisplay.tsx — Full LCD panel with bezel, glass, and pixel matrix.
 * Renders from view.display (rows × cols of char codes) + view.glyphs (CGRAM).
 * Design language inherited from frontend_old LcdWindow + bezel styling.
 */
import React from 'react';
import type { LCDView } from '../../services/api.types';
export declare function charToBitmap(code: number): number[][];
interface Props {
    view: LCDView;
    blinkOn: boolean;
    hardware?: any;
}
export declare const LcdDisplay: React.FC<Props>;
export {};
//# sourceMappingURL=LcdDisplay.d.ts.map