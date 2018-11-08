import { IConfigService, ProjectConfig, ConfigServiceBase } from "./ProjectConfigService";
import { ConfigurationBase, ManualPollConfiguration } from "./ConfigCatClientConfiguration";
import IConfigFetcher from "./ConfigFetcher";
import ICache from "./Cache";

export class ManualPollService extends ConfigServiceBase implements IConfigService {

    public constructor(configFetcher: IConfigFetcher, cache: ICache, config: ManualPollConfiguration) {

        config.validate();

        super(configFetcher, cache, config);
    }

    getConfig(callback: (value: ProjectConfig) => void): void {

        callback(this.cache.Get());
    }
    refreshConfig(callback?: (value: ProjectConfig) => void): void {

        this.refreshLogicBase(this.cache.Get(), (newConfig) => {
            if (callback) {
                callback(newConfig);
            }
        });
    }
}