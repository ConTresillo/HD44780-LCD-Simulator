import { EventBus } from '../events/eventBus';
export type LogEntry = {
    timestamp: number;
    type: string;
    message: string;
};
export declare class LogService {
    private logs;
    private eventBus;
    constructor(eventBus: EventBus);
    log(type: string, message: string): void;
    getLogs(): LogEntry[];
}
//# sourceMappingURL=logService.d.ts.map