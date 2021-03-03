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
    // Init Amplitude with the proper API_KEY
    amplitude.getInstance().init('57c2946d37872e0781c675f584bdcd7b');

    // Use the same user identification in ConfigCat and Amplitude
    const userObject = new User(amplitude.getInstance().options.deviceId);

    // Get all feature flags (key-value pairs) from ConfigCat
    this.configCatClient.getAllValuesAsync(userObject).then((values) => {

      // Create an Identify object storing all feature flag settings
      const identify = new amplitude.Identify();
      values.forEach(i => { identify.set(i.settingKey, i.settingValue); });

      // Send the Identify to Amplitude
      amplitude.getInstance().identify(identify);

      // Send 'visited' Event to Amplitude to track the page visit 
      amplitude.getInstance().logEvent('visited', {'title': this.title});
    });
  }

  public configCatClient: IConfigCatClient;
}
