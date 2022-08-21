import { IConfigFetcher, OptionsBase, FetchResult, ProjectConfig } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
    fetchLogic(
        options: OptionsBase,
        lastEtag: string,
        callback: (result: FetchResult) => void,
    ): void {
      const fetchId = Math.round(Math.random() * 100000);
      const alarmName = `fetcher-${fetchId}`;
      if (options.requestTimeoutMs) {
        chrome.alarms.create(alarmName, {when: Date.now() + options.requestTimeoutMs});

        chrome.alarms.onAlarm.addListener((alarm => {
          if (alarm.name === alarmName) {
            options.logger.error(
              `Failed to download feature flags & settings from ConfigCat. Timed-out.`,
            );
            callback(FetchResult.error())
          }
        }));
      }
        fetch(options.getUrl(), {
          method: 'GET'
        })
          .then( async (response) => {
            const text = await response.text();
            if (options.requestTimeoutMs) {
              chrome.alarms.clear(alarmName).then();
            }
              const etag: string = response.headers && response.headers.get('Etag');
              if (response.status === 200) {
                  callback(FetchResult.success(text, etag))
              } else if (response.status === 304) {
                  callback(FetchResult.notModified());
              } else {
                  options.logger.error(
                    `Failed to download feature flags & settings from ConfigCat. ${response.status} - ${response.statusText}`,
                  );
                  callback(FetchResult.error());
              }
          })
          .catch((error) => {
              options.logger.error(
                `Failed to download feature flags & settings from ConfigCat. Error: ${error}`,
              );
            if (options.requestTimeoutMs) {
              chrome.alarms.clear(alarmName).then();
            }
              callback(FetchResult.error());
          })
    }
}
