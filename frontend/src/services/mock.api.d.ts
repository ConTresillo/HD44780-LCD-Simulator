/**
 * mock.api.ts — Mock implementation of LCDAPI.
 *
 * Simulates a running HD44780 LCD controller with:
 * - Realistic initialization sequence
 * - Live command/data processing
 * - Periodic state updates
 * - Synthetic log stream
 *
 * Replace with websocket.api.ts when backend is ready.
 * Zero UI changes required.
 */
import type { LCDAPI } from './api.interface';
export declare function createMockAPI(): LCDAPI;
//# sourceMappingURL=mock.api.d.ts.map