/**
 * api.types.ts — Backend contract definitions.
 * Update ONLY this file when the backend schema changes.
 */

export type LCDHardwareState = {
  ddram: number[];
  cgram: number[];
  addressPointer: number;
  ramType: 'DDRAM' | 'CGRAM';
  displayOn: boolean;
  cursorOn: boolean;
  blinkOn: boolean;
  entryModeIncrement: boolean;
  entryModeShift: boolean;
  shiftOffset: number;
  dataLength: 8 | 4;
  numLines: 1 | 2 | 4;
  font: '5x8' | '5x10';
  rs: boolean;
  rw: boolean;
  en: boolean;
  busyFlag: boolean;
  busyUntil: number;
  initialized: boolean;
  initCount: number;
  powerOnTime: number;
  fastMode: boolean;
};

export type LCDView = {
  rows: number;
  cols: number;
  display: number[][];
  cursor: { row: number; col: number };
  cursorVisible: boolean;
  glyphs: number[][][];
};

export type LogEntry = {
  timestamp: number;
  type: 'COMMAND' | 'DATA' | 'ERROR' | 'CONTROL';
  message: string;
};

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type GPIOTrace = {
  timestamp: number;
  rs: boolean;
  rw: boolean;
  en: boolean;
  data: number;
  mode: '8bit' | '4bit';
  nibblePhase: 'HIGH' | 'LOW' | null;
  assembledByte: number | null;
  executed: boolean;
  instruction?: string;
};
