import { ICache, ProjectConfig } from "configcat-common/lib/esm";

export class LocalStorageCache implements ICache {
    cache:  { [sdkkey: string] : ProjectConfig; } = {};

    Set(sdkkey: string, config: ProjectConfig): void {
        this.cache[sdkkey] = config;

        try {
            localStorage.setItem(this.getLocalStorageKey(sdkkey), btoa(JSON.stringify(config)));
        } catch (ex) {
            // local storage is unavailable
        }
    }

    Get(sdkkey: string): ProjectConfig {
        let config: any = this.cache[sdkkey];
        if (config) {
            return config;
        }

        try {
            let configString: string = localStorage.getItem(this.getLocalStorageKey(sdkkey));
            if (configString) {
                let config: any = JSON.parse(atob(configString));
                if (config) {
                    this.cache[sdkkey] = config;
                    return config;
                }
            }
        } catch (ex) {
            // local storage is unavailable or invalid cache value in localstorage
        }

        return null;
    }

    private getLocalStorageKey(sdkkey: string): string{
        return "ConfigCat_v4" + sdkkey;
    }
}