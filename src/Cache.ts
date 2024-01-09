import type { IConfigCatCache, IConfigCatKernel } from "configcat-common";
import { ExternalConfigCache } from "configcat-common";

export class LocalStorageCache implements IConfigCatCache {
  static setup(kernel: IConfigCatKernel, localStorageGetter?: () => Storage | null): IConfigCatKernel {
    const localStorage = (localStorageGetter ?? getLocalStorage)();
    if (localStorage) {
      kernel.defaultCacheFactory = options => new ExternalConfigCache(new LocalStorageCache(localStorage), options.logger);
    }
    return kernel;
  }

  constructor(private readonly storage: Storage) {
  }

  set(key: string, value: string): void {
    this.storage.setItem(key, toUtf8Base64(value));
  }

  get(key: string): string | undefined {
    const configString = this.storage.getItem(key);
    if (configString) {
      return fromUtf8Base64(configString);
    }
  }
}

export function getLocalStorage(): Storage | null {
  const testKey = "__configcat_localStorage_test";

  try {
    const storage = window.localStorage;
    storage.setItem(testKey, testKey);

    let retrievedItem: string | null;
    try { retrievedItem = storage.getItem(testKey); }
    finally { storage.removeItem(testKey); }

    if (retrievedItem === testKey) {
      return storage;
    }
  }
  catch (err) { /* intentional no-op */ }

  return null;
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
