import { ICache, ProjectConfig } from "configcat-common";

export class LocalStorageCache implements ICache {
    cache: { [key: string]: ProjectConfig } = {};

    set(key: string, config: ProjectConfig): void {
        this.cache[key] = config;

        try {
            localStorage.setItem(key, btoa(JSON.stringify(config)));
        } catch (ex) {
            // local storage is unavailable
        }
    }

    get(key: string): ProjectConfig {
        const config: ProjectConfig = this.cache[key];
        if (config) {
            return config;
        }

        try {
            const configString: string = localStorage.getItem(key);
            if (configString) {
                const config: ProjectConfig = JSON.parse(atob(configString));
                if (config) {
                    this.cache[key] = config;
                    return config;
                }
            }
        } catch (ex) {
            // local storage is unavailable or invalid cache value in localstorage
        }

        return null;
    }
}
