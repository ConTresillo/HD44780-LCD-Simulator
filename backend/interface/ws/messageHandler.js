export function handleMessage(msg, service) {
    try {
        if (!msg || !msg.type) {
            throw new Error("Invalid message format");
        }
        switch (msg.type) {
            case 'COMMAND':
                service.sendCommand(msg.byte);
                break;
            case 'WRITE':
                service.writeData(msg.byte);
                break;
            case 'RESET':
                service.reset();
                break;
            case 'GPIO_SIGNAL':
                service.processGPIO(msg.data, msg.rs, msg.en, msg.rw);
                break;
            case 'UPDATE_CONFIG':
                service.updateConfig(msg.config);
                break;
            case 'PULSE_GPIO':
                service.pulseGPIO(msg.data, msg.rs, msg.rw);
                break;
            default:
                throw new Error(`Unknown message type: ${msg.type}`);
        }
    }
    catch (err) {
        service.eventBus.emit({ type: 'ERROR', message: err.message });
    }
}
//# sourceMappingURL=messageHandler.js.map