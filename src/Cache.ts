import { ProjectConfig } from "./ProjectConfigService";

export interface ICache {
    Set(config: ProjectConfig): void;

    Get(): ProjectConfig;
}

export class InMemoryCache implements ICache {
    cache: ProjectConfig;

    Set(config: ProjectConfig): void {
        this.cache = config;
    }
    Get(): ProjectConfig {
        var c: ProjectConfig = this.cache;

        return c;
    }
}

export default ICache;