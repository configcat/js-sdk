import { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ConfigServiceBase";

export class LocalStorageCache implements ICache {
    cache:  { [apiKey: string] : ProjectConfig; } = {};

    Set(apiKey: string, config: ProjectConfig): void {
        this.cache[apiKey] = config;
    }

    Get(apiKey: string): ProjectConfig {
        return this.cache[apiKey];
    }
}