import { assert } from "chai";
import * as mockxmlhttprequest from "mock-xmlhttprequest";
import { LogLevel } from "../src/index";
import { FakeLogger } from "./helpers/fakes";
import * as utils from "./helpers/utils";

describe("HTTP tests", () => {
  const sdkKey = "configcat-sdk-1/PKDVCLf-Hq-h-kCzMp-L7Q/AG6C1ngVb0CvM07un6JisQ";
  const baseUrl = "https://cdn-global.test.com";

  it("HTTP timeout", async () => {
    const requestTimeoutMs = 1500;

    const server = mockxmlhttprequest.newServer({
      get: [url => url.startsWith(baseUrl), request => setTimeout(() => request.setRequestTimeout(), requestTimeoutMs)],
    });

    try {
      server.install(window);

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs,
        baseUrl,
        logger
      });
      const startTime = new Date().getTime();
      await client.forceRefreshAsync();
      const duration = new Date().getTime() - startTime;
      assert.isTrue(duration > 1000 && duration < 2000);

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Request timed out while trying to fetch config JSON.")));
    }
    finally {
      server.remove();
    }
  });

  it("404 Not found", async () => {
    const server = mockxmlhttprequest.newServer({
      get: [url => url.startsWith(baseUrl), { status: 404, statusText: "Not Found" }],
    });

    try {
      server.install(window);

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Your SDK Key seems to be wrong.")));
    }
    finally {
      server.remove();
    }
  });

  it("Unexpected status code", async () => {
    const server = mockxmlhttprequest.newServer({
      get: [url => url.startsWith(baseUrl), { status: 502, statusText: "Bad Gateway" }],
    });

    try {
      server.install(window);

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Unexpected HTTP response was received while trying to fetch config JSON:")));
    }
    finally {
      server.remove();
    }
  });

  it("Unexpected error", async () => {
    const server = mockxmlhttprequest.newServer({
      get: [url => url.startsWith(baseUrl), "error"],
    });

    try {
      server.install(window);

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Unexpected error occurred while trying to fetch config JSON.")));
    }
    finally {
      server.remove();
    }
  });
});
