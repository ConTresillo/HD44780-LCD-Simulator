import WebSocket from 'ws';
import { createServer } from './backend/interface/ws/wsServer';
import { LCDService } from './backend/application/services/lcdService';
async function runManualTest() {
    const service = new LCDService();
    const wss = createServer(8080, service);
    console.log("Starting dummy client...");
    const ws = new WebSocket("ws://localhost:8080");
    let messageCount = 0;
    ws.onmessage = (e) => {
        messageCount++;
        console.log(`[Message ${messageCount} Over WS] >`, e.data.toString());
        // We expect Message 1 to be Initial STATE_UPDATE
        // We expect Message 2 to be LOG_EVENT
        // We expect Message 3 to be STATE_UPDATE with 'H'
        if (messageCount === 3) {
            ws.close();
            wss.close();
            console.log("Shutting down cleanly.");
        }
    };
    ws.onopen = () => {
        console.log("Sending DATA 'H' to server...");
        ws.send(JSON.stringify({ type: "DATA", byte: 72 }));
    };
}
runManualTest().catch(console.error);
//# sourceMappingURL=manual_ws_test.test.js.map