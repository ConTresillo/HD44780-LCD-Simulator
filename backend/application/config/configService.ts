export type Config = {
  displayRows: number;
  displayCols: number;
};

export class ConfigService {
  private config: Config;

  constructor(initialConfig?: Partial<Config>) {
    this.config = {
      displayRows: 2,
      displayCols: 16,
      ...initialConfig,
    };
  }

  public getConfig(): Config {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<Config>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
