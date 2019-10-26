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

  it("GetValue - AutoPoll - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("stringDefaultCat", defaultValue, actual => {
      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("GetValueAsync - AutoPoll - With 'stringDefaultCat' ShouldReturnCat", async () => {

    const defaultValue: string = "NOT_CAT";

    const actual = await clientAutoPoll.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);

  });

  it("GetValue - ManualPoll - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(() => {

      clientManualPoll.getValue("stringDefaultCat", defaultValue, actual => {
        assert.strictEqual(actual, "Cat");
        assert.notStrictEqual(actual, defaultValue);
        done();
      });
    });
  });

  it("GetValueAsync - ManualPoll - With 'stringDefaultCat' ShouldReturnCat", async () => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
    });
  });

  it("GetValue - LazyLoad - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);
      done();
    });
  });

  it("GetValueAsync - LazyLoad - With 'stringDefaultCat' ShouldReturnCat", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientLazyLoad.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, "Cat");
    assert.notStrictEqual(actual, defaultValue);
  });

  it("GetValue - AutoPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("GetValueAsync - AutoPoll - With 'NotExistsKey' ShouldReturnDefaultValue", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientAutoPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);
  });

  it("GetValue - ManualPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("NotExistsKey", defaultValue, actual => {
        assert.equal(actual, defaultValue);
        done();
      });
    });
  });

  it("GetValueAsync - ManualPoll - With 'NotExistsKey' ShouldReturnDefaultValue", async () => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
      assert.equal(actual, defaultValue);;
    });
  });

  it("GetValue - LazyLoad - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("NotExistsKey", defaultValue, actual => {
      assert.equal(actual, defaultValue);
      done();
    });
  });

  it("GetValueAsync - LazyLoad - With 'NotExistsKey' ShouldReturnDefaultValue", async () => {

    const defaultValue: string = "NOT_CAT";
    const actual = await clientManualPoll.getValueAsync("NotExistsKey", defaultValue);
    assert.equal(actual, defaultValue);;
  });

  it("GetValue - AutoPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientAutoPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("GetValueAsync - AutoPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", async () => {

    const actual = await clientAutoPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("GetValue - ManualPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

        assert.equal(actual, "Horse");

        done();
      },
        new User("nacho@gmail.com"));
    });
  });

  it("GetValueAsync - ManualPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", async () => {

    clientManualPoll.forceRefresh(async () => {
      const actual = await clientManualPoll.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
      assert.equal(actual, "Horse");
    });
  });

  it("GetValue - LazyLoad - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientLazyLoad.getValue("string25Cat25Dog25Falcon25Horse", "N/A", actual => {

      assert.equal(actual, "Horse");

      done();
    },
      new User("nacho@gmail.com"));
  });

  it("GetValueAsync - LazyLoad - With 'RolloutEvaluate' ShouldReturnDefaultValue", async () => {

    const actual = await clientLazyLoad.getValueAsync("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"));
    assert.equal(actual, "Horse");
  });

  it("GetValue - AutoPoll - With wrong apikey - Returns NOT_CAT", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);

      done();
    });
  });

  it("GetValueAsync - AutoPoll - With wrong apikey - Returns NOT_CAT", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithAutoPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("GetValue - ManualPoll - With wrong apikey - Returns NOT_CAT", (done) => {

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

  it("GetValueAsync - ManualPoll - With wrong apikey - Returns NOT_CAT", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
    client.forceRefresh(async () => {
      const actual2 = await client.getValueAsync("stringDefaultCat", defaultValue);
      assert.strictEqual(actual2, defaultValue);
    });
  });

  it("GetValue - LazyLoad - With wrong apikey - Returns NOT_CAT", (done) => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getValue("stringDefaultCat", defaultValue, actual => {

      assert.strictEqual(actual, defaultValue);
      done();
    });
  });

  it("GetValueAsync - LazyLoad - With wrong apikey - Returns NOT_CAT", async () => {

    const defaultValue: string = "NOT_CAT";
    let client: IConfigCatClient = configcatClient.createClientWithLazyLoad("WRONG_API_KEY", { requestTimeoutMs: 500 });

    const actual = await client.getValueAsync("stringDefaultCat", defaultValue);
    assert.strictEqual(actual, defaultValue);
  });

  it("GetAllKeys - works without config", (done) => {

    let client: IConfigCatClient = configcatClient.createClientWithManualPoll("WRONG_API_KEY", { requestTimeoutMs: 500 });

    client.getAllKeys(keys => {

      assert.equal(keys.length, 0);
      done();
    });
  });


  it("GetAllKeys - works", (done) => {

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