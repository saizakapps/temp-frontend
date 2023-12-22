import { Component,OnInit,Input,Output,EventEmitter } from '@angular/core';
import { CommonService } from '../../shared/services/incident-services/common.service';
import { IncidentService } from '../incident.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-basic-info-view',
  templateUrl: './basic-info-view.component.html',
  styleUrls: ['./basic-info-view.component.scss']
})
export class BasicInfoViewComponent implements OnInit{
@Input() basicInfoData:any;
public isRedacted = false;
constructor(private incidentService:IncidentService,private route:Router){

}
ngOnInit():void{
this.isRedacted=this.basicInfoData.showData.isRedacted;
}
redirectToCurrenntIncident(){
	let incidentSelectedTypeData = {id:1,name:'Customer'};
	if(this.basicInfoData.incidentEditData.incidentType=='Customer' || this.basicInfoData.incidentEditData.incidentType=='customer'){
      incidentSelectedTypeData = {id:1,name:'Customer'};
	}else if(this.basicInfoData.incidentEditData.incidentType=='Employee' || this.basicInfoData.incidentEditData.incidentType=='employee'){
incidentSelectedTypeData = {id:2,name:'Employee'};
	}else  if(this.basicInfoData.incidentEditData.incidentType=='Contractor' || this.basicInfoData.incidentEditData.incidentType=='contractor'){
incidentSelectedTypeData = {id:3,name:'Contractor'};
	}else  if(this.basicInfoData.incidentEditData.incidentType=='Product' || this.basicInfoData.incidentEditData.incidentType=='product'){
incidentSelectedTypeData = {id:4,name:'Product'};
	}
  let incidentCreateData ={isAdd:false,id:this.basicInfoData.incidentEditData.id,idIncident:this.basicInfoData.incidentEditData.incidentId,incidentSelectedTypeData:incidentSelectedTypeData,incidentRowData:this.basicInfoData.incidentEditData};
  this.incidentService.subject$.next(incidentCreateData);
  this.route.navigate(['incident-create']);
}
}
