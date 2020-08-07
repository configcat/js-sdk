import { IConfigFetcher, ProjectConfig, OptionsBase } from "configcat-common/lib/esm";

export class HttpConfigFetcher implements IConfigFetcher {

    constructor() {}

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        const httpRequest: XMLHttpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4) {
                const etag: string = httpRequest.getResponseHeader("ETag");
                if (httpRequest.status === 200) {
                    callback(new ProjectConfig(new Date().getTime(), httpRequest.responseText, etag));
                } else if (httpRequest.status === 304) {
                    callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), etag));
                } else {
                    options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${httpRequest.status} - ${httpRequest.statusText}`);
                    callback(lastProjectConfig);
                }
            }
        };

        httpRequest.open("GET", options.getUrl(), true);
        httpRequest.timeout = options.requestTimeoutMs;
        httpRequest.setRequestHeader("X-ConfigCat-UserAgent", "ConfigCat-JS/" + options.clientVersion);
        httpRequest.setRequestHeader("Cache-Control", "no-cache"); // Any locally cached version isn't trusted without the server's say-so
        if (lastProjectConfig && lastProjectConfig.HttpETag) {
            httpRequest.setRequestHeader("If-None-Match", lastProjectConfig.HttpETag);
        }
        httpRequest.send(null);
    }
}

export default IConfigFetcher;