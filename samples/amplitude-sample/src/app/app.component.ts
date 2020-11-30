import { Component } from '@angular/core';
import * as configcat from 'configcat-js';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { LogLevel, User } from 'configcat-common';
import amplitude from 'amplitude-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'amplitude-abtest-sample';

  constructor() {
    const logger = configcat.createConsoleLogger(LogLevel.Info);
    // Setting log level to Info to show detailed feature flag evaluation in the console.

    this.configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/wAuE2NZ270KuN9utBYlBjg',
      {
        pollIntervalSeconds: 2,
        logger: logger
      });
    // You can instantiate the client with different polling modes.
    // See the Docs: https://configcat.com/docs/sdk-reference/js/#polling-modes
  }

  ngOnInit() { 
    amplitude.getInstance().init('57c2946d37872e0781c675f584bdcd7b');
    this.getAllKeyValuesAsync().then((keyValues) => {
      console.log(keyValues);
      for (const [key,value] of Object.entries(keyValues)) {
        amplitude.getInstance().identify(new amplitude.Identify().set(key, value));
      }
      amplitude.getInstance().logEvent('visited', {'title': this.title});
    });
  }

  async getAllKeyValuesAsync() {
    const keys = await this.configCatClient.getAllKeysAsync();
    const keyValues: Record<string, unknown> = {};
    for (const key of keys) {
      await this.configCatClient.getValueAsync(key, false).then((value) => {
        keyValues[key] = value;
      });
    }
    return keyValues;
  }

  public configCatClient: IConfigCatClient;
}
