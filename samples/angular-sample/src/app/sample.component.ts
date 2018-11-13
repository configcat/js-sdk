import { Component, OnInit, Input } from '@angular/core';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { User } from 'configcat-common/lib/RolloutEvaluator';

@Component({
    selector: 'app-sample',
    templateUrl: 'sample.component.html',
    styleUrls: ['./sample.component.scss']
})

export class SampleComponent implements OnInit {
    constructor() { }

    public isAwesomeEnabled: Boolean = undefined;
    public isPOCEnabled: Boolean = undefined;
    public userEmail = 'configcat@example.com';

    @Input() configCatClient: IConfigCatClient;

    ngOnInit() { }

    checkAwesome() {
        this.configCatClient.getValue('isAwesomeFeatureEnabled', false, (value) => {
            this.isAwesomeEnabled = value;
        });
    }

    checkProofOfConcept() {
        const userObject = new User('#SOME-USER-ID#', this.userEmail);
        this.configCatClient.getValue('isPOCFeatureEnabled', false, (value) => {
            this.isPOCEnabled = value;
          },
          userObject
        );
    }
}
