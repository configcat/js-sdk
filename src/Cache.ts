import type { IConfigCatCache } from "configcat-common";

export class LocalStorageCache implements IConfigCatCache {
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, toUtf8Base64(value));
    }
    catch (ex) {
      // local storage is unavailable
    }
  }

  get(key: string): string | undefined {
    try {
      const configString = localStorage.getItem(key);
      if (configString) {
        return fromUtf8Base64(configString);
      }
    }
    catch (ex) {
      // local storage is unavailable or invalid cache value in localstorage
    }
    return void 0;
  }
}

export function toUtf8Base64(str: string): string {
  str = encodeURIComponent(str);
  str = str.replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
  return btoa(str);
}

export function fromUtf8Base64(str: string): string {
  str = atob(str);
  str = str.replace(/[%\x80-\xFF]/g, m => "%" + m.charCodeAt(0).toString(16));
  return decodeURIComponent(str);
}
