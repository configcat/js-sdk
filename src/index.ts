import * as configcatcommon from "configcat-common";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { IConfigCatClient } from "configcat-common/lib/ConfigCatClient";
import { LocalStorageCache } from "./Cache";
import { LogLevel } from "configcat-common/lib/index";

/** Create an instance of ConfigCatClient and setup Auto polling with default options.*/
export function createClient(apiKey: string): IConfigCatClient {

    return this.createClientWithAutoPoll(apiKey);
}

/**
 * Create an instance of ConfigCatClient and setup Auto polling.
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param options - Options for Auto polling
 */
export function createClientWithAutoPoll(apiKey: string, options?: IJSAutoPollOptions): IConfigCatClient {

    return configcatcommon.createClientWithAutoPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() }, options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual polling.
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param options - Options for Manual polling
 */
export function createClientWithManualPoll(apiKey: string, options?: IJSManualPollOptions): IConfigCatClient {

    return configcatcommon.createClientWithManualPoll(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() }, options);
}

/**
 * Create an instance of ConfigCatClient and setup Lazy loading.
 * @param {string} apiKey - ApiKey to access your configuration.
 * @param options - Options for Lazy loading
 */
export function createClientWithLazyLoad(apiKey: string, options?: IJSLazyLoadingOptions): IConfigCatClient {

    return configcatcommon.createClientWithLazyLoad(apiKey, { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() }, options);
}

export function createConsoleLogger(logLevel: LogLevel): configcatcommon.IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export interface IJSAutoPollOptions extends configcatcommon.IAutoPollOptions {
}

export interface IJSLazyLoadingOptions extends configcatcommon.ILazyLoadingOptions {
}

export interface IJSManualPollOptions extends configcatcommon.IManualPollOptions {
}
