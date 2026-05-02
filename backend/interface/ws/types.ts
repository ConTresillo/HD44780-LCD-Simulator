import type { LCDState } from '../../domain/lcd/lcdState.js';
import type { LogEntry } from '../../application/logs/logService.js';
import type { GPIOTrace } from '../../application/events/eventBus.js';

export type ClientMessage =
  | { type: 'COMMAND'; byte: number }
  | { type: 'WRITE'; byte: number }
  | { type: 'GPIO_SIGNAL'; data: number; rs: boolean; en: boolean }
  | { type: 'RESET' };

export type ServerMessage =
  | { 
      type: 'STATE_UPDATE'; 
      state: LCDState;
      view: {
        display: number[][];
        cursor: { row: number; col: number; };
        cursorVisible: boolean;
        glyphs: number[][][];
      }
    }
  | { type: 'LOG_EVENT'; log: LogEntry }
  | { type: 'GPIO_TRACE'; trace: GPIOTrace }
  | { type: 'ERROR'; message: string };
