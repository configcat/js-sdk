import { Component } from '@angular/core';
import * as configcat from 'configcat-js';
import { IConfigCatClient, LogLevel } from 'configcat-common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-sample';

  constructor() {
    // Setting log level to 3 (= Info) to show detailed feature flag evaluation
    const logger = configcat.createConsoleLogger(LogLevel.Info);

    this.configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ',
      {
        pollIntervalSeconds: 2,
        logger
      });
    // You can instantiate the client with different polling modes.
    // See the Docs: https://configcat.com/docs/sdk-reference/js/#polling-modes
  }

  public configCatClient: IConfigCatClient;
}
