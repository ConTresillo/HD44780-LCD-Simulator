/**
 * useLCD.ts — Primary hook for LCD state and actions.
 * Components call this. They never touch the API or store directly.
 */
import { useHardware } from '../store/store';
import { api } from '../services';
import type { LCDHardwareState, LCDView, ConnectionStatus, GPIOTrace } from '../services/api.types';

export type { GPIOTrace };

export type UseLCDReturn = {
  hardware: LCDHardwareState | null;
  view: LCDView | null;
  connection: ConnectionStatus;

  sendCommand: (byte: number) => void;
  writeData: (byte: number) => void;
  sendGPIO: (data: number, rs: boolean, rw: boolean, en: boolean) => void;
  reset: () => void;
  updateConfig: (config: any) => void;
  pulseEN: (data: number, rs: boolean, rw: boolean) => void;
  busState: { data: number, rs: boolean, rw: boolean, en: boolean };
  setBusState: (bus: Partial<{ data: number, rs: boolean, rw: boolean, en: boolean }>) => void;
};

export function useLCD(): UseLCDReturn {
  const { hardware, view, connection, busState, dispatch } = useHardware();

  const setBusState = (bus: any) => {
    dispatch({ type: 'BUS_UPDATE', bus });
    // Sync with backend immediately
    const next = { ...busState, ...bus };
    api.sendGPIO(next.data, next.rs, next.rw, next.en);
  };

  return {
    hardware,
    view,
    connection,
    busState,
    setBusState,

    sendCommand: (byte) => api.sendCommand(byte),
    writeData: (byte) => api.writeData(byte),
    sendGPIO: (data, rs, rw, en) => api.sendGPIO(data, rs, rw, en),
    reset: () => api.reset(),
    updateConfig: (config) => api.sendUpdateConfig(config),

    pulseEN: (data, rs, rw) => {
      setBusState({ data, rs, rw, en: true });
      setTimeout(() => setBusState({ data, rs, rw, en: false }), 2);
    },
  };
}
