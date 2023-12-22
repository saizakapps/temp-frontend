import { Component } from '@angular/core';
import { CommonService } from './shared/services/incident-services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Smyths360Admin';

  constructor(public common:CommonService){
    
  }
}
