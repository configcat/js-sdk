import type { IConfigCatCache } from "configcat-common";

export class LocalStorageCache implements IConfigCatCache {
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, this.b64EncodeUnicode(value));
    }
    catch (ex) {
      // local storage is unavailable
    }
  }

  get(key: string): string | undefined {
    try {
      const configString = localStorage.getItem(key);
      if (configString) {
        return this.b64DecodeUnicode(configString);
      }
    }
    catch (ex) {
      // local storage is unavailable or invalid cache value in localstorage
    }
    return void 0;
  }

  private b64EncodeUnicode(str: string): string {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p1) {
      return String.fromCharCode(parseInt(p1, 16))
    }));
  }

  private b64DecodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c: string) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));
  }
}
