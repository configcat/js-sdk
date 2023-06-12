import { ExternalConfigCache, IConfigCatKernel } from "configcat-common";
import { ConfigCatClient } from "configcat-common/lib/ConfigCatClient";
import { AutoPollOptions, LazyLoadOptions, ManualPollOptions } from "configcat-common/lib/ConfigCatClientOptions";
import { IConfigCatClient, IJSAutoPollOptions, IJSLazyLoadingOptions, IJSManualPollOptions } from "../../src";
import { LocalStorageCache } from "../../src/Cache";
import { HttpConfigFetcher } from "../../src/ConfigFetcher";
import sdkVersion from "../../src/Version";

const sdkType = "ConfigCat-JS";

export function createClientWithAutoPoll(sdkKey: string, options?: IJSAutoPollOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion, defaultCacheFactory: options => new ExternalConfigCache(new LocalStorageCache(), options.logger) };
  return new ConfigCatClient(new AutoPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithManualPoll(sdkKey: string, options?: IJSManualPollOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion, defaultCacheFactory: options => new ExternalConfigCache(new LocalStorageCache(), options.logger) };
  return new ConfigCatClient(new ManualPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithLazyLoad(sdkKey: string, options?: IJSLazyLoadingOptions): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = { configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion, defaultCacheFactory: options => new ExternalConfigCache(new LocalStorageCache(), options.logger) };
  return new ConfigCatClient(new LazyLoadOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}
