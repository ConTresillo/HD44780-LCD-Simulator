import type { LCDState } from '../../domain/lcd/lcdState.js';
import type { LogEntry } from '../../application/logs/logService.js';
import type { GPIOTrace } from '../../application/events/eventBus.js';
export type ClientMessage = {
    type: 'COMMAND';
    byte: number;
} | {
    type: 'WRITE';
    byte: number;
} | {
    type: 'GPIO_SIGNAL';
    data: number;
    rs: boolean;
    rw: boolean;
    en: boolean;
} | {
    type: 'PULSE_GPIO';
    data: number;
    rs: boolean;
    rw: boolean;
} | {
    type: 'RESET';
} | {
    type: 'UPDATE_CONFIG';
    config: any;
};
export type ServerMessage = {
    type: 'STATE_UPDATE';
    state: LCDState;
    view: {
        rows: number;
        cols: number;
        display: number[][];
        cursor: {
            row: number;
            col: number;
        };
        cursorVisible: boolean;
        glyphs: number[][][];
    };
} | {
    type: 'LOG_EVENT';
    log: LogEntry;
} | {
    type: 'GPIO_TRACE';
    trace: GPIOTrace;
} | {
    type: 'ERROR';
    message: string;
};
//# sourceMappingURL=types.d.ts.map