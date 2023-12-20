import { assert } from "chai";
import { IConfigCatClient, IEvaluationDetails, IOptions, LogLevel, PollingMode, SettingKeyValue, User } from "configcat-common";
import * as configcatClient from "../src";
import { createConsoleLogger } from "../src";

const sdkKey = "configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/u28_1qNyZ0Wz-ldYHIU7-g";

describe("Special characters test", () => {

    const options: IOptions = { logger: createConsoleLogger(LogLevel.Off) };

    let client: IConfigCatClient;

    beforeEach(function () {
        client = configcatClient.getClient(sdkKey, PollingMode.AutoPoll, options);
    });

    afterEach(function () {
        client.dispose();
    });

    it(`Special characters works - cleartext`, async () => {
        const actual: string = await client.getValueAsync("specialCharacters", "NOT_CAT", new User("äöüÄÖÜçéèñışğâ¢™✓😀"));
        assert.strictEqual(actual, "äöüÄÖÜçéèñışğâ¢™✓😀");
    });

    it(`Special characters works - hashed`, async () => {
        const actual: string = await client.getValueAsync("specialCharactersHashed", "NOT_CAT", new User("äöüÄÖÜçéèñışğâ¢™✓😀"));
        assert.strictEqual(actual, "äöüÄÖÜçéèñışğâ¢™✓😀");
    });
});
