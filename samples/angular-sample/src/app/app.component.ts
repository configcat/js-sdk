import { Component } from '@angular/core';
import * as configcat from 'configcat-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-sample';

  public result: String;

  click() {
  }
}
