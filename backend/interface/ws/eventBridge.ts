import WebSocket from 'ws';
import type { LCDService } from '../../application/services/lcdService.js';
import type { ServerMessage } from './types.js';
import type { LCDEvent, ErrorEvent, LogEvent, StateUpdatedEvent } from '../../application/events/eventBus.js';

export function setupEventBridge(ws: WebSocket, service: LCDService): () => void {
  const unsubscribe = service.eventBus.subscribe((event: LCDEvent) => {
    // Only process if socket is open
    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }

    let msg: ServerMessage | null = null;

    if (event.type === 'STATE_UPDATED') {
      const stateEvent = event as StateUpdatedEvent;
      const cursor = service.getCursorPosition();
      
      const stateData = {
        ...stateEvent.state,
        ddram: Array.from(stateEvent.state.ddram),
        cgram: Array.from(stateEvent.state.cgram)
      };

      const viewData = {
        display: service.getVisibleDisplay(),
        cursor: { row: cursor.row, col: cursor.col },
        cursorVisible: cursor.row !== -1 && stateEvent.state.cursorOn && stateEvent.state.displayOn,
        glyphs: service.getGlyphs()
      };

      msg = { type: 'STATE_UPDATE', state: stateData as any, view: viewData };

    } else if (event.type === 'LOG') {
      const logEvent = event as LogEvent;
      msg = { type: 'LOG_EVENT', log: logEvent.log };

    } else if (event.type === 'ERROR') {
      const errorEvent = event as ErrorEvent;
      msg = { type: 'ERROR', message: errorEvent.message };
    } else if (event.type === 'GPIO_TRACE') {
      const traceEvent = event as any;
      msg = { type: 'GPIO_TRACE', trace: traceEvent.trace };
    }

    if (msg) {
      ws.send(JSON.stringify(msg));
    }
  });

  return unsubscribe;
}
