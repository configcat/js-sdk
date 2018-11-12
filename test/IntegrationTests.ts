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

    clientAutoPoll.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);

      done();
    });
  });

  it("GetValue - ManualPoll - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";
    clientManualPoll.forceRefresh(() => {

      clientManualPoll.getValue("stringDefaultCat", defaultValue, null, actual => {

        assert.strictEqual(actual, "Cat");

        assert.notStrictEqual(actual, defaultValue);

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'stringDefaultCat' ShouldReturnCat", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("stringDefaultCat", defaultValue, null, actual => {

      assert.strictEqual(actual, "Cat");
      assert.notStrictEqual(actual, defaultValue);

      done();
    });
  });

  it("GetValue - AutoPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientAutoPoll.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);

      done();
    });
  });

  it("GetValue - ManualPoll - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("NotExistsKey", defaultValue, null, actual => {

        assert.equal(actual, defaultValue);

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'NotExistsKey' ShouldReturnDefaultValue", (done) => {

    const defaultValue: string = "NOT_CAT";

    clientLazyLoad.getValue("NotExistsKey", defaultValue, null, actual => {

      assert.equal(actual, defaultValue);

      done();
    });
  });

  it("GetValue - AutoPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientAutoPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

      assert.equal(actual, "Horse");

      done();
    });
  });

  it("GetValue - ManualPoll - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientManualPoll.forceRefresh(() => {
      clientManualPoll.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

        assert.equal(actual, "Horse");

        done();
      });
    });
  });

  it("GetValue - LazyLoad - With 'RolloutEvaluate' ShouldReturnDefaultValue", (done) => {

    clientLazyLoad.getValue("string25Cat25Dog25Falcon25Horse", "N/A", new User("nacho@gmail.com"), actual => {

      assert.equal(actual, "Horse");

      done();
    });
  });
});