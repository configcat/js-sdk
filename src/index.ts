import * as configcatcommon from "configcat-common";
import { IConfigFetcher } from "configcat-common";
import { EventEmitter } from "events";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "configcat-common/lib/ConfigCatClientConfiguration";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { InMemoryCache } from "configcat-common/lib/Cache";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClientImpl";

const VERSION: string = require("../package.json").version;

/** Create an instance of ConfigCatClient and setup AutoPool mode with default settings */
export function createClient(apiKey: string): IConfigCatClient {

    let lc: AutoPollConfiguration = new AutoPollConfiguration();

    return configcatcommon.createClient(apiKey, { configFetcher: new HttpConfigFetcher(lc.getUrl(apiKey), "a-" + VERSION, lc.logger), cache: new InMemoryCache() });
}

/**
 * Create an instance of ConfigCatClient and setup AutoPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for autoPoll mode
 */
export function createClientWithAutoPoll(apiKey: string, config?: IJsConfigurationOptions): IConfigCatClient {

    let c: AutoPollConfiguration = new AutoPollConfiguration();

    return configcatcommon.createClientWithAutoPoll(apiKey, { configFetcher: new HttpConfigFetcher(c.getUrl(apiKey), "a-" + VERSION, c.logger), cache: new InMemoryCache() }, config);
}

/**
 * Create an instance of ConfigCatClient and setup ManulaPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for manualPoll mode
 */
export function createClientWithManualPoll(apiKey: string, config?: IJsConfigurationOptions): IConfigCatClient {

    let c: ManualPollConfiguration = new ManualPollConfiguration();

    return configcatcommon.createClientWithManualPoll(apiKey, { configFetcher: new HttpConfigFetcher(c.getUrl(apiKey), "m-" + VERSION, c.logger), cache: new InMemoryCache() }, config)
}

/**
 * Create an instance of ConfigCatClient and setup LazyLoad mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for lazyLoad mode
 */
export function createClientWithLazyLoad(apiKey: string, config?: IJsConfigurationOptions): IConfigCatClient {

    let c: LazyLoadConfiguration = new LazyLoadConfiguration();

    return configcatcommon.createClientWithLazyLoad(apiKey, { configFetcher: new HttpConfigFetcher(c.getUrl(apiKey), "l-" + VERSION, c.logger), cache: new InMemoryCache() }, config);
}

export interface IJsConfigurationOptions extends configcatcommon.IConfigurationOptions {

}