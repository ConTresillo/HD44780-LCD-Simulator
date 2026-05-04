import WebSocket, { WebSocketServer } from 'ws';
import * as http from 'http';
import type { LCDService } from '../../application/services/lcdService.js';
import { handleMessage } from './messageHandler.js';
import { setupEventBridge } from './eventBridge.js';
import type { ServerMessage } from './types.js';
import { AIAgent } from '../../ai/agent.js';
import { AIAuth } from '../../ai/auth.js';

export function createServer(port: number, service: LCDService): WebSocketServer {
  const server = http.createServer((req, res) => {
    // CORS configuration for the frontend
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'POST' && req.url === '/api/ai/login') {
      AIAuth.handleLoginRequest(req, res);
      return;
    }

    res.writeHead(404);
    res.end();
  });

  const wss = new WebSocketServer({ server });
  const aiAgent = new AIAgent(service);

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    console.log(`[WS] Client connected`);

    // Flag to mark connection as authenticated for AI commands
    (ws as any).isAIAuthenticated = AIAuth.verifyWebSocketAuth(req);

    // 1. Setup Event-to-Network bridge (Subscribes to app events)
    const unsubscribe = setupEventBridge(ws, service);

    // 2. Send initial State immediately on connection
    const stateSnapshot = service.getState();
    const cursor = service.getCursorPosition();
    const config = service.configService.getConfig();
    const initialStateMsg: ServerMessage = {
      type: 'STATE_UPDATE',
      state: {
        ...stateSnapshot,
        ddram: Array.from(stateSnapshot.ddram),
        cgram: Array.from(stateSnapshot.cgram)
      } as any,
      view: {
        rows: config.displayRows,
        cols: config.displayCols,
        display: service.getVisibleDisplay(),
        cursor: { row: cursor.row, col: cursor.col },
        cursorOn: stateSnapshot.cursorOn,
        blinkOn: stateSnapshot.blinkOn,
        cursorVisible: cursor.row !== -1 && stateSnapshot.displayOn,
        glyphs: service.getGlyphs()
      }
    };
    ws.send(JSON.stringify(initialStateMsg));

    // 3. Listen for incoming messages securely
    ws.on('message', (data: string) => {
      try {
        const msg = JSON.parse(data.toString());
        handleMessage(msg, service, aiAgent, (ws as any).isAIAuthenticated);
      } catch (err: any) {
        console.error('[WS] Error processing message:', err.message);
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

  server.listen(port, () => {
    console.log(`[HTTP] Auth server listening on port ${port}`);
  });

  return wss;
}
