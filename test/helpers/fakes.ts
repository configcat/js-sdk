import { IConfigCatLogger, LogEventId, LogLevel, LogMessage } from "../../src";

export class FakeLogger implements IConfigCatLogger {
  messages: [LogLevel, string][] = [];

  constructor(public level = LogLevel.Info) { }

  reset(): void { this.messages.splice(0); }

  log(level: LogLevel, eventId: LogEventId, message: LogMessage, exception?: any): void {
    this.messages.push([level, message.toString()]);
  }
}
