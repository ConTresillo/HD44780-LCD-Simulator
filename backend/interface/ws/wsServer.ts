import WebSocket, { WebSocketServer } from 'ws';
import type { LCDService } from '../../application/services/lcdService.js';
import { handleMessage } from './messageHandler.js';
import { setupEventBridge } from './eventBridge.js';
import type { ServerMessage } from './types.js';

export function createServer(port: number, service: LCDService): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log(`[WS] Client connected`);

    // 1. Setup Event-to-Network bridge (Subscribes to app events)
    const unsubscribe = setupEventBridge(ws, service);

    // 2. Send initial State immediately on connection
    const stateSnapshot = service.getState();
    const cursor = service.getCursorPosition();
    const initialStateMsg: ServerMessage = {
      type: 'STATE_UPDATE',
      state: {
        ...stateSnapshot,
        ddram: Array.from(stateSnapshot.ddram),
        cgram: Array.from(stateSnapshot.cgram)
      } as any,
      view: {
        display: service.getVisibleDisplay(),
        cursor: { row: cursor.row, col: cursor.col },
        cursorVisible: cursor.row !== -1 && stateSnapshot.cursorOn && stateSnapshot.displayOn,
        glyphs: service.getGlyphs()
      }
    };
    ws.send(JSON.stringify(initialStateMsg));

    // 3. Listen for incoming messages securely
    ws.on('message', (data: string) => {
      try {
        const msg = JSON.parse(data.toString());
        handleMessage(msg, service);
      } catch (err: any) {
        // Safe fail-catch for raw parsing errors or severe structurally invalid input
        const errorMsg: ServerMessage = { type: 'ERROR', message: 'Invalid message structure' };
        ws.send(JSON.stringify(errorMsg));
      }
    });

    ws.on('close', () => {
      console.log(`[WS] Client disconnected`);
      unsubscribe();
    });

    ws.on('error', (err) => {
      console.error(`[WS] Client error:`, err);
      unsubscribe();
    });
  });

  return wss;
}
