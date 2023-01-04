import * as configcatcommon from "configcat-common";
import { FlagOverrides, IAutoPollOptions, IConfigCatClient, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, InMemoryCache, LogLevel, MapOverrideDataSource, PollingMode } from "configcat-common";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { LocalStorageCache } from "./Cache";
import CONFIGCAT_SDK_VERSION from "./Version";

/**
 * Returns an instance of ConfigCatClient for the specified SDK Key.
 * @remarks This method returns a single, shared instance per each distinct SDK Key.
 * That is, a new client object is created only when there is none available for the specified SDK Key.
 * Otherwise, the already created instance is returned (in which case the 'pollingMode', 'options' and 'configCatKernel' arguments are ignored).
 * So, please keep in mind that when you make multiple calls to this method using the same SDK Key, you may end up with multiple references to the same client object.
 * @param sdkKey SDK Key to access configuration
 * @param pollingMode The polling mode to use
 * @param options Options for the specified polling mode
 */
export function getClient<TMode extends PollingMode | undefined>(sdkKey: string, pollingMode?: TMode, options?: OptionsForPollingMode<TMode>): IConfigCatClient {
    return configcatcommon.getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new InMemoryCache(),
            sdkType: "ConfigCat-JS",
            sdkVersion: CONFIGCAT_SDK_VERSION
        });
}

/**
 * Disposes all existing ConfigCatClient instances.
 */
export function disposeAllClients(): void {
    configcatcommon.disposeAllClients();
}

/**
 * Create an instance of ConfigCatClient and setup Auto polling with default options.
 * @param {string} sdkkey - SDK Key to access your configuration.
 * @param options - Options for Auto polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with auto polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.AutoPoll, options, ...)' format.
 */
export function createClient(sdkkey: string, options?: IJSAutoPollOptions): IConfigCatClient {
    return createClientWithAutoPoll(sdkkey, options);
}

/**
 * Create an instance of ConfigCatClient and setup Auto polling.
 * @param {string} sdkkey - SDK Key to access your configuration.
 * @param options - Options for Auto polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with auto polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.AutoPoll, options, ...)' format.
 */
export function createClientWithAutoPoll(sdkKey: string, options?: IJSAutoPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithAutoPoll(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-JS",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual polling.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Manual polling
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with manual polling for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.ManualPoll, options, ...)' format.
 */
export function createClientWithManualPoll(sdkKey: string, options?: IJSManualPollOptions): IConfigCatClient {
    return configcatcommon.createClientWithManualPoll(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-JS",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Lazy loading.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Lazy loading
 * @deprecated This function is obsolete and will be removed from the public API in a future major version. To obtain a ConfigCatClient instance with lazy loading for a specific SDK Key, please use the 'getClient(sdkKey, PollingMode.LazyLoad, options, ...)' format.
 */
export function createClientWithLazyLoad(sdkKey: string, options?: IJSLazyLoadingOptions): IConfigCatClient {
    return configcatcommon.createClientWithLazyLoad(
        sdkKey,
        {
            configFetcher: new HttpConfigFetcher(),
            cache: new LocalStorageCache(),
            sdkType: "ConfigCat-JS",
            sdkVersion: CONFIGCAT_SDK_VERSION
        },
        options);
}

export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export function createFlagOverridesFromMap(map: { [name: string]: any }, behaviour: number): FlagOverrides {
    return new FlagOverrides(new MapOverrideDataSource(map), behaviour);
}

export interface IJSAutoPollOptions extends IAutoPollOptions {
}

export interface IJSLazyLoadingOptions extends ILazyLoadingOptions {
}

export interface IJSManualPollOptions extends IManualPollOptions {
}

export type OptionsForPollingMode<TMode extends PollingMode | undefined> =
    TMode extends PollingMode.AutoPoll ? IJSAutoPollOptions :
    TMode extends PollingMode.ManualPoll ? IJSManualPollOptions :
    TMode extends PollingMode.LazyLoad ? IJSLazyLoadingOptions :
    TMode extends undefined ? IJSAutoPollOptions :
    never;

/* Public types re-export from common-js */

// These exports should be kept in sync with the exports listed in the section "Public types for end users" of common-js/src/index.ts!

export { PollingMode } from "configcat-common";

export type { IOptions } from "configcat-common";

export type { IAutoPollOptions, IManualPollOptions, ILazyLoadingOptions } from "configcat-common";

export { DataGovernance } from "configcat-common";

export type { IConfigCatLogger } from "configcat-common";

export { LogLevel } from "configcat-common";

export type { ICache } from "configcat-common";

export { ProjectConfig, RolloutRule, RolloutPercentageItem, Setting } from "configcat-common";

export type { IConfigCatClient } from "configcat-common";

export { SettingKeyValue } from "configcat-common";

export type { IEvaluationDetails, SettingTypeOf, SettingValue, VariationIdTypeOf, VariationIdValue } from "configcat-common";

export { User } from "configcat-common";

export type { IOverrideDataSource } from "configcat-common";

export { FlagOverrides, MapOverrideDataSource, OverrideBehaviour } from "configcat-common";

export { RefreshResult } from "configcat-common";

export type { IProvidesHooks, HookEvents } from "configcat-common";

/* Default export */

export default function(sdkKey: string, options?: IJSAutoPollOptions) {
    return getClient(sdkKey, PollingMode.AutoPoll, options);
}
