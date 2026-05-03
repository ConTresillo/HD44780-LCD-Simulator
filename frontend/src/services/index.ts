/**
 * index.ts — API export point.
 *
 * To switch to the real backend, replace:
 *   export const api = createMockAPI();
 * with:
 *   export const api = createWebSocketAPI(WS_URL);
 *
 * Nothing else in the codebase changes.
 */
import { createWebSocketAPI } from './websocket.api';

// To switch back to mock for offline dev, use createMockAPI() from './mock.api'
export const api = createWebSocketAPI('ws://localhost:3000');

export type { LCDAPI, LCDStatePayload } from './api.interface';
export type { LCDHardwareState, LCDView, LogEntry, ConnectionStatus } from './api.types';
