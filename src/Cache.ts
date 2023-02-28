import type { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common";

export class LocalStorageCache implements ICache {
  cache: { [key: string]: ProjectConfig } = {};

  set(key: string, config: ProjectConfig): void {
    this.cache[key] = config;

    try {
      localStorage.setItem(key, btoa(JSON.stringify(config)));
    }
    catch (ex) {
      // local storage is unavailable
    }
  }

  get(key: string): ProjectConfig | null {
    const config: ProjectConfig = this.cache[key];
    if (config) {
      return config;
    }

    try {
      const configString: string | null = localStorage.getItem(key);
      if (configString) {
        const config: ProjectConfig = JSON.parse(atob(configString));
        // JSON.parse creates a plain object instance, so we need to manually restore the prototype
        // (so we don't run into "... is not a function" errors).
        (Object.setPrototypeOf || ((o, proto) => o["__proto__"] = proto))(config, ProjectConfig.prototype);

        if (config) {
          this.cache[key] = config;
          return config;
        }
      }
    }
    catch (ex) {
      // local storage is unavailable or invalid cache value in localstorage
    }

    return null;
  }
}
