/**
 * websocket.api.ts — Real backend integration.
 * Communicates with the Node.js server via WebSocket.
 */
import { z } from 'zod';
// ── Validation Schemas ───────────────────────────────────────────────────────
const HardwareStateSchema = z.any();
const ViewSchema = z.any();
const StateUpdateSchema = z.any();
export function createWebSocketAPI(url = 'ws://localhost:3000') {
    let ws = null;
    let status = 'disconnected';
    let reconnectTimer = null;
    const stateCbs = new Set();
    const logCbs = new Set();
    const statusCbs = new Set();
    function setStatus(s) {
        status = s;
        statusCbs.forEach(cb => cb(s));
    }
    function cleanup() {
        if (ws) {
            ws.onopen = null;
            ws.onmessage = null;
            ws.onclose = null;
            ws.onerror = null;
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
            ws = null;
        }
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    }
    function connect() {
        if (status === 'connecting' || (ws && ws.readyState === WebSocket.OPEN))
            return;
        cleanup(); // ALWAYS cleanup before new attempt
        setStatus('connecting');
        try {
            ws = new WebSocket(url);
        }
        catch (err) {
            console.error('[WS] Creation error:', err);
            setStatus('error');
            scheduleReconnect();
            return;
        }
        const currentWs = ws; // Closure capture
        currentWs.onopen = () => {
            if (ws !== currentWs)
                return;
            console.log('[WS] Connected');
            setStatus('connected');
        };
        currentWs.onmessage = (event) => {
            if (ws !== currentWs)
                return;
            try {
                const msg = JSON.parse(event.data);
                handleServerMessage(msg);
            }
            catch (err) {
                console.error('[WS] Parse error:', err);
            }
        };
        currentWs.onclose = () => {
            if (ws !== currentWs)
                return;
            console.log('[WS] Closed');
            ws = null;
            if (status !== 'error')
                setStatus('disconnected');
            scheduleReconnect();
        };
        currentWs.onerror = () => {
            if (ws !== currentWs)
                return;
            setStatus('error');
        };
    }
    function scheduleReconnect() {
        if (reconnectTimer)
            clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(() => {
            console.log('[WS] Attempting reconnect...');
            connect();
        }, 3000);
    }
    function handleServerMessage(msg) {
        switch (msg.type) {
            case 'STATE_UPDATE':
                const result = StateUpdateSchema.safeParse(msg);
                if (!result.success) {
                    console.error('[WS] Invalid STATE_UPDATE payload:', JSON.stringify(result.error.format(), null, 2));
                    logCbs.forEach(cb => cb({
                        timestamp: Date.now(),
                        type: 'ERROR',
                        message: 'Received malformed state from hardware simulator'
                    }));
                    return;
                }
                stateCbs.forEach(cb => cb({
                    state: result.data.state,
                    view: result.data.view
                }));
                break;
            case 'LOG_EVENT':
                const log = msg.log;
                logCbs.forEach(cb => cb({
                    timestamp: log.timestamp || Date.now(),
                    type: log.type || 'CONTROL',
                    message: log.message
                }));
                break;
            case 'GPIO_TRACE':
                // Optional: We could route traces to logs or a separate trace panel
                // For now, let's treat important traces as log events if they executed something
                if (msg.trace.executed) {
                    logCbs.forEach(cb => cb({
                        timestamp: Date.now(),
                        type: 'CONTROL',
                        message: `GPIO: Executed ${msg.trace.instruction}`
                    }));
                }
                break;
            case 'ERROR':
                logCbs.forEach(cb => cb({
                    timestamp: Date.now(),
                    type: 'ERROR',
                    message: msg.message
                }));
                break;
        }
    }
    function send(msg) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
        }
        else {
            console.warn('[WS] Cannot send, socket not open:', msg);
        }
    }
    return {
        connect() {
            connect();
        },
        disconnect() {
            if (ws) {
                ws.close();
                ws = null;
            }
            if (reconnectTimer)
                clearTimeout(reconnectTimer);
            setStatus('disconnected');
        },
        sendCommand(byte) {
            send({ type: 'COMMAND', byte });
        },
        writeData(byte) {
            send({ type: 'WRITE', byte });
        },
        sendGPIO(data, rs, rw, en) {
            send({ type: 'GPIO_SIGNAL', data, rs, rw, en });
        },
        pulseGPIO(data, rs, rw) {
            send({ type: 'PULSE_GPIO', data, rs, rw });
        },
        reset() {
            send({ type: 'RESET' });
        },
        sendUpdateConfig(config) {
            send({ type: 'UPDATE_CONFIG', config });
        },
        onStateUpdate(cb) {
            stateCbs.add(cb);
            return () => stateCbs.delete(cb);
        },
        onLog(cb) {
            logCbs.add(cb);
            return () => logCbs.delete(cb);
        },
        onConnectionChange(cb) {
            statusCbs.add(cb);
            return () => statusCbs.delete(cb);
        },
        getStatus() {
            return status;
        }
    };
}
//# sourceMappingURL=websocket.api.js.map