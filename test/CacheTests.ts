import { assert } from "chai";
import { LocalStorageCache } from "../lib/Cache";


describe("LocalStorageCache cache tests", () => {
    it("LocalStorageCache works with non latin 1 characters", () => {
        const cache = new LocalStorageCache();
        const key = "testkey";
        const text = "äöüÄÖÜçéèñışğâ¢™✓😀";
        cache.set(key, text);
        const retrievedValue = cache.get(key);
        assert.strictEqual(retrievedValue, text);
    });
});
