import { Component,OnInit,Input,Output,EventEmitter,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-insurance-verification-view',
  templateUrl: './insurance-verification-view.component.html',
  styleUrls: ['./insurance-verification-view.component.scss']
})
export class InsuranceVerificationViewComponent implements OnInit {
@Input() insuranceVerificationData:any;
selectedIncidentCode:any='';
loginEmployeeRoleCode:any;
username:any;
constructor(){

   }
   ngOnInit():void{
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.loginEmployeeRoleCode = userDetails.incidentRole;
     if(this.insuranceVerificationData.showData.incidentCodesInfo!=null){
     	if(this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes!=null && this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes.length>0){
            this.selectedIncidentCode =this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes[0].secondaryCode+'-'+ this.insuranceVerificationData.showData.incidentCodesInfo.secondaryCodes[0].secondaryCodeDescription;
         }else{
         	this.selectedIncidentCode=this.insuranceVerificationData.showData.incidentCodesInfo.primaryCode;
         }
     }
   }
}
