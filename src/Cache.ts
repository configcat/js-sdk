import { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfigService";

export class LocalStorageCache implements ICache {
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