import { Component,OnInit,Input,Output, OnChanges, SimpleChanges, SimpleChange,EventEmitter,ViewEncapsulation,ViewChild,ViewChildren,HostListener } from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
import { FormControl } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
import { Utils } from '../../shared/incident-shared/module/utils';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
@Component({
  selector: 'app-insurance-verification-form',
  templateUrl: './insurance-verification-form.component.html',
  styleUrls: ['./insurance-verification-form.component.scss'],
   // encapsulation: ViewEncapsulation.ShadowDom
})
export class InsuranceVerificationFormComponent implements OnInit {
@Input() insuranceVerificationData:any;
@Input() scrollCount:any;
@Output() insuranceVerificationEvent = new EventEmitter<any>();
public toolTipData:any = {
	deletionDate:'date of deletion'
}
public formFieldAccess:any;
public insuranceVerificationForm:any;
 constructor(public common:CommonService,private fb: FormBuilder,private requestapi:RequestApiService,private utils:Utils){}
public photoStatusData:any = [];
public cctvFootageStatus:any = [];
public injurySeverityData:any = [];
public preventabilityData:any = [];
public legalStatusData:any = [];
public incidentCodeData:any = [];
public username:any = '';
 ngOnInit():void{
this.username=localStorage.getItem('username');
this.formFieldAccess = this.insuranceVerificationData.formFieldAccess;
this.toolTipData = this.insuranceVerificationData.toolTipData;
   this.insuranceVerificationForm= this.fb.group({
		initials: ['', Validators.compose([Validators.required])],
		incidentPrimaryCode: ['', Validators.compose([Validators.required])],
		incidentSecondaryCode:['', Validators.compose([Validators.required,])],
		severity: ['', Validators.compose([Validators.required])],
		preventability: ['', Validators.compose([Validators.required])],
		legalStatus:[''],
		claimReference:[''],
		claimDate:[''],
		cctvStatusCode:[''],
		photoStatusCode:[''],
		deleteDate:['']
		});
	this.getPhotoStatusList();
	this.getcctvFootageStatusList();
	this.getinjurySeverityList();
	this.getpreventabilityList();
	this.getlegalStatusList();
	//this.getincidentCodeList();
	let claimDate:any;
	if(this.insuranceVerificationData.showData.claimDate!='' && this.insuranceVerificationData.showData.claimDate!=null){
	   claimDate=new Date(this.insuranceVerificationData.showData.claimDate);
	   	claimDate.setDate(claimDate.getDate())
	}else{
     claimDate = '';
	}
	let deleteDate:any;
	if(this.insuranceVerificationData.showData.deleteDate!='' && this.insuranceVerificationData.showData.deleteDate!=null){
	   deleteDate=new Date(this.insuranceVerificationData.showData.deleteDate);
	   	deleteDate.setDate(deleteDate.getDate())
	}else{
     deleteDate = '';
	}
	 
	
    
	this.insuranceVerificationForm.patchValue({initials:this.insuranceVerificationData.showData.initials,
	
incidentPrimaryCode:this.insuranceVerificationData.showData.incidentPrimaryCode,
incidentSecondaryCode:this.insuranceVerificationData.showData.incidentSecondaryCode,
severity:this.insuranceVerificationData.showData.severity,
preventability:this.insuranceVerificationData.showData.preventability,
legalStatus:this.insuranceVerificationData.showData.legalStatus,
claimReference:this.insuranceVerificationData.showData.claimReference,
claimDate:claimDate,
cctvStatusCode:this.insuranceVerificationData.showData.cctvStatusCode,
photoStatusCode:this.insuranceVerificationData.showData.photoStatusCode,
deleteDate:deleteDate});
 }
 deleteDateChange(e:any){
 	this.insuranceVerificationForm.value.deleteDate=e;
   this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
 }
 claimDateChange(e:any){
 	this.insuranceVerificationForm.value.claimDate=e;
   this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
 }
 initialChange(e:any){
 	this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
 }
severityChange(e:any){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
preventabilityChange(e:any){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
legalStatus(e:any){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
cliamReferenceChange(e:any){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
photoStatusChange(e:any){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
cctvStatusChange(e:any){
	this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
 
async getPhotoStatusList(){
	let response:any=await this.requestapi.getData(this.utils.API.PHOTO_STATUS_CODE_URL+'?userName='+this.username);
      if(response){
        this.photoStatusData = response.payLoad;
      }
}
async getcctvFootageStatusList(){
	let response:any=await this.requestapi.getData(this.utils.API.CCTV_STATUS_CODE_URL+'?userName='+this.username);
      if(response){
        this.cctvFootageStatus = response.payLoad;
      }
}



async getinjurySeverityList(){
	let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_SEVERITY_CODE_URL+'?userName='+this.username);
      if(response){
        this.injurySeverityData = response.payLoad;
      }
}

async getpreventabilityList(){
	let response:any=await this.requestapi.getData(this.utils.API.PREVENTABILITILITIES_CODE_URL+'?userName='+this.username);
      if(response){
        this.preventabilityData = response.payLoad;
      }
}
async getlegalStatusList(){
	let response:any=await this.requestapi.getData(this.utils.API.LEGAL_STATUS_CODE_URL+'?userName='+this.username);
      if(response){
        this.legalStatusData = response.payLoad;
      }
}

async getincidentCodeList(){
	let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_CODES_URL+'?userName='+this.username);
      if(response){
        this.incidentCodeData = response.payLoad;
      }
}
saveInsuranceVerfication(){
this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);
}
selectedIncidentCode(data:any){
	let idprimarycode=0;
	let idSecondaryCode=0;
	if(data.level==0){
		idprimarycode = data.id;
		idSecondaryCode=0;
	}else{
		idprimarycode = data.countryId;
		idSecondaryCode=data.id;
	}
	
	// let primaryCode = data.filter(function(item:any){
	// 	return item.level==0;
	// });

	// let idprimarycode=(primaryCode.length>0)?primaryCode.map((item:any)=>item.id)[0]:'';
	// let secondaryCode = data.filter(function(item:any){
	// 	return item.level==1;
	// });
	// let idSecondaryCode = (secondaryCode.length>0)?secondaryCode.map((item:any)=>item.id)[0]:'';
	this.insuranceVerificationForm.patchValue({
		incidentPrimaryCode:idprimarycode,
incidentSecondaryCode:idSecondaryCode,
	});

	this.insuranceVerificationEvent.emit(this.insuranceVerificationForm.value);

}
ngOnChanges(changes: SimpleChanges){

  }
}
