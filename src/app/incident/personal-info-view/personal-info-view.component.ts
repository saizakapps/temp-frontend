import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from "../../shared/services/incident-services/common.service";
@Component({
  selector: 'app-personal-info-view',
  templateUrl: './personal-info-view.component.html',
  styleUrls: ['./personal-info-view.component.scss']
})
export class PersonalInfoViewComponent implements OnInit{
	@Input() personalInfoData:any;
	@Output() personalInfoEdit = new EventEmitter<any>();
  isRedacted:boolean=false;
   constructor(private common:CommonService){

   }
   ngOnInit():void{
let createdOn = this.personalInfoData.showData.createdOn;
let redactedRule = this.personalInfoData.redactRuleData.redactRules;
      if(redactedRule=='Yes'){
         this.isRedacted=this.common.compareDateTwoMonthCompleted(createdOn);
      }
      this.isRedacted = this.personalInfoData.showData.isRedacted;
   }
   editPersonalInfo(){
      this.personalInfoEdit.emit(this.personalInfoData);
   }
}
