import { Component,OnInit,Input,Output,EventEmitter,ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
import { FormControl } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
import { Utils } from '../../shared/incident-shared/module/utils';
@Component({
  selector: 'app-legal-info-form',
  templateUrl: './legal-info-form.component.html',
  styleUrls: ['./legal-info-form.component.scss']
})
export class LegalInfoFormComponent implements OnInit{
	@Input() legalInfoData:any;
	@Output() legalInfoEdit = new EventEmitter<any>();
incidentCodeData:any=[];
injurySeverityData:any=[];
preventabilityData:any=[];
legalStatusData:any=[];
photoStatusData:any=[];
cctvFootageStatus:any=[];
legalInfoForm:any;
toolTipData:any = {deletionDate:''}
username:any = '';
 constructor(public common:CommonService,private fb: FormBuilder,private requestapi:RequestApiService,private utils:Utils){}

   ngOnInit():void{
     this.username = localStorage.getItem('username')
   	this.legalInfoForm= this.fb.group({
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
	this.getincidentCodeList();

   }
   editLedgalInfoDetails(){
      this.legalInfoEdit.emit(this.legalInfoData);
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
	let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_CODES_URL+'?userName'+this.username);
      if(response){
        this.incidentCodeData = response.payLoad;
      }
}
claimDateChange(e:any){}
   saveLegalInfo(){

   }
}

