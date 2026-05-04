/**
 * api.interface.ts — Abstract API contract.
 * UI only speaks to this interface. Backend is swapped here.
 */
import type { LCDHardwareState, LCDView, LogEntry, ConnectionStatus } from './api.types';

export type LCDStatePayload = {
  state: LCDHardwareState;
  view: LCDView;
};

export interface LCDAPI {
  connect(url?: string): void;
  disconnect(): void;

  sendCommand(byte: number): void;
  writeData(byte: number): void;
  sendGPIO(data: number, rs: boolean, rw: boolean, en: boolean): void;
  pulseGPIO(data: number, rs: boolean, rw: boolean): void;
  reset(): void;
  updateGlyph(index: number, bitmap: number[]): void;
  sendUpdateConfig: (config: any) => void;
  sendAIRequest(prompt: string): void;

  onStateUpdate(cb: (payload: LCDStatePayload) => void): () => void;
  onLog(cb: (log: LogEntry) => void): () => void;
  onConnectionChange(cb: (status: ConnectionStatus) => void): () => void;

  getStatus(): ConnectionStatus;
  version: string;
}
