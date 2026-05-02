import { EventBus } from '../events/eventBus';

export type LogEntry = {
  timestamp: number;
  type: string;
  message: string;
};

export class LogService {
  private logs: LogEntry[] = [];
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  public log(type: string, message: string): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      type,
      message,
    };
    this.logs.push(entry);
    
    // Emit log event
    this.eventBus.emit({ type: 'LOG', log: entry });
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
}
