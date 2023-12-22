import { Component,OnInit,Input,Output,EventEmitter,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-insurance-verification-view',
  templateUrl: './insurance-verification-view.component.html',
  styleUrls: ['./insurance-verification-view.component.scss']
})
export class InsuranceVerificationViewComponent implements OnInit {
@Input() insuranceVerificationData:any;
selectedIncidentCode:any='';
constructor(){

   }
   ngOnInit():void{
     if(this.insuranceVerificationData.showData.incidentCodesInfo!=null){
     	if(this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes!=null && this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes.length>0){
            this.selectedIncidentCode =this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes[0].secondaryCode+'-'+ this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes[0].secondaryCodeDescription;
         }else{
         	this.selectedIncidentCode=this.insuranceVerificationData.showData.incidentCodesInfo.primaryCode;
         }
     }
   }
}
