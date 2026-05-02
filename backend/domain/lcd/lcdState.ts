import { LCD_CONSTANTS } from './lcdConstants.js';

export const { DDRAM_SIZE, CGRAM_SIZE } = LCD_CONSTANTS;

export type LCDState = {
  ddram: Uint8Array;
  cgram: Uint8Array;
  addressPointer: number;
  ramType: 'DDRAM' | 'CGRAM';
  displayOn: boolean;
  cursorOn: boolean;
  blinkOn: boolean;
  entryModeIncrement: boolean;
  entryModeShift: boolean;
  shiftOffset: number;
  font: '5x8' | '5x10';
  rs: boolean;
  rw: boolean;
  en: boolean;
  pendingNibble: number | null;
  pendingRs: boolean | null;
  pendingRw: boolean | null;
  dataLength: 4 | 8;
  numLines: 1 | 2;
  busyFlag: boolean;
  busyUntil: number; // timestamp in ms
  initialized: boolean;
  initCount: number;
  powerOnTime: number;
};

export function createInitialState(): LCDState {
  return {
    ddram: new Uint8Array(DDRAM_SIZE).fill(0x20),
    cgram: new Uint8Array(CGRAM_SIZE).fill(0),
    addressPointer: 0,
    ramType: 'DDRAM',
    displayOn: false, // Hardware default is OFF
    cursorOn: false,
    blinkOn: false,
    entryModeIncrement: true,
    entryModeShift: false,
    shiftOffset: 0,
    dataLength: 8,
    numLines: 1,
    font: '5x8',
    rs: false,
    rw: false,
    en: false,
    pendingNibble: null,
    pendingRs: null,
    pendingRw: null,
    busyFlag: false,
    busyUntil: 0,
    initialized: false,
    initCount: 0,
    powerOnTime: Date.now(),
  };
}
