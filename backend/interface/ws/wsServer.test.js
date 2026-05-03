import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import WebSocket from 'ws';
import { createServer } from './wsServer';
import { LCDService } from '../../application/services/lcdService';
import { ServerMessage } from './types';
describe('Phase 3 - WebSocket Interface Integration', () => {
    let wss;
    let service;
    const PORT = 8080;
    beforeEach(() => {
        service = new LCDService();
        wss = createServer(PORT, service);
    });
    afterEach(() => {
        wss.close();
    });
    it('should send INITIAL_STATE on connection', () => {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://localhost:${PORT}`);
            ws.on('message', (data) => {
                const msg = JSON.parse(data.toString());
                try {
                    expect(msg.type).toBe('STATE_UPDATE');
                    if (msg.type === 'STATE_UPDATE') {
                        expect(msg.state).toBeDefined();
                        expect(msg.state.ddram).toBeDefined();
                        // Checking if DDRAM was serialized out of Uint8Array securely
                        expect(Array.isArray(msg.state.ddram)).toBe(true);
                    }
                    ws.close();
                    resolve();
                }
                catch (e) {
                    ws.close();
                    reject(e);
                }
            });
        });
    });
    it('should process COMMAND message and broadcast state update', () => {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://localhost:${PORT}`);
            let messagesReceived = 0;
            ws.on('message', (data) => {
                messagesReceived++;
                const msg = JSON.parse(data.toString());
                try {
                    if (messagesReceived === 1) {
                        // Initial state received. Now send a command
                        expect(msg.type).toBe('STATE_UPDATE');
                        ws.send(JSON.stringify({ type: 'COMMAND', byte: 0x01 })); // Clear
                    }
                    else if (messagesReceived === 2) {
                        // Second message should be a LOG indicating the command executed
                        expect(msg.type).toBe('LOG_EVENT');
                    }
                    else if (messagesReceived === 3) {
                        // Third message should be the broadcast STATE_UPDATE resulting from the action
                        expect(msg.type).toBe('STATE_UPDATE');
                        ws.close();
                        resolve();
                    }
                }
                catch (e) {
                    ws.close();
                    reject(e);
                }
            });
        });
    });
    it('should handle malformed JSON input without crashing server', () => {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(`ws://localhost:${PORT}`);
            let messagesReceived = 0;
            ws.on('message', (data) => {
                messagesReceived++;
                const msg = JSON.parse(data.toString());
                try {
                    if (messagesReceived === 1) {
                        // Send invalid JSON
                        ws.send("{ INVALID JSON ]");
                    }
                    else if (messagesReceived === 2) {
                        // Must respond with structured ERROR instead of crashing backend
                        expect(msg.type).toBe('ERROR');
                        // Server MUST still be alive! Check via sending valid data
                        ws.send(JSON.stringify({ type: 'DATA', byte: 65 })); // 'A'
                    }
                    else if (msg.type === 'STATE_UPDATE' && messagesReceived > 2) {
                        // We received an update after sending 'A', proving server didn't crash
                        ws.close();
                        resolve();
                    }
                }
                catch (e) {
                    ws.close();
                    reject(e);
                }
            });
        });
    });
});
//# sourceMappingURL=wsServer.test.js.map