import { Component, OnInit, Input } from "@angular/core";
import { IConfigCatClient, User } from "configcat-js";

@Component({
  selector: "app-sample",
  templateUrl: "sample.component.html",
  styleUrls: ["./sample.component.scss"]
})

export class SampleComponent implements OnInit {
  public isAwesomeEnabled: boolean | undefined = void 0;
  public isPOCEnabled: boolean | undefined = void 0;
  public userEmail = "configcat@example.com";

  @Input() configCatClient: IConfigCatClient;

  ngOnInit() { }

  async checkAwesome() {
    this.isAwesomeEnabled = await this.configCatClient.getValueAsync("isAwesomeFeatureEnabled", false);
  }

  async checkProofOfConcept() {
    const userObject = new User("#SOME-USER-ID#", this.userEmail);
    // Read more about the User Object: https://configcat.com/docs/advanced/user-object
    this.isPOCEnabled = await this.configCatClient.getValueAsync("isPOCFeatureEnabled", false, userObject);
  }
}
