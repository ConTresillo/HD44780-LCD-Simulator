export class ConfigService {
    config;
    constructor(initialConfig) {
        this.config = {
            displayRows: 2,
            displayCols: 16,
            fastMode: false,
            ...initialConfig,
        };
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
//# sourceMappingURL=configService.js.map