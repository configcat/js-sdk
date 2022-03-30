import { Component, OnInit, Input } from '@angular/core';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { User } from 'configcat-common/lib/RolloutEvaluator';
import amplitude from 'amplitude-js';

@Component({
    selector: 'app-card',
    templateUrl: 'card.component.html',
    styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
    public isGreenButtonEnabled: boolean = false;
    @Input() configCatClient!: IConfigCatClient;

    ngOnInit() {
        // Using the device ID as a unique identifier for feature flag evaluation.
        const userObject = new User(amplitude.getInstance().options.deviceId || '');

        // Getting the feature flag value that decides if the green or the gray button to show.
        this.configCatClient.getValue('greenButtonEnabled', false, value => {
            this.isGreenButtonEnabled = value;
        }, userObject);
    }

    buttonClicked() {
        // Sending the button click event to Amplitude.
        // The greenButtonEnabled flag is already tracked as a user property in Amplitude (see app.component.ts).
        amplitude.getInstance().logEvent('button_clicked');
        alert('Click event sent to Amplitude.');
    }
}
