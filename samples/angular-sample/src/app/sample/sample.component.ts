import { Component, OnInit, Input } from "@angular/core";
import { IConfigCatClient, User } from "configcat-js";

@Component({
  selector: "app-sample",
  templateUrl: "./sample.component.html",
  styleUrls: ["./sample.component.css"]
})
export class SampleComponent implements OnInit {
  isAwesomeEnabled: boolean | undefined = void 0;
  isPOCEnabled: boolean | undefined = void 0;
  userEmail = "configcat@example.com";

  @Input() configCatClient: IConfigCatClient;

  ngOnInit(): void { }

  async checkAwesome(): Promise<void> {
    this.isAwesomeEnabled = await this.configCatClient.getValueAsync("isAwesomeFeatureEnabled", false);
  }

  async checkProofOfConcept(): Promise<void> {
    const userObject = new User("#SOME-USER-ID#", this.userEmail);

    // Read more about the User Object: https://configcat.com/docs/advanced/user-object
    this.isPOCEnabled = await this.configCatClient.getValueAsync("isPOCFeatureEnabled", false, userObject);
  }

}
