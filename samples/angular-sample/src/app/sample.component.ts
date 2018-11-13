import { Component, OnInit } from '@angular/core';
import * as configcat from 'configcat-js';
import { IConfigCatClient } from 'configcat-common/lib/ConfigCatClient';
import { User } from 'configcat-common/lib/RolloutEvaluator';

@Component({
    selector: 'app-sample',
    templateUrl: 'sample.component.html',
    styleUrls: ['./sample.component.scss']
})

export class SampleComponent implements OnInit {
    constructor() {
        this.client = configcat.createClient('PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ');
    }

    private client: IConfigCatClient;
    public isAwesomeEnabled: Boolean = undefined;
    public isPOCEnabled: Boolean = undefined;
    public userEmail = 'configcat@example.com';


    ngOnInit() { }

    checkAwesome() {
        this.client.getValue('isAwesomeFeatureEnabled', false, (value) => {
            this.isAwesomeEnabled = value;
        });
    }

    checkProofOfConcept() {
        const userObject = new User('#SOME-USER-ID#', this.userEmail);
        this.client.getValue('isPOCFeatureEnabled', false, (value) => {
            this.isPOCEnabled = value;
        },
        userObject);
    }
}
