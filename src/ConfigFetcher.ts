import { IConfigFetcher, OptionsBase, FetchResult, ProjectConfig } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
    fetchLogic(
        options: OptionsBase,
        lastEtag: string,
        callback: (result: FetchResult) => void,
    ): void {
      const fetchId = Math.round(Math.random() * 100000);
      const alarmName = `fetcher-${fetchId}`;
console.log('DEBUG :: options.requestTimeoutMs', options.requestTimeoutMs);
      if (options.requestTimeoutMs) {
        chrome.alarms.create(alarmName, {when: Date.now() + options.requestTimeoutMs});

        chrome.alarms.onAlarm.addListener((alarm => {
          console.log('DEBUG :: onAlarm', alarm);
          if (alarm.name === alarmName) {
            options.logger.error(
              `Failed to download feature flags & settings from ConfigCat. Timed-out.`,
            );
            callback(FetchResult.error())
          }
        }));
      }
/*
{
            console.log('DEBUG :: response headers', response.headers);
            console.log('DEBUG :: response headers ETAG', response.headers.get('Etag'));
            console.log('DEBUG :: interate headers');
            for(let entry of (response.headers as any).entries()) {
              console.log(entry);
            }
            return response.json()
          }
 */
        fetch(options.getUrl(), {
          method: 'GET'
        })
          // .then(response => response.json())
          .then((response) => {
            console.log('DEBUG :: response', response)
            console.log('DEBUG :: headers', response.headers);
            if (options.requestTimeoutMs) {
              chrome.alarms.clear(alarmName).then();
            }
            console.log('DEBUG :: response headers ETAG 2', response.headers.get('Etag'));
              const etag: string = response.headers && response.headers["ETag"]; // todo :: check original
              if (response.status === 200) {
                  callback(FetchResult.success('Success', etag))
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
        //
        //
        // const httpRequest: XMLHttpRequest = new XMLHttpRequest();
        // httpRequest.onreadystatechange = () => {
        //     if (httpRequest.readyState === 4) {
        //         const etag: string = httpRequest.getResponseHeader("ETag");
        //         if (httpRequest.status === 200) {
        //             callback(FetchResult.success(httpRequest.responseText, etag));
        //         } else if (httpRequest.status === 304) {
        //             callback(FetchResult.notModified());
        //         } else {
        //             options.logger.error(
        //                 `Failed to download feature flags & settings from ConfigCat. ${httpRequest.status} - ${httpRequest.statusText}`,
        //             );
        //             callback(FetchResult.error());
        //         }
        //     }
        // };
        //
        // httpRequest.open("GET", options.getUrl(), true);
        // httpRequest.timeout = options.requestTimeoutMs;
        // httpRequest.send(null);
    }
}
