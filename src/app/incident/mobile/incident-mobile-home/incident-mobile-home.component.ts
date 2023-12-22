import { Component,OnInit,Injectable,  ChangeDetectorRef,HostListener,ViewChild,ViewChildren } from '@angular/core';
import { IncidentService } from '../../incident.service';
import { Router } from "@angular/router";
import { RequestApiService } from "../../../shared/services/incident-services/request-api.service";
import { Utils } from "../../../shared/incident-shared/module/utils";
import { SelectionModel } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { CommonService } from "../../../shared/services/incident-services/common.service";
// import { Component, Injectable, OnInit } from "@angular/core";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener
} from "@angular/material/tree";
import { BehaviorSubject } from "rxjs";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { DatePipe } from '@angular/common';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';

@Component({
  selector: 'app-incident-mobile-home',
  templateUrl: './incident-mobile-home.component.html',
  styleUrls: ['./incident-mobile-home.component.scss']
})
export class IncidentMobileHomeComponent {
loginEmployeeId:any;
loginEmployeeRoleCode:any;
loginEmployeeCountry:any;
isIncharge:any;
retectedRuleData:any;
incidentSelectedTypeData:any;
isList = true;
 public incidentTypeData = [{id:1,name:'Customer',isShow:true},{id:2,name:'Employee',isShow:true},{id:3,name:'Contractor',isShow:true},{id:4,name:'Product',isShow:true}];

isCreateBtnHidden = true;
constructor(private datepipe:DatePipe,private cdref:ChangeDetectorRef,public common:CommonService,private utils:Utils,private incidentService:IncidentService,private router:Router,private requestapi:RequestApiService){
}
username:any;
ngOnInit():void{
  let userDetails = JSON.parse(localStorage.getItem('userDetails'));
  this.username = localStorage.getItem('username');
  this.loginEmployeeId = userDetails.employeeId;
  this.loginEmployeeCountry = userDetails.country;
  this.loginEmployeeRoleCode = userDetails.roleCode;
  this.isIncharge = userDetails.incharge;
  this.getRetectedRoleMapInfo();
}



incidentTypeClick(e:any,data:any){
  this.isList = false;
  this.incidentSelectedTypeData = data;
  let incidentCreateData ={isAdd:true,idIncident:0,incidentSelectedTypeData:this.incidentSelectedTypeData,incidentRowData:{}};
  this.incidentService.subject$.next(incidentCreateData);
  this.router.navigate(['incident/mobile/create']);
}

async  getRetectedRoleMapInfo(){
  let response: any = await this.requestapi.getData(this.utils.API.GET_ROLE_MAP_INFO_URL+'?roleName='+this.loginEmployeeRoleCode+'&country='+this.loginEmployeeCountry+'&userName='+this.username);
  if(response){
    this.retectedRuleData = response.payLoad;
    this.incidentTypeData[0].isShow=this.retectedRuleData.createForms.customer;
    this.incidentTypeData[1].isShow=this.retectedRuleData.createForms.employee;
    this.incidentTypeData[2].isShow=this.retectedRuleData.createForms.contractor;
    this.incidentTypeData[3].isShow=this.retectedRuleData.createForms.product;
    if(!this.retectedRuleData.createForms.customer &&
      !this.retectedRuleData.createForms.contractor &&
      !this.retectedRuleData.createForms.employee &&
      !this.retectedRuleData.createForms.product ){
      this.isCreateBtnHidden=true;
    }else{
      this.isCreateBtnHidden = false;
    }
  }
  }
}
