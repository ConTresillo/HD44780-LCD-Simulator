import { LCDService } from '../backend/application/services/lcdService.js';
const service = new LCDService();
// Init pulses
service.sendCommand(0x30);
service.sendCommand(0x30);
service.sendCommand(0x30);
service.state.busyFlag = false;
// Display ON
service.sendCommand(0x0C);
service.state.busyFlag = false;
// Set 2-line mode
service.sendCommand(0x38);
service.state.busyFlag = false;
// Set address to 0x00 (Row 1)
service.sendCommand(0x80);
service.state.busyFlag = false;
service.writeData('A');
service.state.busyFlag = false;
// Set address to 0x40 (Row 2)
service.sendCommand(0xC0);
service.state.busyFlag = false;
service.writeData('B');
service.state.busyFlag = false;
const display = service.getVisibleDisplay();
console.log(`Initialized: ${service.state.initialized}`);
console.log(`Display ON: ${service.state.displayOn}`);
console.log('Row 1: [' + display[0].map(c => String.fromCharCode(c)).join('') + ']');
console.log('Row 2: [' + display[1].map(c => String.fromCharCode(c)).join('') + ']');
const cursor = service.getCursorPosition();
console.log('Cursor:', cursor);
//# sourceMappingURL=test_rows.js.map