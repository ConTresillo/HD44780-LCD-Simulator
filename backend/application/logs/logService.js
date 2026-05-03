import { EventBus } from '../events/eventBus';
export class LogService {
    logs = [];
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    log(type, message) {
        const entry = {
            timestamp: Date.now(),
            type,
            message,
        };
        this.logs.push(entry);
        // Emit log event
        this.eventBus.emit({ type: 'LOG', log: entry });
    }
    getLogs() {
        return [...this.logs];
    }
}
//# sourceMappingURL=logService.js.map