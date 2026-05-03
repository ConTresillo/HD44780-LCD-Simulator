import { jsx as _jsx } from "react/jsx-runtime";
/**
 * store.tsx — Granular app state.
 * Split into separate contexts to prevent unnecessary re-renders.
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { api } from '../services';
const initialHardware = {
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
const HardwareContext = createContext(null);
function hardwareReducer(state, action) {
    switch (action.type) {
        case 'LCD_UPDATE': return { ...state, hardware: action.hardware, view: action.view };
        case 'CONN_UPDATE': return { ...state, connection: action.status };
        case 'BUS_UPDATE': return { ...state, busState: { ...state.busState, ...action.bus } };
        default: return state;
    }
}
const initialLogs = { logs: [] };
const LogContext = createContext(null);
const MAX_LOGS = 100;
function logReducer(state, action) {
    if (action.type === 'LOG_APPEND') {
        return { logs: [...state.logs.slice(-(MAX_LOGS - 1)), action.entry] };
    }
    return state;
}
// ── PROVIDER COMPOSITION ─────────────────────────────────────────────────────
export function StoreProvider({ children }) {
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
            unsubState();
            unsubConn();
            unsubLog();
            api.disconnect();
        };
    }, []);
    return (_jsx(HardwareContext.Provider, { value: { ...hwState, dispatch: hwDispatch }, children: _jsx(LogContext.Provider, { value: logState, children: children }) }));
}
// ── HOOKS ────────────────────────────────────────────────────────────────────
export function useHardware() {
    const ctx = useContext(HardwareContext);
    if (!ctx)
        throw new Error('useHardware must be inside StoreProvider');
    return ctx;
}
export function useLogsStore() {
    const ctx = useContext(LogContext);
    if (!ctx)
        throw new Error('useLogsStore must be inside StoreProvider');
    return ctx.logs;
}
//# sourceMappingURL=store.js.map