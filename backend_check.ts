import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('./node_modules/ws/index.js');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected to backend');
  ws.send(JSON.stringify({ type: 'RESET' }));
  setTimeout(() => {
    console.log('Test sequence complete, closing...');
    ws.close();
    process.exit(0);
  }, 1000);
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  console.log('Received:', msg.type);
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
  process.exit(1);
});
