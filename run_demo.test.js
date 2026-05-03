import { describe, it, expect } from 'vitest';
import { LCDService } from "./backend/application/services/lcdService";
describe('LCD Simulation Demo', () => {
    it('should run a sequence of commands and log state updates', async () => {
        const service = new LCDService();
        service.eventBus.subscribe((event) => {
            if (event.type === 'LOG') {
                process.stdout.write(`[EVENT: LOG] ${event.log.type}: ${event.log.message}\n`);
            }
            else {
                process.stdout.write(`[EVENT: ${event.type}]\n`);
            }
        });
        process.stdout.write("--- Starting Simulation ---\n");
        const forceReady = () => {
            service.state.busyFlag = false;
            service.state.busyUntil = 0;
        };
        // MANDATORY INITIALIZATION SEQUENCE (8-bit mode, 3 pulses)
        service.sendCommand(0x30);
        service.sendCommand(0x30);
        service.sendCommand(0x30);
        forceReady();
        // Clear display
        service.sendCommand(0x01);
        forceReady();
        // Write 'H'
        service.writeData(0x48);
        forceReady();
        // Write 'i'
        service.writeData(0x69);
        forceReady();
        process.stdout.write("--- Simulation Finished ---\n");
        const finalState = service.getState();
        process.stdout.write(`FINAL ADDRESS POINTER: ${finalState.addressPointer}\n`);
        process.stdout.write(`BUFFER (First 5 bytes): ${Array.from(finalState.ddram.slice(0, 5)).join(', ')}\n`);
        expect(finalState.addressPointer).toBe(2);
        expect(finalState.ddram[0]).toBe(0x48);
        expect(finalState.ddram[1]).toBe(0x69);
    });
});
//# sourceMappingURL=run_demo.test.js.map