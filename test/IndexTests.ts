import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/index";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";

describe("ConfigCatClient index (main)", () => {

    it("createClient ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("APIKEY");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("APIKEY", { "pollIntervalSeconds": 15 });
        assert.isDefined(client);
    });

    it("createClientWithLazyLoad ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("APIKEY", { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("APIKEY");

        assert.isDefined(client);
    });
});