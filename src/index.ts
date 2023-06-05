import type { IAutoPollOptions, IConfigCatClient, IConfigCatLogger, ILazyLoadingOptions, IManualPollOptions, LogLevel, OverrideBehaviour, SettingValue } from "configcat-common";
import { ExternalConfigCache } from "configcat-common";
import * as configcatcommon from "configcat-common";
import { FlagOverrides, MapOverrideDataSource, PollingMode } from "configcat-common";
import { LocalStorageCache } from "./Cache";
import { HttpConfigFetcher } from "./ConfigFetcher";
import CONFIGCAT_SDK_VERSION from "./Version";

/**
 * Returns an instance of ConfigCatClient for the specified SDK Key.
 * @remarks This method returns a single, shared instance per each distinct SDK Key.
 * That is, a new client object is created only when there is none available for the specified SDK Key.
 * Otherwise, the already created instance is returned (in which case the 'pollingMode' and 'options' arguments are ignored).
 * So, please keep in mind that when you make multiple calls to this method using the same SDK Key, you may end up with multiple references to the same client object.
 * @param sdkKey SDK Key to access configuration
 * @param pollingMode The polling mode to use
 * @param options Options for the specified polling mode
 */
export function getClient<TMode extends PollingMode | undefined>(sdkKey: string, pollingMode?: TMode, options?: OptionsForPollingMode<TMode>): IConfigCatClient {
  return configcatcommon.getClient(sdkKey, pollingMode ?? PollingMode.AutoPoll, options,
    {
      configFetcher: new HttpConfigFetcher(),
      sdkType: "ConfigCat-JS",
      sdkVersion: CONFIGCAT_SDK_VERSION,
      defaultCacheFactory: options => new ExternalConfigCache(new LocalStorageCache(), options.logger)
    });
}

/**
 * Disposes all existing ConfigCatClient instances.
 */
export function disposeAllClients(): void {
  configcatcommon.disposeAllClients();
}

export function createConsoleLogger(logLevel: LogLevel): IConfigCatLogger {
  return configcatcommon.createConsoleLogger(logLevel);
}

export function createFlagOverridesFromMap(map: { [name: string]: NonNullable<SettingValue> }, behaviour: OverrideBehaviour): FlagOverrides {
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

export type { LogEventId, LogMessage } from "configcat-common";

export { LogLevel } from "configcat-common";

export { FormattableLogMessage } from "configcat-common";

export type { IConfigCatCache } from "configcat-common";

export type { IConfig, ISetting, ITargetingRule, IPercentageOption, SettingValue, VariationIdValue } from "configcat-common";

export { SettingType, Comparator } from "configcat-common";

export type { IConfigCatClient } from "configcat-common";

export { SettingKeyValue } from "configcat-common";

export type { IEvaluationDetails, SettingTypeOf } from "configcat-common";

export { User } from "configcat-common";

export type { FlagOverrides } from "configcat-common";

export { OverrideBehaviour } from "configcat-common";

export { RefreshResult } from "configcat-common";

export type { IProvidesHooks, HookEvents } from "configcat-common";

/* Default export */

export default function(sdkKey: string, options?: IJSAutoPollOptions): IConfigCatClient {
  return getClient(sdkKey, PollingMode.AutoPoll, options);
}
