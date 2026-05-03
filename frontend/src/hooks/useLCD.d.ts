import type { LCDHardwareState, LCDView, ConnectionStatus } from '../services/api.types';
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
    busState: {
        data: number;
        rs: boolean;
        rw: boolean;
        en: boolean;
    };
    setBusState: (bus: Partial<{
        data: number;
        rs: boolean;
        rw: boolean;
        en: boolean;
    }>) => void;
};
export declare function useLCD(): UseLCDReturn;
//# sourceMappingURL=useLCD.d.ts.map