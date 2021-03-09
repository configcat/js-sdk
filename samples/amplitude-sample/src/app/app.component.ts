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

    // We don't have registered users but unknown visitors.
    // We create a ConfigCat user object based on the Amplitude deviceId
    // to use the same user in ConfigCat and Amplitude and track the same user segments.
    // See the Docs: https://configcat.com/docs/advanced/user-object
    const userObject = new User(amplitude.getInstance().options.deviceId);

    // We will get all feature flag key-value pairs to define the segment of the user.
    // We can use Amplitude's Identify API to store these data and set the user's segment.
    // In Amplitude for every user, we will have all of the feature flags with the proper value stored as user properties.

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
