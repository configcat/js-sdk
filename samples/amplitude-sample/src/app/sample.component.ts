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
        // Use the same user identification in ConfigCat and Amplitude
        const userObject = new User(amplitude.getInstance().options.deviceId);
        
        this.configCatClient.getValue("greenButtonEnabled", false, value => {
            this.isGreenButtonEnabled = value;
        }, userObject);
    }

    buttonClicked() {
        amplitude.getInstance().logEvent('button_clicked');
    }
}
