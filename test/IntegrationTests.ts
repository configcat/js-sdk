import { assert } from "chai";
import { IConfigCatClient, IOptions, PollingMode, IEvaluationDetails, User, LogLevel, SettingKeyValue } from "configcat-common";
import * as configcatClient from "../src/index";
import { createConsoleLogger, OptionsForPollingMode } from "../src/index";

type InitFunc = (callback: (...args: any[]) => void) => void;

const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

for (const sharedClient of [false, true]) {
  let clientFactory: <TPollingMode extends PollingMode>(sdkKey: string, pollingMode: TPollingMode, options: OptionsForPollingMode<TPollingMode>) => IConfigCatClient;
  if (sharedClient) {
    clientFactory = configcatClient.getClient;
  }
  else {
    clientFactory = (sdkKey, pollingMode, options) =>
      pollingMode === PollingMode.AutoPoll ? configcatClient.createClientWithAutoPoll(sdkKey, options) :
      pollingMode === PollingMode.ManualPoll ? configcatClient.createClientWithManualPoll(sdkKey, options) :
      pollingMode === PollingMode.LazyLoad ? configcatClient.createClientWithLazyLoad(sdkKey, options) :
      (() => { throw new Error("Invalid 'pollingMode' value"); })();
  }

  const clientMode = `${sharedClient ? "Shared" : "Normal"} client`;

  describe(`Integration tests - Normal use - ${clientMode}`, () => {

    const options: IOptions = { logger: createConsoleLogger(LogLevel.Off) };

    for (const pollingMode of [PollingMode.AutoPoll, PollingMode.ManualPoll, PollingMode.LazyLoad]) {
      const clientAndPollingMode = `${clientMode} with ${PollingMode[pollingMode]}`;

      let client: IConfigCatClient;

      beforeEach(function() {
        client = clientFactory(sdkKey, pollingMode, options);
      });

      afterEach(function() {
        client.dispose();
      });

      it(`${clientAndPollingMode} - getValue() with key: 'stringDefaultCat' should return 'Cat'`, (done) => {

        const defaultValue = "NOT_CAT";

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValue("stringDefaultCat", defaultValue, actual => {
            assert.strictEqual(actual, "Cat");
            assert.notStrictEqual(actual, defaultValue);
            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getValueAsync() with key: 'stringDefaultCat' should return 'Cat'`, async () => {

        const defaultValue = "NOT_CAT";

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
        assert.strictEqual(actual, "Cat");
        assert.notStrictEqual(actual, defaultValue);
      });

      it(`${clientAndPollingMode} - getValue() with key: 'NotExistsKey' should return default value`, (done) => {

        const defaultValue = "NOT_CAT";

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValue("NotExistsKey", defaultValue, actual => {
            assert.equal(actual, defaultValue);
            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getValueAsync() with key: 'NotExistsKey' should return default value`, async () => {

        const defaultValue = "NOT_CAT";

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: string = await client.getValueAsync("NotExistsKey", defaultValue);
        assert.equal(actual, defaultValue);
      });

      it(`${clientAndPollingMode} - getValue() with key: 'RolloutEvaluate' should return default value`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {
            assert.equal(actual, "Horse");
            done();
          }, new User("nacho@gmail.com"));
        });
      });

      it(`${clientAndPollingMode} - getValueAsync() with key: 'RolloutEvaluate' should return default value`, async () => {
        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: string = await client.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
        assert.equal(actual, "Horse");
      });

      it(`${clientAndPollingMode} - getValueDetails() with key: 'stringDefaultCat' should return 'Cat'`, (done) => {

        const defaultValue = "NOT_CAT";

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValueDetails("stringDefaultCat", defaultValue, actual => {
            assert.strictEqual(actual.value, "Cat");
            assert.isFalse(actual.isDefaultValue);
            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getValueDetailsAsync() with key: 'stringDefaultCat' should return 'Cat'`, async () => {

        const defaultValue = "NOT_CAT";

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: IEvaluationDetails = await client.getValueDetailsAsync("stringDefaultCat", defaultValue);
        assert.strictEqual(actual.value, "Cat");
        assert.isFalse(actual.isDefaultValue);
      });

      it(`${clientAndPollingMode} - getValueDetails() with key: 'NotExistsKey' should return default value`, (done) => {

        const defaultValue = "NOT_CAT";

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValueDetails("NotExistsKey", defaultValue, actual => {
            assert.strictEqual(actual.value, defaultValue);
            assert.isTrue(actual.isDefaultValue);
            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getValueDetailsAsync() with key: 'NotExistsKey' should return default value`, async () => {

        const defaultValue = "NOT_CAT";

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: IEvaluationDetails = await client.getValueDetailsAsync("NotExistsKey", defaultValue);
        assert.strictEqual(actual.value, defaultValue);
        assert.isTrue(actual.isDefaultValue);
      });

      it(`${clientAndPollingMode} - getValue() with key: 'RolloutEvaluate' should return default value`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {
            assert.equal(actual, "Horse");
            done();
          }, new User("nacho@gmail.com"));
        });
      });

      it(`${clientAndPollingMode} - getAllKeys() should return all keys`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getAllKeys(keys => {

            assert.equal(keys.length, 16);
            const keysObject: any = {};
            keys.forEach(value => keysObject[value] = {});
            assert.containsAllKeys(keysObject, [
              "stringDefaultCat",
              "stringIsInDogDefaultCat",
              "stringIsNotInDogDefaultCat",
              "stringContainsDogDefaultCat",
              "stringNotContainsDogDefaultCat",
              "string25Cat25Dog25Falcon25Horse",
              "string75Cat0Dog25Falcon0Horse",
              "string25Cat25Dog25Falcon25HorseAdvancedRules",
              "boolDefaultTrue",
              "boolDefaultFalse",
              "bool30TrueAdvancedRules",
              "integer25One25Two25Three25FourAdvancedRules",
              "integerDefaultOne",
              "doubleDefaultPi",
              "double25Pi25E25Gr25Zero",
              "keySampleText"
            ]);
            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getAllKeysAsync() should return all keys`, async () => {

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const keys: string[] = await client.getAllKeysAsync();

        assert.equal(keys.length, 16);
        const keysObject: any = {};
        keys.forEach(value => keysObject[value] = {});
        assert.containsAllKeys(keysObject, [
          "stringDefaultCat",
          "stringIsInDogDefaultCat",
          "stringIsNotInDogDefaultCat",
          "stringContainsDogDefaultCat",
          "stringNotContainsDogDefaultCat",
          "string25Cat25Dog25Falcon25Horse",
          "string75Cat0Dog25Falcon0Horse",
          "string25Cat25Dog25Falcon25HorseAdvancedRules",
          "boolDefaultTrue",
          "boolDefaultFalse",
          "bool30TrueAdvancedRules",
          "integer25One25Two25Three25FourAdvancedRules",
          "integerDefaultOne",
          "doubleDefaultPi",
          "double25Pi25E25Gr25Zero",
          "keySampleText"
        ]);
      });

      it(`${clientAndPollingMode} - getVariationId() works`, (done) => {

        const defaultValue = "NOT_CAT";

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getVariationId("stringDefaultCat", defaultValue, actual => {
            assert.strictEqual(actual, "7a0be518");

            client.getVariationId("boolDefaultTrue", defaultValue, actual => {
              assert.strictEqual(actual, "09513143");
              done();
            });
          });
        });
      });

      it(`${clientAndPollingMode} - getVariationIdAsync() works`, async () => {

        const defaultValue = "NOT_CAT";

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        let actual: string = await client.getVariationIdAsync("stringDefaultCat", defaultValue);
        assert.strictEqual(actual, "7a0be518");

        actual = await client.getVariationIdAsync("boolDefaultTrue", defaultValue);
        assert.strictEqual(actual, "09513143");
      });

      it(`${clientAndPollingMode} - getAllVariationIds() works`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getAllVariationIds(actual => {
            assert.equal(actual.length, 16);
            assert.strictEqual(actual[0], "7a0be518");
            assert.strictEqual(actual[1], "83372510");
            assert.strictEqual(actual[2], "2459598d");
            assert.strictEqual(actual[3], "ce564c3a");
            assert.strictEqual(actual[4], "44ab483a");
            assert.strictEqual(actual[5], "2588a3e6");
            assert.strictEqual(actual[6], "aa65b5ce");
            assert.strictEqual(actual[7], "8250ef5a");
            assert.strictEqual(actual[8], "09513143");
            assert.strictEqual(actual[9], "489a16d2");
            assert.strictEqual(actual[10], "607147d5");
            assert.strictEqual(actual[11], "ce3c4f5a");
            assert.strictEqual(actual[12], "faadbf54");
            assert.strictEqual(actual[13], "5af8acc7");
            assert.strictEqual(actual[14], "9503a1de");
            assert.strictEqual(actual[15], "69ef126c");

            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getAllVariationIdsAsync() works`, async () => {

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const actual: string[] = await client.getAllVariationIdsAsync();
        assert.equal(actual.length, 16);
        assert.strictEqual(actual[0], "7a0be518");
        assert.strictEqual(actual[1], "83372510");
        assert.strictEqual(actual[2], "2459598d");
        assert.strictEqual(actual[3], "ce564c3a");
        assert.strictEqual(actual[4], "44ab483a");
        assert.strictEqual(actual[5], "2588a3e6");
        assert.strictEqual(actual[6], "aa65b5ce");
        assert.strictEqual(actual[7], "8250ef5a");
        assert.strictEqual(actual[8], "09513143");
        assert.strictEqual(actual[9], "489a16d2");
        assert.strictEqual(actual[10], "607147d5");
        assert.strictEqual(actual[11], "ce3c4f5a");
        assert.strictEqual(actual[12], "faadbf54");
        assert.strictEqual(actual[13], "5af8acc7");
        assert.strictEqual(actual[14], "9503a1de");
        assert.strictEqual(actual[15], "69ef126c");
      });

      it(`${clientAndPollingMode} - getAllValues() should return all values`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getAllValues((sks) => {

            const settingKeys: any = {};

            sks.forEach((i) => (settingKeys[i.settingKey] = i.settingValue));

            assert.equal(sks.length, 16);

            assert.equal(settingKeys.stringDefaultCat, "Cat");
            assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
            assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
            assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
            assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
            assert.equal(settingKeys.boolDefaultTrue, true);
            assert.equal(settingKeys.boolDefaultFalse, false);
            assert.equal(settingKeys.bool30TrueAdvancedRules, true);
            assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
            assert.equal(settingKeys.integerDefaultOne, 1);
            assert.equal(settingKeys.doubleDefaultPi, 3.1415);
            assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
            assert.equal(settingKeys.keySampleText, "Cat");

            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getAllValuesAsync() should return all values`, async () => {

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const sks: SettingKeyValue[] = await client.getAllValuesAsync();
        const settingKeys: any = {};
        sks.forEach((i) => (settingKeys[i.settingKey] = i.settingValue));
        assert.equal(sks.length, 16);
        assert.equal(settingKeys.stringDefaultCat, "Cat");
        assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
        assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
        assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
        assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
        assert.equal(settingKeys.boolDefaultTrue, true);
        assert.equal(settingKeys.boolDefaultFalse, false);
        assert.equal(settingKeys.bool30TrueAdvancedRules, true);
        assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
        assert.equal(settingKeys.integerDefaultOne, 1);
        assert.equal(settingKeys.doubleDefaultPi, 3.1415);
        assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
        assert.equal(settingKeys.keySampleText, "Cat");
      });

      it(`${clientAndPollingMode} - getAllValueDetais() should return all values with details`, (done) => {

        const init: InitFunc = pollingMode === PollingMode.ManualPoll ? callback => client.forceRefresh(callback) : callback => callback();

        init(() => {
          client.getAllValueDetails((eds) => {

            const settingKeys: any = {};

            assert.equal(eds.length, 16);
            eds.forEach(ed => {
              assert.isFalse(ed.isDefaultValue);
              (settingKeys[ed.key] = ed.value);
            });

            assert.equal(settingKeys.stringDefaultCat, "Cat");
            assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
            assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
            assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
            assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
            assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
            assert.equal(settingKeys.boolDefaultTrue, true);
            assert.equal(settingKeys.boolDefaultFalse, false);
            assert.equal(settingKeys.bool30TrueAdvancedRules, true);
            assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
            assert.equal(settingKeys.integerDefaultOne, 1);
            assert.equal(settingKeys.doubleDefaultPi, 3.1415);
            assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
            assert.equal(settingKeys.keySampleText, "Cat");

            done();
          });
        });
      });

      it(`${clientAndPollingMode} - getAllValueDetailsAsync() should return all values with details`, async () => {

        if (pollingMode === PollingMode.ManualPoll) {
          await client.forceRefreshAsync();
        }

        const eds: IEvaluationDetails[] = await client.getAllValueDetailsAsync();
        const settingKeys: any = {};

        assert.equal(eds.length, 16);
        eds.forEach(ed => {
          assert.isFalse(ed.isDefaultValue);
          (settingKeys[ed.key] = ed.value);
        });

        assert.equal(settingKeys.stringDefaultCat, "Cat");
        assert.equal(settingKeys.stringIsInDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringIsNotInDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringContainsDogDefaultCat, "Cat");
        assert.equal(settingKeys.stringNotContainsDogDefaultCat, "Cat");
        assert.equal(settingKeys.string25Cat25Dog25Falcon25Horse, "Chicken");
        assert.equal(settingKeys.string75Cat0Dog25Falcon0Horse, "Chicken");
        assert.equal(settingKeys.string25Cat25Dog25Falcon25HorseAdvancedRules, "Chicken");
        assert.equal(settingKeys.boolDefaultTrue, true);
        assert.equal(settingKeys.boolDefaultFalse, false);
        assert.equal(settingKeys.bool30TrueAdvancedRules, true);
        assert.equal(settingKeys.integer25One25Two25Three25FourAdvancedRules, -1);
        assert.equal(settingKeys.integerDefaultOne, 1);
        assert.equal(settingKeys.doubleDefaultPi, 3.1415);
        assert.equal(settingKeys.double25Pi25E25Gr25Zero, -1);
        assert.equal(settingKeys.keySampleText, "Cat");
      });
    }
  });

  describe(`Integration tests - Wrong SDK key - ${clientMode}`, () => {

    it(`${clientMode} - Auto poll with wrong SDK Key - getValue() should return default value`, (done) => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.AutoPoll,
        { requestTimeoutMs: 500, maxInitWaitTimeSeconds: 1 });

      client.getValue("stringDefaultCat", defaultValue, actual => {

        assert.strictEqual(actual, defaultValue);

        client.dispose();
        done();
      });
    });

    it(`${clientMode} - Auto poll with wrong SDK Key - getValueAsync() should return default value`, async () => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.AutoPoll,
        { requestTimeoutMs: 500, maxInitWaitTimeSeconds: 1 });

      const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, defaultValue);

      client.dispose();
    });

    it(`${clientMode} - Manual poll with wrong SDK Key - getValue() should return default value`, (done) => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.ManualPoll, { requestTimeoutMs: 500 });

      client.getValue("stringDefaultCat", defaultValue, actual => {

        assert.strictEqual(actual, defaultValue);

        client.forceRefresh(() => {

          client.getValue("stringDefaultCat", defaultValue, actual => {
            assert.strictEqual(actual, defaultValue);

            client.dispose();
            done();
          });
        });
      });
    });

    it(`${clientMode} - Manual poll with wrong SDK Key - getValueAsync() should return default value`, async () => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.ManualPoll, { requestTimeoutMs: 500 });

      const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, defaultValue);
      await client.forceRefreshAsync();
      const actual2: string = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual2, defaultValue);

      client.dispose();
    });

    it(`${clientMode} - Lazy load with wrong SDK Key - getValue() should return default value`, (done) => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.LazyLoad, { requestTimeoutMs: 500 });

      client.getValue("stringDefaultCat", defaultValue, actual => {

        assert.strictEqual(actual, defaultValue);

        client.dispose();
        done();
      });
    });

    it(`${clientMode} - Lazy load with wrong SDK Key - getValueAsync() should return default value`, async () => {

      const defaultValue = "NOT_CAT";
      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.LazyLoad, { requestTimeoutMs: 500 });

      const actual: string = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, defaultValue);

      client.dispose();
    });

    it(`${clientMode} - getAllKeys() should not crash with wrong SDK Key`, (done) => {

      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.ManualPoll, { requestTimeoutMs: 500 });

      client.getAllKeys(keys => {

        assert.equal(keys.length, 0);

        client.dispose();
        done();
      });
    });

    it(`${clientMode} - getAllKeysAsync() should not crash with wrong SDK Key`, async () => {

      const client: IConfigCatClient = clientFactory("WRONG_SDK_KEY", PollingMode.ManualPoll, { requestTimeoutMs: 500 });

      const keys: string[] = await client.getAllKeysAsync();
      assert.equal(keys.length, 0);

      client.dispose();
    });
  });

  describe(`Integration tests - Other cases - ${clientMode}`, () => {

    it(`${clientMode} - Override - local only`, async () => {
      const defaultValue = "DEFAULT_CAT";

      const clientOverride: IConfigCatClient = clientFactory(sdkKey, PollingMode.AutoPoll, {
        flagOverrides: configcatClient.createFlagOverridesFromMap({ stringDefaultCat: "NOT_CAT" }, configcatClient.OverrideBehaviour.LocalOnly),
        logger: createConsoleLogger(LogLevel.Off)
      });

      const actual: string = await clientOverride.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, "NOT_CAT");
    });

  });
}
