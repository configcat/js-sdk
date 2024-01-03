import { IConfigCatLogger, LogEventId, LogLevel, LogMessage } from "../../src";

export class FakeLogger implements IConfigCatLogger {
  events: [LogLevel, LogEventId, LogMessage, any?][] = [];

  constructor(public level = LogLevel.Info) { }

  reset(): void { this.events.splice(0); }

  log(level: LogLevel, eventId: LogEventId, message: LogMessage, exception?: any): void {
    this.events.push([level, eventId, message, exception]);
  }
}
