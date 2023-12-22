import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from "../../shared/services/incident-services/common.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-incident-details-view',
  templateUrl: './incident-details-view.component.html',
  styleUrls: ['./incident-details-view.component.scss']
})
export class IncidentDetailsViewComponent implements OnInit{
	@Input() incidentDetailsData:any;
	@Output() incidentDetailsEdit = new EventEmitter<any>();
  isRedacted:boolean = false;
  items:any;
  public isHistory:boolean=false;
   constructor(private common:CommonService, public router : Router){

   }
   ngOnInit():void{

let createdOn = this.incidentDetailsData.showData.createdOn;
let redactedRule = this.incidentDetailsData.redactRuleData.redactRules;
      if(redactedRule=='Yes'){
         this.isRedacted=this.common.compareDateTwoMonthCompleted(createdOn);
      }
      this.isRedacted=this.incidentDetailsData.showData.isRedacted;
this.isHistory=this.router.url.includes('history')?true:false;
   }
   editIncidentDetails(){
      this.incidentDetailsEdit.emit(this.incidentDetailsData);
   }
   

}
