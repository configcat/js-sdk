import { assert } from "chai";
import { FlagOverrides, IConfigCatClient, PollingMode } from "configcat-common";
import * as configcatClient from "../src/index";

describe("ConfigCatClient index (main)", () => {
  for (const pollingMode of [PollingMode.AutoPoll, PollingMode.LazyLoad, PollingMode.ManualPoll]) {
    it(`getClient() should createInstance with ${PollingMode[pollingMode]}`, () => {

      const client: IConfigCatClient = configcatClient.getClient("SDKKEY-890123456789012/1234567890123456789012", pollingMode);

      assert.isDefined(client);

      client.dispose();
    });
  }

  it("createFlagOverridesFromMap ShouldCreateFlagOverrides", () => {
    const overrides: FlagOverrides = configcatClient.createFlagOverridesFromMap({ test: true }, configcatClient.OverrideBehaviour.LocalOnly);

    assert.isDefined(overrides);
  });
});
