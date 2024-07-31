import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfigCatService } from "../configcat.service";
import { User } from "configcat-js";
import { Observable } from "rxjs";

@Component({
  selector: "app-sample",
  standalone: true,
  templateUrl: "./sample.component.html",
  styleUrls: ["./sample.component.scss"],
  imports: [AsyncPipe, FormsModule]
})
export class SampleComponent {
  isAwesomeEnabled$: Observable<boolean>
  isPOCEnabled?: boolean;
  userEmail = "configcat@example.com";

  constructor(private configCatService: ConfigCatService) {
    this.isAwesomeEnabled$ = this.configCatService.getValue("isAwesomeFeatureEnabled", false);
  }

  async checkProofOfConcept(): Promise<void> {
    const userObject = new User("#SOME-USER-ID#", this.userEmail);

    // Read more about the User Object: https://configcat.com/docs/advanced/user-object
    this.isPOCEnabled = await this.configCatService.client.getValueAsync("isPOCFeatureEnabled", false, userObject);
  }
}
