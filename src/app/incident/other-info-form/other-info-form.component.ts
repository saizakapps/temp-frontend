import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IncidentService } from "../incident.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
import { Utils } from '../../shared/incident-shared/module/utils';
import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-other-info-form',
  templateUrl: './other-info-form.component.html',
  styleUrls: ['./other-info-form.component.css']
})
export class OtherInfoFormComponent implements OnInit {
  @ViewChild('mySelect') mySelect: MatSelect;

  @Input() otherinfoData: any;
  @Output() otherinfoevent = new EventEmitter<any>();
  public formFieldAccess: any;
  public otherInfoform: any;
  dropdownValue1: any;
  dropdownValue2: any;
  username: any;
  isformShow = false;
  isviewShow = false
  constructor(public incidentService: IncidentService, private fb: FormBuilder, private requestapi: RequestApiService, private utils: Utils) {

  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.getotherinfodropDown1();
    this.getotherinfodropDown2();
    this.otherInfoform = this.fb.group({
      openWithBuyerVendor: [''],
      incidentInjury: [''],
      incidentCause: [''],
      incidentCauseName: [''],
      incidentInjuryName: ['']
    });
    let incidentInjury = (this.otherinfoData.incidentInjury != '' && this.otherinfoData.incidentInjury != null) ? this.otherinfoData.incidentInjury.toString() : '';
    let incidentCause = (this.otherinfoData.incidentCause != '' && this.otherinfoData.incidentCause != null) ? this.otherinfoData.incidentCause.toString() : '';
    let incidentCauseName = (this.otherinfoData.incidentCauseDropDownInfo != '' && this.otherinfoData.incidentCauseDropDownInfo != null && this.otherinfoData.incidentCauseDropDownInfo != undefined) ? this.otherinfoData.incidentCauseDropDownInfo.description : '';
    let incidentInjuryName = (this.otherinfoData.incidentInjuryDropDownInfo != '' && this.otherinfoData.incidentInjuryDropDownInfo != null && this.otherinfoData.incidentInjuryDropDownInfo != undefined) ? this.otherinfoData.incidentInjuryDropDownInfo.description : '';
    this.otherInfoform.patchValue(
      {
        openWithBuyerVendor: (this.otherinfoData.openWithBuyerVendor == 'yes') ? true : false,
        incidentInjury: incidentInjury,
        incidentCause: incidentCause,
        incidentCauseName: incidentCauseName,
        incidentInjuryName: incidentInjuryName
      }
    )
    this.isformShow = this.incidentService.isOtherinfoformshow(this.otherinfoData.formFieldAccess);
    this.isviewShow = this.incidentService.isOtherinfoviewshow(this.otherinfoData.formFieldAccess);
    this.isformShow = this.otherinfoData.isclosed ? false : this.isformShow;
    this.isviewShow = this.otherinfoData.isclosed ? true : this.isviewShow;

  }


  async getotherinfodropDown1() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_OTHERINFO_DROPDOWN1 + '?userName=' + this.username);
    if (response) {
      this.dropdownValue1 = response.payLoad;
    }
    else {
      this.dropdownValue1 = [];
    }
  }
  
  async getotherinfodropDown2() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_OTHERINFO_DROPDOWN2 + '?userName=' + this.username);
    if (response) {
      this.dropdownValue2 = response.payLoad;
    }
    else {
      this.dropdownValue2 = [];
    }
  }

  otherinfoChange(event: any) {
    this.otherinfoevent.emit(this.otherInfoform.value);
  }
  drop1change(event: any) {
    this.otherinfoevent.emit(this.otherInfoform.value);
  }
  drop2change(event: any) {
    this.otherinfoevent.emit(this.otherInfoform.value);
  }

  //   isSelectDropdownAtTop(): boolean {
  //     const selectRect = this.mySelect._elementRef.nativeElement.getBoundingClientRect();
  //     console.log('Dropdown top:', selectRect.top);
  //     return selectRect.top < 0;
  //   }
  

}
