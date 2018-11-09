import { IConfigFetcher, IConfigCatLogger } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfigService";

declare const Promise: any;

export class HttpConfigFetcher implements IConfigFetcher {

    url: string;
    productVersion: string;
    logger: IConfigCatLogger;

    constructor(url: string, productVersion: string, logger: IConfigCatLogger ) {
        this.url = url;
        this.productVersion = productVersion;
        this.logger = logger;
    }

    fetchLogic(lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState == 4) {
                const etag = httpRequest.getResponseHeader("ETag");
                if (httpRequest.status === 200) {
                    callback(new ProjectConfig(new Date().getTime(), httpRequest.responseText, etag));
                } else if (httpRequest.status === 304) {
                    callback(new ProjectConfig(new Date().getTime(), lastProjectConfig.JSONConfig, etag));
                } else {
                    this.logger.log("ConfigCat HTTPRequest error: " + httpRequest.statusText);
                    callback(lastProjectConfig);
                }
            }
        };

        httpRequest.open( "GET", this.url, true );
        httpRequest.setRequestHeader("X-ConfigCat-UserAgent", "ConfigCat-JS/" + this.productVersion);
        httpRequest.setRequestHeader("If-None-Match", lastProjectConfig ? lastProjectConfig.HttpETag : null);
        httpRequest.send( null );
    }


}

export default IConfigFetcher;