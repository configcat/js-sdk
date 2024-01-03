import { assert } from "chai";
import { LogLevel } from "configcat-common";
import { LocalStorageCache, fromUtf8Base64, getLocalStorage, toUtf8Base64 } from "../src/Cache";
import { FakeLogger } from "./helpers/fakes";
import { createClientWithLazyLoad } from "./helpers/utils";

describe("Base64 encode/decode test", () => {
  let allBmpChars = "";
  for (let i = 0; i <= 0xFFFF; i++) {
    if (i < 0xD800 || 0xDFFF < i) { // skip lone surrogate chars
      allBmpChars += String.fromCharCode(i);
    }
  }

  for (const input of [
    "",
    "\n",
    "äöüÄÖÜçéèñışğâ¢™✓😀",
    allBmpChars
  ]) {
    it(`Base64 encode/decode works - input: ${input.slice(0, Math.min(input.length, 128))}`, () => {
      assert.strictEqual(fromUtf8Base64(toUtf8Base64(input)), input);
    });
  }
});

describe("LocalStorageCache cache tests", () => {
  it("LocalStorageCache works with non latin 1 characters", () => {
    const localStorage = getLocalStorage();
    assert.isNotNull(localStorage);

    const cache = new LocalStorageCache(localStorage!);
    const key = "testkey";
    const text = "äöüÄÖÜçéèñışğâ¢™✓😀";
    cache.set(key, text);
    const retrievedValue = cache.get(key);
    assert.strictEqual(retrievedValue, text);
    assert.strictEqual(window.localStorage.getItem(key), "w6TDtsO8w4TDlsOcw6fDqcOow7HEscWfxJ/DosKi4oSi4pyT8J+YgA==");
  });

  it("Error is logged when LocalStorageCache.get throws", async () => {
    const errorMessage = "Something went wrong.";
    const faultyLocalStorage: Storage = {
      get length() { return 0; },
      clear() { },
      getItem() { throw Error(errorMessage); },
      setItem() { },
      removeItem() { },
      key() { return null; }
    };

    const fakeLogger = new FakeLogger();

    const client = createClientWithLazyLoad("configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/AG6C1ngVb0CvM07un6JisQ", { logger: fakeLogger },
      kernel => LocalStorageCache.setup(kernel, () => faultyLocalStorage));

    try { await client.getValueAsync("stringDefaultCat", ""); }
    finally { client.dispose(); }

    assert.isDefined(fakeLogger.events.find(([level, eventId, , err]) => level === LogLevel.Error && eventId === 2200 && err instanceof Error && err.message === errorMessage));
  });

  it("Error is logged when LocalStorageCache.set throws", async () => {
    const errorMessage = "Something went wrong.";
    const faultyLocalStorage: Storage = {
      get length() { return 0; },
      clear() { },
      getItem() { return null; },
      setItem() { throw Error(errorMessage); },
      removeItem() { },
      key() { return null; }
    };

    const fakeLogger = new FakeLogger();

    const client = createClientWithLazyLoad("configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/AG6C1ngVb0CvM07un6JisQ", { logger: fakeLogger },
      kernel => LocalStorageCache.setup(kernel, () => faultyLocalStorage));

    try { await client.getValueAsync("stringDefaultCat", ""); }
    finally { client.dispose(); }

    assert.isDefined(fakeLogger.events.find(([level, eventId, , err]) => level === LogLevel.Error && eventId === 2201 && err instanceof Error && err.message === errorMessage));
  });
});
