import type { IConfigCatCache } from "configcat-common";

export class LocalStorageCache implements IConfigCatCache {
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, btoa(value));
    }
    catch (ex) {
      // local storage is unavailable
    }
  }

  get(key: string): string | undefined {
    try {
      const configString = localStorage.getItem(key);
      if (configString) {
        return atob(configString);
      }
    }
    catch (ex) {
      // local storage is unavailable or invalid cache value in localstorage
    }
  }
}
