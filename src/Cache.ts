import { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfig";

export class LocalStorageCache implements ICache {
    cache:  { [apiKey: string] : ProjectConfig; } = {};

    Set(apiKey: string, config: ProjectConfig): void {
        this.cache[apiKey] = config;

        try {
            localStorage.setItem(this.getLocalStorageKey(apiKey), btoa(JSON.stringify(config)));
        } catch (ex) {
            // local storage is unavailable
        }
    }

    Get(apiKey: string): ProjectConfig {
        let config = this.cache[apiKey];
        if (config) {
            return config;
        }

        try {
            let configString = localStorage.getItem(this.getLocalStorageKey(apiKey));
            if (configString) {
                let config = JSON.parse(atob(configString));
                if (config) {
                    this.cache[apiKey] = config;
                    return config;
                }
            }
        } catch (ex) {
            // local storage is unavailable or invalid cache value in localstorage
        }

        return null;
    }

    private getLocalStorageKey(apiKey: string): string{
        return "ConfigCat_v4" + apiKey;
    }
}