export type Config = {
    displayRows: number;
    displayCols: number;
    fastMode: boolean;
};
export declare class ConfigService {
    private config;
    constructor(initialConfig?: Partial<Config>);
    getConfig(): Config;
    updateConfig(newConfig: Partial<Config>): void;
}
//# sourceMappingURL=configService.d.ts.map