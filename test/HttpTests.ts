import { assert } from "chai";
import * as configcatClient from "../src/index";
import * as mockxmlhttprequest from "mock-xmlhttprequest";
import { FakeLogger } from "./helpers/fakes";
import { LogLevel } from "../src/index";

describe("HTTP tests", () => {
  const sdkKey: string = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";
  const baseUrl = "https://cdn-global.test.com";

  it("HTTP timeout", async () => {
    const requestTimeoutMs = 1500;

    const server = mockxmlhttprequest.newServer({
      get: [url => url.startsWith(baseUrl), request => setTimeout(() => request.setRequestTimeout(), requestTimeoutMs)],
    });

    try {
      server.install(window);

      const logger = new FakeLogger();

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
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

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Request timed out.")));
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

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Double-check your SDK Key")));
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

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Unexpected HTTP response was received:")));
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

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      console.log(logger.messages);

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Request failed due to a network or protocol error.")));
    }
    finally {
      server.remove();
    }
  });
});
