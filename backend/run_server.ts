import { LCDService } from './application/services/lcdService.js';
import { createServer } from './interface/ws/wsServer.js';

const PORT = Number(process.env.PORT) || 3000;
const service = new LCDService();

const wss = createServer(PORT, service);

console.log(`LCDSIM Backend Service Online at port ${PORT}`);
