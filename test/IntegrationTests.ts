import { assert } from "chai";
import "mocha";
import { IConfigCatClient, } from "configcat-common/lib/ConfigCatClient";
import * as configcatClient from "../src/index";
import { User } from "configcat-common/lib/RolloutEvaluator";

describe("Integration - ConfigCatClient", () => {

  let apiKey: string = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";

  let clientAutoPoll: IConfigCatClient = configcatClient.createClientWithAutoPoll(apiKey);

  let clientManualPoll: IConfigCatClient = configcatClient.createClientWithManualPoll(apiKey);

  let clientLazyLoad: IConfigCatClient = configcatClient.createClientWithLazyLoad(apiKey);

  it("Auto poll - getValue() with key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("stringDefaultCat", defaultValue, actual => {
      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("Auto poll - getValueAsync() with key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";

    const actual = await clientAutoPoll.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);

  });

  it("Manual poll - getValue() with key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(() => {

      clientManualPoll.getValue("stringDefaultCat", defaultValue, actual => {
        assert.strictEqual(actual, "Cat");
        assert.notStrictEqual(actual, defaultValue);
        done();
      });
    });
  });

  it("Manual poll - getValueAsync() with key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
    });
  });

  it("Lazy load - getValue() with  key: 'stringDefaultCat' should return 'Cat'", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("Lazy load - getValueAsync() with  key: 'stringDefaultCat' should return 'Cat'", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientLazyLoad.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);
  });

  it("Auto poll - getValue() with key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("Auto poll - getValueAsync() with key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientAutoPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);
  });

  it("Manual poll - getValue() with  with key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("NotExistsKey", defaultValue, actual => {
        assert.equal(actual, defaultValue);
        done();
      });
    });
  });

  it("Manual poll - getValueAsync() with  with key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
      assert.equal(actual, defaultValue);;
    });
  });

  it("Lazy load - getValue() with  key: 'NotExistsKey' should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("Lazy load - getValueAsync() with  key: 'NotExistsKey' should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);;
  });

  it("Auto poll - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientAutoPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("Auto poll - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    const actual = await clientAutoPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("Manual poll - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

        assert.equal(actual, "Horse");

        done();
      },
        new User("nacho@gmail.com"));
    });
  });

  it("Manual poll - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
      assert.equal(actual, "Horse");
    });
  });

  it("Lazy load - getValue() with key: 'RolloutEvaluate' should return default value", (done) => {

    clientLazyLoad.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("Lazy load - getValueAsync() with key: 'RolloutEvaluate' should return default value", async () => {

    const actual = await clientLazyLoad.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("Auto poll with wrong API key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);

      done();
    });
  });

  it("Auto poll with wrong API key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("Manual poll with wrong API key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);

      client.forceRefresh(function () {
        client.getValue("stringDefaultCat", defaultValue, actual => {

          assert.strictEqual(actual, defaultValue);
          done();
        });
      });
    });
  });

  it("Manual poll with wrong API key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
    client.forceRefresh(async () => {
      const actual2 = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual2, defaultValue);
    });
  });

  it("Lazy load with wrong API key - getValue() should return default value", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);
      done();
    });
  });

  it("Lazy load with wrong API key - getValueAsync() should return default value", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("getAllKeys() should not crash with wrong API key", (done) => {

    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getAllKeys(keys => {

      assert.equal(keys.length, 0);
      done();
    });
  });


  it("getAllKeys() should return all keys", (done) => {

    clientAutoPoll.getAllKeys(keys => {

      assert.equal(keys.length, 16);
      const keysObject = {};
      keys.forEach(value => keysObject[value] = {});
      assert.containsAllKeys(keysObject, [
        'stringDefaultCat',
        'stringIsInDogDefaultCat',
        'stringIsNotInDogDefaultCat',
        'stringContainsDogDefaultCat',
        'stringNotContainsDogDefaultCat',
        'string25Cat25Dog25Falcon25Horse',
        'string75Cat0Dog25Falcon0Horse',
        'string25Cat25Dog25Falcon25HorseAdvancedRules',
        'boolDefaultTrue',
        'boolDefaultFalse',
        'bool30TrueAdvancedRules',
        'integer25One25Two25Three25FourAdvancedRules',
        'integerDefaultOne',
        'doubleDefaultPi',
        'double25Pi25E25Gr25Zero',
        'keySampleText'
      ]);
      done();
    });
  });
});