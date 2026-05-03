import WebSocket from 'ws';
export function setupEventBridge(ws, service) {
    const unsubscribe = service.eventBus.subscribe((event) => {
        // Only process if socket is open
        if (ws.readyState !== WebSocket.OPEN) {
            return;
        }
        let msg = null;
        if (event.type === 'STATE_UPDATED') {
            const stateEvent = event;
            const cursor = service.getCursorPosition();
            const config = service.configService.getConfig();
            const stateData = {
                ...stateEvent.state,
                ddram: Array.from(stateEvent.state.ddram),
                cgram: Array.from(stateEvent.state.cgram)
            };
            const viewData = {
                rows: config.displayRows,
                cols: config.displayCols,
                display: service.getVisibleDisplay(),
                cursor: { row: cursor.row, col: cursor.col },
                cursorVisible: cursor.row !== -1 && stateEvent.state.cursorOn && stateEvent.state.displayOn,
                glyphs: service.getGlyphs()
            };
            msg = { type: 'STATE_UPDATE', state: stateData, view: viewData };
        }
        else if (event.type === 'LOG') {
            const logEvent = event;
            msg = { type: 'LOG_EVENT', log: logEvent.log };
        }
        else if (event.type === 'ERROR') {
            const errorEvent = event;
            msg = { type: 'ERROR', message: errorEvent.message };
        }
        else if (event.type === 'GPIO_TRACE') {
            const traceEvent = event;
            msg = { type: 'GPIO_TRACE', trace: traceEvent.trace };
        }
        if (msg) {
            ws.send(JSON.stringify(msg));
        }
    });
    return unsubscribe;
}
//# sourceMappingURL=eventBridge.js.map