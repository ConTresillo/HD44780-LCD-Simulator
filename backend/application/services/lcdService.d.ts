import type { LCDState } from '../../domain/lcd/lcdState.js';
import { EventBus } from '../events/eventBus.js';
import { LogService } from '../logs/logService.js';
import { ConfigService } from '../config/configService.js';
import type { Config } from '../../application/config/configService.js';
export declare class LCDService {
    state: LCDState;
    eventBus: EventBus;
    logService: LogService;
    configService: ConfigService;
    private executionQueue;
    private readonly MAX_QUEUE_DEPTH;
    private currentQueueSize;
    constructor();
    sendCommand(byte: number): Promise<void>;
    private waitForHardwareReady;
    private scheduleBusyClearUpdate;
    writeData(byte: number | string): Promise<void>;
    clearDisplay(): void;
    setAddress(address: number): void;
    updateConfig(newConfig: Partial<Config>): void;
    reset(): void;
    getState(): LCDState;
    getVisibleDisplay(): number[][];
    getGlyphs(): number[][][];
    getCursorPosition(): {
        row: number;
        col: number;
    };
    processGPIO(data: number, rs: boolean, en: boolean, rw?: boolean): void;
    pulseGPIO(data: number, rs: boolean, rw: boolean): void;
    emitStateUpdate(): void;
}
//# sourceMappingURL=lcdService.d.ts.map