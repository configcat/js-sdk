import { IConfigCatKernel } from "configcat-common";
import { ConfigCatClient } from "configcat-common/lib/ConfigCatClient";
import { AutoPollOptions, LazyLoadOptions, ManualPollOptions } from "configcat-common/lib/ConfigCatClientOptions";
import { IConfigCatClient, IJSAutoPollOptions, IJSLazyLoadingOptions, IJSManualPollOptions } from "../../src";
import { LocalStorageCache } from "../../src/Cache";
import { HttpConfigFetcher } from "../../src/ConfigFetcher";
import sdkVersion from "../../src/Version";

const sdkType = "ConfigCat-JS";

export function createClientWithAutoPoll(sdkKey: string, options?: IJSAutoPollOptions, setupKernel?: (kernel: IConfigCatKernel) => IConfigCatKernel): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = (setupKernel ?? LocalStorageCache.setup)({ configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion });
  return new ConfigCatClient(new AutoPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithManualPoll(sdkKey: string, options?: IJSManualPollOptions, setupKernel?: (kernel: IConfigCatKernel) => IConfigCatKernel): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = (setupKernel ?? LocalStorageCache.setup)({ configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion });
  return new ConfigCatClient(new ManualPollOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}

export function createClientWithLazyLoad(sdkKey: string, options?: IJSLazyLoadingOptions, setupKernel?: (kernel: IConfigCatKernel) => IConfigCatKernel): IConfigCatClient {
  const configCatKernel: IConfigCatKernel = (setupKernel ?? LocalStorageCache.setup)({ configFetcher: new HttpConfigFetcher(), sdkType, sdkVersion });
  return new ConfigCatClient(new LazyLoadOptions(sdkKey, configCatKernel.sdkType, configCatKernel.sdkVersion, options, configCatKernel.defaultCacheFactory, configCatKernel.eventEmitterFactory), configCatKernel);
}
