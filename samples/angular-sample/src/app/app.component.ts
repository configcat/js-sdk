import { Component } from '@angular/core';
import * as configcat from 'configcat-js';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { LogLevel } from 'configcat-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-sample';

  constructor() {
    const logger = configcat.createConsoleLogger(LogLevel.Info);
    // Setting log level to Info to show detailed feature flag evaluation in the console.

    this.configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ',
      {
        pollIntervalSeconds: 2,
        logger: logger
      });
    // You can instantiate the client with different polling modes.
    // See the Docs: https://docs.configcat.com/docs/sdk-reference/js/#polling-modes
  }

  public configCatClient: IConfigCatClient;
}
