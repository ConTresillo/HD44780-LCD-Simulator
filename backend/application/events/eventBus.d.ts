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
export declare class EventBus {
    private listeners;
    subscribe(listener: Listener): () => void;
    emit(event: LCDEvent): void;
}
export {};
//# sourceMappingURL=eventBus.d.ts.map