import { ConfigCatClientImpl, IConfigCatClient } from "./ConfigCatClientImpl";
import { AutoPollConfiguration, ManualPollConfiguration, LazyLoadConfiguration } from "./ConfigCatClientConfiguration";
import { EventEmitter } from "events";

/** Create an instance of ConfigCatClient and setup AutoPool mode with default settings */
export function createClient(apiKey: string): IConfigCatClient {
    return createClientWithAutoPoll(apiKey, new AutoPollConfiguration());
}

/**
 * Create an instance of ConfigCatClient and setup AutoPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for autoPoll mode
 */
export function createClientWithAutoPoll(apiKey: string, config?: IConfigurationOptions): IConfigCatClient {

    let c: AutoPollConfiguration = new AutoPollConfiguration();

    if (config && config.maxInitWaitTimeSeconds) {
        c.maxInitWaitTimeSeconds = config.maxInitWaitTimeSeconds;
    }

    if (config && config.pollIntervalSeconds) {
        c.pollIntervalSeconds = config.pollIntervalSeconds;
    }

    if (config && config.configChanged) {
        c.configChanged = config.configChanged;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, c);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup ManulaPoll mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for manualPoll mode
 */
export function createClientWithManualPoll(apiKey: string, config?: IConfigurationOptions): IConfigCatClient {

    let c: ManualPollConfiguration = new ManualPollConfiguration();

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, c);

    return result;
}

/**
 * Create an instance of ConfigCatClient and setup LazyLoad mode
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param config - Configuration for lazyLoad mode
 */
export function createClientWithLazyLoad(apiKey: string, config?: IConfigurationOptions): IConfigCatClient {

    let c: LazyLoadConfiguration = new LazyLoadConfiguration();

    if (config && config.cacheTimeToLiveSeconds) {
        c.cacheTimeToLiveSeconds = config.cacheTimeToLiveSeconds;
    }

    var result: ConfigCatClientImpl = new ConfigCatClientImpl(apiKey, c);

    return result;
}

export interface IConfigurationOptions {

    pollIntervalSeconds?: number;

    maxInitWaitTimeSeconds?: number;

    configChanged?: EventEmitter;

    cacheTimeToLiveSeconds?: number;
}

export const CONFIG_CHANGED_EVENT: string = AutoPollConfiguration.CONFIG_CHANGED_EVENT;