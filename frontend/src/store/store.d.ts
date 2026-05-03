/**
 * store.tsx — Granular app state.
 * Split into separate contexts to prevent unnecessary re-renders.
 */
import React from 'react';
import type { LCDHardwareState, LCDView, ConnectionStatus } from '../services/api.types';
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
export declare function StoreProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useHardware(): HardwareState & {
    dispatch: React.Dispatch<any>;
};
export declare function useLogsStore(): LogEntry[];
export {};
//# sourceMappingURL=store.d.ts.map