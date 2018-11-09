import { IConfigFetcher, IConfigCatLogger } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfigService";
import { ConfigurationBase } from "configcat-common/lib/ConfigCatClientConfiguration";

declare const Promise: any;

export class HttpConfigFetcher implements IConfigFetcher {

    constructor() {
    }

    fetchLogic(clientConfiguration: ConfigurationBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState == 4) {
                const etag = httpRequest.getResponseHeader("ETag");
                if (httpRequest.status === 200) {
                    callback(new ProjectConfig(new Date().getTime(), httpRequest.responseText, etag));
                } else if (httpRequest.status === 304) {
                    callback(new ProjectConfig(new Date().getTime(), lastProjectConfig.JSONConfig, etag));
                } else {
                    clientConfiguration.logger.log("ConfigCat HTTPRequest error: " + httpRequest.statusText);
                    callback(lastProjectConfig);
                }
            }
        };

        httpRequest.open( "GET", clientConfiguration.getUrl(), true );
        httpRequest.setRequestHeader("X-ConfigCat-UserAgent", "ConfigCat-JS/" + clientConfiguration.productVersion);
        httpRequest.setRequestHeader("If-None-Match", lastProjectConfig ? lastProjectConfig.HttpETag : null);
        httpRequest.send( null );
    }


}

export default IConfigFetcher;