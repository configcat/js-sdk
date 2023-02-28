import { assert } from "chai";
import { FlagOverrides, IConfigCatClient, PollingMode } from "configcat-common";
import * as configcatClient from "../src/index";

describe("ConfigCatClient index (main)", () => {
  for (const pollingMode of [PollingMode.AutoPoll, PollingMode.LazyLoad, PollingMode.ManualPoll]) {
    it(`getClient() should createInstance with ${PollingMode[pollingMode]}`, () => {

      const client: IConfigCatClient = configcatClient.getClient("SDKKEY", pollingMode);

      assert.isDefined(client);

      client.dispose();
    });
  }

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

  it("createFlagOverridesFromMap ShouldCreateFlagOverrides", () => {
    const overrides: FlagOverrides = configcatClient.createFlagOverridesFromMap({ test: true }, configcatClient.OverrideBehaviour.LocalOnly);

    assert.isDefined(overrides);
  });
});
