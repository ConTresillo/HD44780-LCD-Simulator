/**
 * store.tsx — Granular app state.
 * Split into separate contexts to prevent unnecessary re-renders.
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { LCDHardwareState, LCDView, LogEntry, ConnectionStatus } from '../services/api.types';
import { api } from '../services';

// ── 1. HARDWARE STORE ────────────────────────────────────────────────────────
type HardwareState = {
  hardware: LCDHardwareState | null;
  view: LCDView | null;
  connection: ConnectionStatus;
  busState: {
    data: number;
    rs: boolean;
    rw: boolean;
    en: boolean;
  };
};

const initialHardware: HardwareState = {
  hardware: null,
  view: null,
  connection: 'disconnected',
  busState: {
    data: 0,
    rs: false,
    rw: false,
    en: false,
  }
};

const HardwareContext = createContext<HardwareState & { dispatch: React.Dispatch<any> } | null>(null);

function hardwareReducer(state: HardwareState, action: any): HardwareState {
  switch (action.type) {
    case 'LCD_UPDATE': return { ...state, hardware: action.hardware, view: action.view };
    case 'CONN_UPDATE': return { ...state, connection: action.status };
    case 'BUS_UPDATE': return { ...state, busState: { ...state.busState, ...action.bus } };
    default: return state;
  }
}

// ── 2. LOG STORE ─────────────────────────────────────────────────────────────
type LogState = { logs: LogEntry[] };
const initialLogs: LogState = { logs: [] };
const LogContext = createContext<LogState | null>(null);

const MAX_LOGS = 100;
function logReducer(state: LogState, action: any): LogState {
  if (action.type === 'LOG_APPEND') {
    return { logs: [...state.logs.slice(-(MAX_LOGS - 1)), action.entry] };
  }
  return state;
}

// ── PROVIDER COMPOSITION ─────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hwState, hwDispatch] = useReducer(hardwareReducer, initialHardware);
  const [logState, logDispatch] = useReducer(logReducer, initialLogs);

  useEffect(() => {
    const unsubState = api.onStateUpdate(({ state, view }) => {
      hwDispatch({ type: 'LCD_UPDATE', hardware: state, view });
    });
    const unsubConn = api.onConnectionChange(status => {
      hwDispatch({ type: 'CONN_UPDATE', status });
    });
    const unsubLog = api.onLog(entry => {
      logDispatch({ type: 'LOG_APPEND', entry });
    });

    api.connect();
    return () => {
      unsubState(); unsubConn(); unsubLog();
      api.disconnect();
    };
  }, []);

  return (
    <HardwareContext.Provider value={{ ...hwState, dispatch: hwDispatch }}>
      <LogContext.Provider value={logState}>
        {children}
      </LogContext.Provider>
    </HardwareContext.Provider>
  );
}

// ── HOOKS ────────────────────────────────────────────────────────────────────
export function useHardware() {
  const ctx = useContext(HardwareContext);
  if (!ctx) throw new Error('useHardware must be inside StoreProvider');
  return ctx;
}

export function useLogsStore() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogsStore must be inside StoreProvider');
  return ctx.logs;
}
