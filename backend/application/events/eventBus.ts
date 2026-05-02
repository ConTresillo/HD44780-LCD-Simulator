import type { LCDState } from '../../domain/lcd/lcdState.js';
import type { BusTrace } from '../../domain/lcd/types.js';

export type EventType = 'STATE_UPDATED' | 'LOG' | 'ERROR' | 'COMMAND_EXECUTED' | 'DATA_WRITTEN' | 'GPIO_TRACE';

export interface BaseEvent {
  type: EventType;
}

export interface GPIOTraceEvent extends BaseEvent {
  type: 'GPIO_TRACE';
  trace: BusTrace;
}

export interface StateUpdatedEvent extends BaseEvent {
  type: 'STATE_UPDATED';
  state: Pick<LCDState, keyof LCDState>;
}

export interface LogEvent extends BaseEvent {
  type: 'LOG';
  log: any;
}

export interface ErrorEvent extends BaseEvent {
  type: 'ERROR';
  message: string;
}

export type LCDEvent = StateUpdatedEvent | LogEvent | ErrorEvent | GPIOTraceEvent | BaseEvent;

type Listener = (event: LCDEvent) => void;

export class EventBus {
  private listeners: Listener[] = [];

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: LCDEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
