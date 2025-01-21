import { AsyncPipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfigCatService } from "../configcat.service";
import { type SettingValue, User } from "configcat-js";
import { BehaviorSubject, distinctUntilChanged, Observable, switchMap } from "rxjs";

@Component({
  selector: "app-sample",
  standalone: true,
  templateUrl: "./sample.component.html",
  styleUrls: ["./sample.component.scss"],
  imports: [AsyncPipe, FormsModule]
})
export class SampleComponent {
  isAwesomeEnabled$: Observable<boolean>;
  isPOCEnabled?: boolean;
  allKeyValues$: Observable<Map<string, SettingValue>>;

  private userEmailSubject = new BehaviorSubject<string>("configcat@example.com");
  get userEmail() { return this.userEmailSubject.value; }
  set userEmail(value: string) { this.userEmailSubject.next(value); }

  constructor(private configCatService: ConfigCatService) {
    this.isAwesomeEnabled$ = this.configCatService.getValue("isAwesomeFeatureEnabled", false);
    
    this.allKeyValues$ = this.userEmailSubject.pipe(
      distinctUntilChanged(),
      switchMap(userEmail => {
        const userObject = new User("#SOME-USER-ID#", userEmail);
        return this.configCatService.getAllValues(userObject);
      })
    );
  }

  async checkProofOfConcept(): Promise<void> {
    const userObject = new User("#SOME-USER-ID#", this.userEmail);

    // Read more about the User Object: https://configcat.com/docs/advanced/user-object
    this.isPOCEnabled = await this.configCatService.client.getValueAsync("isPOCFeatureEnabled", false, userObject);
  }
}
