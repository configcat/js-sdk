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
    // Setting log level to Info to show detailed feature flag evaluation in the console.
    const logger = configcat.createConsoleLogger(LogLevel.Info);

    // Initializing the ConfigCat client, it should be initialized as a singleton.
    // Get your ConfigCat SDK key here: https://app.configcat.com/sdkkey
    this.configCatClient = configcat.createClientWithAutoPoll('PKDVCLf-Hq-h-kCzMp-L7Q/wAuE2NZ270KuN9utBYlBjg',
      {
        pollIntervalSeconds: 2,
        logger: logger
      });

  }

  ngOnInit() {
    // Initialize Amplitude with your API_KEY to upload tracking data. API_KEY: https://help.amplitude.com/hc/en-us/articles/360058073772#view-and-edit-your-project-information
    amplitude.getInstance().init('57c2946d37872e0781c675f584bdcd7b');

    // The following steps are necessary for creating a funnel diagram in Amplitude to visualize how many times A or B version of the card was loaded and clicked.

    // ConfigCat userObject (https://configcat.com/docs/advanced/user-object) with a unique identifier is necessary to download and evaluate feature flag values.
    // There are no logged in users in the sample application to take a user ID from. 
    // Instead I'm taking the DeviceID from Amplitude as a unique identifier: https://developers.amplitude.com/docs/identify-api
    const userObject = new User(amplitude.getInstance().options.deviceId || '');
    console.log(amplitude.getInstance().options.deviceId);

    // Getting all the evaluated feature flag keys and values from ConfigCat for the given userObject.
    this.configCatClient.getAllValuesAsync(userObject).then((values) => {

      // Getting the identity from Amplitude: https://developers.amplitude.com/docs/identify-api
      const identity = new amplitude.Identify();

      // Setting the evaluated feature flag keys and values on the identity object.
      values.forEach(i => { identity.set(i.settingKey, i.settingValue); });

      // Uploading the identity object together with the evaluated feature flag values to Amplitude.
      amplitude.getInstance().identify(identity);

      // Sending the 'visited' event to Amplitude to track the page visit as the first step in the funnel. 
      amplitude.getInstance().logEvent('visited', { 'title': this.title });
    });
  }

  public configCatClient: IConfigCatClient;
}
