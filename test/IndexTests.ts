import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/index";
import { IConfigCatClient } from "configcat-common/lib/esm/ConfigCatClient";

describe("ConfigCatClient index (main)", () => {
    it("createClient ShouldCreateInstance", () => {
        const client: IConfigCatClient = configcatClient.createClient("sdkKey");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll ShouldCreateInstance", () => {
        const client: IConfigCatClient = configcatClient.createClientWithAutoPoll("SDKKEY", {
            pollIntervalSeconds: 15,
        });
        assert.isDefined(client);
    });

    it("createClientWithLazyLoad ShouldCreateInstance", () => {
        const client: IConfigCatClient = configcatClient.createClientWithLazyLoad("SDKKEY", {
            cacheTimeToLiveSeconds: 15,
        });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll ShouldCreateInstance", () => {
        const client: IConfigCatClient = configcatClient.createClientWithManualPoll("SDKKEY");

        assert.isDefined(client);
    });
});
