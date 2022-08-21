import { ICache, ProjectConfig } from "configcat-common";

export class LocalStorageCache implements ICache {
    cache: { [key: string]: ProjectConfig } = {};

    set(key: string, config: ProjectConfig): void {
        this.cache[key] = config;
        const obj = {};
        obj[key] = btoa(JSON.stringify(config));
        try {
            chrome.storage.local.set(obj)
        } catch (ex) {
            // chrome storage local is unavailable
        }
    }

    get(key: string): ProjectConfig {
        const config: ProjectConfig = this.cache[key];
        if (config) {
            return config;
        }

        try {
            chrome.storage.local.get(key, (res) => {
                const configString: string = res[key];
                if (configString) {
                    const config: ProjectConfig = JSON.parse(atob(configString));
                    if (config) {
                        this.cache[key] = config;
                        return config;
                    }
                }
            });
        } catch (ex) {
            // chrome storage local is unavailable or invalid cache value.
        }

        return null;
    }
}
