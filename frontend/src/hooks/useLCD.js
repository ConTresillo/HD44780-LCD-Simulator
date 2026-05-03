/**
 * useLCD.ts — Primary hook for LCD state and actions.
 * Components call this. They never touch the API or store directly.
 */
import { useHardware } from '../store/store';
import { api } from '../services';
export function useLCD() {
    const { hardware, view, connection, busState, dispatch } = useHardware();
    const setBusState = (bus) => {
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
//# sourceMappingURL=useLCD.js.map