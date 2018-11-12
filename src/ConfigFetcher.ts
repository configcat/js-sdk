import { IConfigFetcher, IConfigCatLogger } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ConfigServiceBase";
import { OptionsBase } from "configcat-common/lib/ConfigCatClientOptions";

declare const Promise: any;

export class HttpConfigFetcher implements IConfigFetcher {

    constructor() {
    }

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState == 4) {
                const etag = httpRequest.getResponseHeader("ETag");
                if (httpRequest.status === 200) {
                    callback(new ProjectConfig(new Date().getTime(), httpRequest.responseText, etag));
                } else if (httpRequest.status === 304) {
                    callback(new ProjectConfig(new Date().getTime(), lastProjectConfig.JSONConfig, etag));
                } else {
                    options.logger.log("ConfigCat HTTPRequest error: " + httpRequest.statusText);
                    callback(lastProjectConfig);
                }
            }
        };

        httpRequest.open( "GET", options.getUrl(), true );
        httpRequest.setRequestHeader("X-ConfigCat-UserAgent", "ConfigCat-JS/" + options.clientVersion);
        httpRequest.setRequestHeader("If-None-Match", lastProjectConfig ? lastProjectConfig.HttpETag : null);
        httpRequest.send( null );
    }


}

export default IConfigFetcher;