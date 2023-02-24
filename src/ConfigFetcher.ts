import { FetchError, IConfigFetcher, IFetchResponse, OptionsBase } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
  private handleStateChange(httpRequest: XMLHttpRequest, resolve: (value: IFetchResponse) => void, reject: (reason?: any) => void) {
    try {
      if (httpRequest.readyState === 4) {
        const { status: statusCode, statusText: reasonPhrase } = httpRequest;

        if (statusCode === 200) {
          const eTag: string | undefined = httpRequest.getResponseHeader("ETag") ?? void 0;
          resolve({ statusCode, reasonPhrase, eTag, body: httpRequest.responseText });
        }
        // The readystatechange event is emitted even in the case of abort or error.
        // We can detect this by checking for zero status code (see https://stackoverflow.com/a/19247992/8656352).
        else if (statusCode) {
          resolve({ statusCode, reasonPhrase });
        }
      }
    }
    catch (err) {
      reject(err);
    }
  }

  fetchLogic(options: OptionsBase, lastEtag: string | null): Promise<IFetchResponse> {
    return new Promise<IFetchResponse>((resolve, reject) => {
      try {
        options.logger.debug("HttpConfigFetcher.fetchLogic() called.");

        const httpRequest: XMLHttpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = () => this.handleStateChange(httpRequest, resolve, reject);
        httpRequest.ontimeout = () => reject(new FetchError("timeout", options.requestTimeoutMs));
        httpRequest.onabort = () => reject(new FetchError("abort"));
        httpRequest.onerror = () => reject(new FetchError("failure"));

        httpRequest.open("GET", options.getUrl(), true);
        httpRequest.timeout = options.requestTimeoutMs;
        // NOTE: It's intentional that we don't specify the If-None-Match header.
        // The browser automatically handles it, adding it manually would cause an unnecessary CORS OPTIONS request.
        httpRequest.send(null);
      }
      catch (err) {
        reject(err);
      }
    });
  }
}
