import { IConfigFetcher, OptionsBase, FetchResult, ProjectConfig } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
    fetchLogic(
        options: OptionsBase,
        lastEtag: string,
        callback: (result: FetchResult) => void,
    ): void {
        const httpRequest: XMLHttpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4) {
                const etag: string = httpRequest.getResponseHeader("ETag");
                if (httpRequest.status === 200) {
                    callback(FetchResult.success(httpRequest.responseText, etag));
                } else if (httpRequest.status === 304) {
                    callback(FetchResult.notModified());
                } else {
                    options.logger.error(
                        `Failed to download feature flags & settings from ConfigCat. ${httpRequest.status} - ${httpRequest.statusText}`,
                    );
                    callback(FetchResult.error());
                }
            }
        };

        httpRequest.open("GET", options.getUrl(), true);
        httpRequest.timeout = options.requestTimeoutMs;
        httpRequest.setRequestHeader("X-ConfigCat-UserAgent", options.clientVersion);
        httpRequest.setRequestHeader("Cache-Control", "no-cache"); // any locally cached version isn't trusted without the server's say-so
        if (lastEtag) {
            httpRequest.setRequestHeader("If-None-Match", lastEtag);
        }
        httpRequest.send(null);
    }
}
