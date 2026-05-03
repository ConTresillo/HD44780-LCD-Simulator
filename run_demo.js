import { LCDService } from "./backend/application/services/lcdService";
async function runSimulation() {
    const service = new LCDService();
    service.eventBus.subscribe((event) => {
        // Basic console.log for event monitoring
        // We check the type to avoid printing the entire Uint8Array for every state update in this demo
        if (event.type === 'LOG') {
            console.log(`[EVENT: LOG] ${event.log.type}: ${event.log.message}`);
        }
        else {
            console.log(`[EVENT: ${event.type}]`);
        }
    });
    console.log("--- Starting Simulation ---");
    // Clear display
    service.sendCommand(0x01);
    // Write 'H'
    service.writeData(0x48);
    // Write 'i'
    service.writeData(0x69);
    console.log("--- Simulation Finished ---");
    const finalState = service.getState();
    console.log("FINAL ADDRESS POINTER:", finalState.addressPointer);
    console.log("BUFFER (First 5 bytes):", finalState.ddram.slice(0, 5));
}
runSimulation().catch(console.error);
//# sourceMappingURL=run_demo.js.map