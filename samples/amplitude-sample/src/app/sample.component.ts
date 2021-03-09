import { Component, OnInit, Input } from '@angular/core';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { User } from 'configcat-common/lib/RolloutEvaluator';
import amplitude from 'amplitude-js';

@Component({
    selector: 'app-sample',
    templateUrl: 'sample.component.html',
    styleUrls: ['./sample.component.scss']
})

export class SampleComponent implements OnInit {
    constructor() { }

    public isGreenButtonEnabled: boolean = undefined;
    @Input() configCatClient: IConfigCatClient;

    ngOnInit() {
        // We don't have registered users but unknown visitors.
        // We create a ConfigCat user object based on the Amplitude deviceId
        // to use the same user in ConfigCat and Amplitude and track the same user segments.
        // See the Docs: https://configcat.com/docs/advanced/user-object
        const userObject = new User(amplitude.getInstance().options.deviceId);

        this.configCatClient.getValue('greenButtonEnabled', false, value => {
            this.isGreenButtonEnabled = value;
        }, userObject);
    }

    buttonClicked() {
        // We use the same event for the two cases (green button enabled or disabled).
        // The greenButtonEnabled flag is already tracked as a user property.
        // For example, in Amplitude we can easily check the visitors whose
        // flag `greenButtonEnabled` is set and have an uploaded button_clicked event.
        amplitude.getInstance().logEvent('button_clicked');
        alert('The click event has been sent to Amplitude.');
    }
}
