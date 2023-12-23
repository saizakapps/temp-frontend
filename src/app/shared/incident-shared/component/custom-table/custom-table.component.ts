import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnChanges, HostListener, AfterViewInit } from '@angular/core';
import { MatPaginator, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
//import {MatTableModule} from '@angular/material/table';
import { RequestApiService } from '../../../services/incident-services/request-api.service';
import { Utils } from '../../../incident-shared/module/utils';
import { CommonService } from '../../../services/incident-services/common.service';
import { fromEvent, map } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { initDayOfMonth } from 'ngx-bootstrap/chronos/units/day-of-month';
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';
@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
  //standalone: true,
  // imports: [MatTableModule],
})
export class CustomTableComponent implements OnInit, AfterViewInit {
  //dataSource = ELEMENT_DATA;
  // tableBody = document.querySelector("tbody");
  // tableBody.addEventListener("scroll", getBodyScrollPosition);
  onScrolling(e: any) {
    if ((e.target.scrollHeight > e.target.clientHeight) && (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 5) && (!this.isStopScroll)) {
      this.isStopScroll = true;
      if (this.selectedRole.length > 0 || this.createdBySelected.length > 0 || this.selectedType.length > 0 || this.selectedPriority.length > 0 ||
        this.selectedStatus.length > 0 || this.selectedStore.length > 0 || this.selectedFlagvalue.length > 0 || this.dateSortValue !== '' || this.selectedInitials.length > 0 || this.selectedCause.length > 0) {
        this.currentPageNo = this.tableData.data.length;
        this.filterNextPage();
      } else {
        let emitData = { type: 3, data: this.tableData };
        this.allListEvent.emit(emitData);

        // this.getDefaultSubFilterDropDown();

      }

    }

    this.isStopScroll = false;

  }

  //       @HostListener('window:wheel', ['$event'])

  // onWheel(event: MouseEvent) {
  //   // do what you want here
  //    const content:any = document.getElementsByClassName('table-responsive');
  //     const scroll$ = fromEvent(content, 'scroll').pipe(map(() => content));
  //     scroll$.subscribe((element:any) => {

  //       if((element.scrollHeight > element.clientHeight) && (element.scrollTop + element.clientHeight >= element.scrollHeight-5) && (!this.isStopScroll)){

  //         this.isStopScroll = true;
  //         if(this.selectedRole.length>0 || this.createdBySelected.length>0 ||
  //         this.selectedType.length>0 ||
  //         this.selectedPriority.length>0 ||
  //         this.selectedStatus.length>0 ||
  //         this.selectedStore.length>0 ){
  //         this.currentPageNo=this.tableData.data.length;
  //         this.filterNextPage();
  //         }else{
  //         let emitData = {type:3,data:this.tableData};
  //         this.allListEvent.emit(emitData);

  //    this.getDefaultSubFilterDropDown();

  //         }

  //       }
  //     });

  // this.isStopScroll = false;
  //    // if (this.bottomReached()) {
  //    //    this.currentPageNo=this.currentPageNo+1;
  //    //    this.currentPageSize=20;
  //    //    this.getNextPageIncidentList();
  //    //  }
  // }
  @Input() tableData: any;
  @Input() isStopScroll: any;
  @Output() allListEvent = new EventEmitter<any>();
  @Input() incidentCountData: any;
  dataSource: any;
  roleData: any = [];
  storeData: any = [];
  public isDateWiseSorting: boolean = false;
  incidentTypeData: any = [];
  priorityCodeData: any = [];
  incidentStatusData: any = [];
  createdByData: any = [];
  dateSortValue = '';
  loginEmployeeId: any
  incidentTypeShowData: any = [
    { id: 1, name: 'customer', checked: false, isShow: true },
    { id: 2, name: 'contractor', checked: false, isShow: true },
    { id: 3, name: 'employee', checked: false, isShow: true },
    { id: 4, name: 'product', checked: false, isShow: true }];
  flagData: any = [
    { id: 1, name: 'new', checked: false, isShow: true },
    { id: 2, name: 'updated', checked: false, isShow: true },
    { id: 3, name: 'blank', checked: false, isShow: true }];
  initialsData: any = [];
  public currentPageNo = 0;
  public currentPageSize = 100;
  public username: any;
  public loginEmployeeCountry: any;
  public loginEmployeeRoleCode: any;
  public loginMainRoleCode: any;
  causeData: any = [];
  constructor(private ngxservice: ngxService, private requestapi: RequestApiService, private utils: Utils, private common: CommonService, private ngxService: NgxUiLoaderService) {

  }
  ngOnInit(): void {
    //   	 let employeeData:any = localStorage.getItem('users');
    // let employeeDataJson = JSON.parse(employeeData);
    // this.loginEmployeeId = employeeDataJson.employeeId;
    for (let x of this.tableData.data) {
      x.checked = false;
    }
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.loginEmployeeId = userDetails.employeeId;
    this.loginEmployeeCountry = userDetails.country;
    this.loginEmployeeRoleCode = userDetails.incidentRole;
    this.loginMainRoleCode = userDetails.roleCode;
    this.getDefaultSubFilterDropDown();
    this.getIncidentCount();
  }

  ngAfterViewInit() {
    // const content:any = document.querySelector('table-responsive');
    // const scroll$ = fromEvent(content, 'scroll').pipe(map(() => content));
    // scroll$.subscribe((element:any) => {
    //   // do whatever
    // });
    // setTimeout(() => {
    //   let headerHeight = document.getElementById("headerForm")?.offsetHeight;
    //   console.log(headerHeight)

    //   document.getElementById("table-responsive").style.height = 'calc(100vh - ' + (headerHeight + 45) + 'px)';

    // }, 500);

  }
  // afterViewInit():void{

  //   setTimeout(() => {
  //     let headerHeight = document.getElementById("headerForm")?.offsetHeight;
  //     console.log(headerHeight)

  //     document.getElementById("table-responsive").style.height = 'calc(100vh - ' + (headerHeight + 25) + 'px)';

  //   }, 500);

  // }
  ngOnChanges(changes: any) {

    // this.createdBySelected = [];
    //   this.selectedRole = [];
    //   this.selectedType = [];
    //   this.selectedPriority = [];
    //   this.selectedStatus = [];
    //   this.selectedStore = [];
    //   this.selectedInitials = [];
    //   this.dateSortValue = '';
    this.username = localStorage.getItem('username');
    // this.selectedFlagvalue = [];
    //this.setPopOverDropDownValue();
    let param = {
      "incidentStatus": [],
      "createdBy": [],
      "roleBy": [],
      "incidentType": [],
      "priority": [],
      "store": [],
      "sortType": "",
      "sortBy": "createdOn",
      "isDateWiseSorting": false,
      "userName": this.username,
      "flagValue": [],
      "initialList": [],
      "incidentCauseIds": []
    }
    
    if (Object.keys(this.tableData.commonparams).length !== 0) {
      if (this.publicParam == undefined) {
        if( this.tableData.commonparams.caseId !== '' ||
        this.tableData.commonparams.allStatus.length > 0 ||
        this.tableData.commonparams.countryRegions.length > 0||
        this.tableData.commonparams.createdFromDate !== '' ||
        this.tableData.commonparams.createdToDate !== '' ||
        this.tableData.commonparams.keyword1.length > 0 ||
        this.tableData.commonparams.storeCode !== ''){
          this.commonconbinedparam = {...param,...this.tableData.commonparams}
          this.getSubFilterListData(this.commonconbinedparam);
        }
        else{
          this.getDefaultSubFilterDropDown();
        }
        
      }
      else{
        this.commonconbinedparam = {...this.publicParam,...this.tableData.commonparams}
        if(this.publicParam.createdBy.length > 0 ||
          this.publicParam.flagValue.length > 0 ||
          this.publicParam.incidentCauseIds.length > 0 ||
          this.publicParam.incidentStatus.length > 0 ||
          this.publicParam.incidentType.length > 0 ||
          this.publicParam.initialList.length > 0 ||
          this.publicParam.priority.length > 0 ||
          this.publicParam.roleBy.length > 0 || 
          this.publicParam.store.length > 0 ||
          this.publicParam.sortType !== '' ){
        this.getSubFilterListData(this.commonconbinedparam);
          }
          else{
            this.getDefaultSubFilterDropDown();
          }
      }
      // this.commonconbinedparam = this.tableData.commonparams
      // if (this.commonconbinedparam !== undefined && this.commonconbinedparam.caseId !== '') {
      //   this.getSubFilterListData(this.commonconbinedparam);
      // }
    }
    else{
      console.log("ELSE ELSE")

      this.getDefaultSubFilterDropDown();
    

    }
    
    
  }
  selectAll(e: any) {

    for (let x of this.tableData.data) {
      if (x.incidentStatus != 'Draft') {
        x.checked = e.checked;
      }

    }
  }
  selectParticular(e: any, index: number, element: any) {



    // this.tableData.data[index].checked=e.checked;
    element.checked = e.checked;
  }
  getDropdownData(indexName: any) {

  }
  getFilterData(indexName: any) {

  }
  selectedRole: any = [];
  createdBySelected: any = [];
  createdByChange(e: any) {
    this.createdBySelected = this.createdByData.filter(function (item: any) {
      return item.checked == true;
    })
    this.getIncidentListFilter();
  }
  roleChange(e: any, value: any) {

    if (e.checked) {
      this.selectedRole.push(value.roleName);
    } else {
      let index = this.selectedRole.indexOf(value.roleName);
      this.selectedRole.splice(index, 1);
    }

    this.getIncidentListFilter();
  }
  selectedType: any = [];
  typeChange(e: any, value: any) {
    if (e.checked) {
      this.selectedType.push(value);
    } else {
      let index = this.selectedType.indexOf(value);
      this.selectedType.splice(index, 1);
    }

    this.getIncidentListFilter();
  }
  selectedPriority: any = []
  priorityChange(e: any) {
    if (e.checked) {
      this.selectedPriority = this.priorityCodeData.filter(function (item: any) {
        return item.checked == true;
      })
    } else {
      this.selectedPriority = this.priorityCodeData.filter(function (item: any) {
        return item.checked == true;
      })
    }
    this.getIncidentListFilter();
  }
  selectedStatus: any = [];
  statusChange(e: any, value: any) {
    if (e.checked) {
      this.selectedStatus.push(value.name);
    } else {
      let index = this.selectedStatus.indexOf(value.name);
      this.selectedStatus.splice(index, 1);
    }

    this.getIncidentListFilter();
  }
  selectedInitials: any = [];
  initialChange(e: any, value: any) {
    if (e.checked) {
      this.selectedInitials.push(value.name);
    } else {
      let index = this.selectedInitials.indexOf(value.name);
      this.selectedInitials.splice(index, 1);
    }

    this.getIncidentListFilter();
  }
  selectedCause: any = [];
  incidentcauseChange(e: any, value: any) {
    this.selectedCause = this.causeData.filter((item: any) => {
      return item.checked == true;
    })

    this.getIncidentListFilter();
  }
  selectedinjuryCause: any = [];
  public selectedStore: any = [];
  storeChange(e: any) {
    this.selectedStore = this.storeData.filter(function (item: any) {
      return item.checked == true;
    })
    this.getIncidentListFilter();
  }
  dateSort(value: any) {
    if (value == 2) {
      this.dateSortValue = 'Ascending';
      this.isDateWiseSorting = true;
    } else if (value == 3) {
      this.dateSortValue = 'descending';
      this.isDateWiseSorting = true;
    } else {
      this.dateSortValue = '';
      this.isDateWiseSorting = false;
    }
    this.getIncidentListFilter();
  }
  selectedFlagvalue: any = [];
  selectedInitailsValue: any = [];
  paramforFilter: any;
  async getIncidentListFilter() {
    this.ngxService.start();
    let createdby = this.createdByData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.employeeId);

    let selectedStore = this.storeData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.id);
    let selectedPriority = this.priorityCodeData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.id);
    this.selectedFlagvalue = this.flagData.filter((item: any) => {
      return item.checked == true
    }).map((item: any) => item.name);
    // this.selectedInitailsValue = this.initialsData.filter(function(item:any){
    //   return item.checked==true
    // }).map((item:any)=>item.name);
    //      let roleBy = this.roleData.filter(function(item:any){
    //       return item.checked==true
    //     }).map((item:any)=>item.name);
    //      let selectedRole=[];
    //      for (var i = 0; i < roleBy.length; ++i) {
    //        let rlname = this.tableData.data.filter(function(item:any){
    //          return item.roleNameDescription==roleBy[i];
    //        }).map((rlname:any)=>rlname.createdByRole)[0];
    //        selectedRole.push(rlname);
    //      }
    //      let caseType = this.incidentTypeData.filter(function(item:any){
    //       return item.checked==true
    //     }).map((item:any)=>item.name);
    //      let priority = this.priorityCodeData.filter(function(item:any){
    //       return item.checked==true
    //     }).map((item:any)=>item.name);
    //      let legalStatus = this.incidentStatusData.filter(function(item:any){
    //       return item.checked==true
    //     }).map((item:any)=>item.name);
    //      let store = this.storeData.filter(function(item:any){
    //       return item.checked==true
    //     }).map((item:any)=>item.name);
    //      let selectedStoreId=[];
    //
    //      for (var i = 0; i < store.length; i++) {
    //        let str=store[i];
    //
    //        let selectstore=this.storeData.filter(function(item:any){
    //
    //          return item.name==str
    //        });
    //
    //        if(selectstore!='' && selectstore!=null){

    //        selectedStoreId.push(selectstore);
    //        }
    //      }
    //      let selectedCreatedById=[];
    //      for (var i = 0; i < createdby.length; ++i) {
    //        selectedCreatedById=this.tableData.data.filter(function(item:any){
    //          return item.createdBy==createdby[i]
    //        }).map((item:any)=>item.createdById);
    //      }
    //      let selectedCreatedBy=Array.from((new Set(selectedCreatedById.map((id:any)=>id))));
    //    if(legalStatus.length>0 ||
    // selectedCreatedBy.length>0 ||
    // roleBy.length>0 ||
    // caseType.length>0 ||
    // priority.length>0 ||
    // selectedStoreId.length>0 || this.dateSortValue!=''){
    //          let param = {
    //     "incidentId": "",
    //     "csdNumber": "",
    //     "productId": "",
    //     "createdFromDate": "",
    //     "createdToDate": "",
    //     "caseType": "",
    //     "legalStatus": legalStatus,
    //     "incidentStatus":legalStatus,
    //     "createdBy":selectedCreatedBy,
    //     "roleBy": selectedRole,
    //     "incidentType": caseType,
    //     "priority": priority,
    //     "store": selectedStoreId,
    //     "pageNo":0,
    //     "pageSize":100,
    //     "sortBy":"createdOn",
    //     "sortType":this.dateSortValue,
    //     "isDateWiseSorting":this.isDateWiseSorting,
    //     "employeeId":"1018",
    //     "allStatus":[]
    // };

    let param = {
      "incidentStatus": this.selectedStatus,
      "createdBy": createdby,
      "roleBy": this.selectedRole,
      "incidentType": this.selectedType,
      "priority": selectedPriority,
      "store": selectedStore,
      "pageNo": this.currentPageNo,
      "pageSize": this.currentPageSize,
      "sortType": this.dateSortValue,
      "sortBy": "createdOn",
      "isDateWiseSorting": this.isDateWiseSorting,
      "userName": this.username,
      "flagValue": this.selectedFlagvalue,
      "initialList": this.selectedInitials,
      "incidentCauseIds": this.selectedCause.map((item: any) => item.id),
      // ...this.tableData.commonparams
    }
    if (this.selectedStatus.length > 0 || this.selectedRole.length > 0 || this.selectedType.length > 0 || selectedPriority.length > 0 ||
      selectedStore.length > 0 || this.dateSortValue || createdby.length > 0 || this.selectedFlagvalue.length > 0 || this.selectedInitials.length > 0 || this.selectedCause.length > 0
    ) {
      this.isStopScroll = false;
      // "incidentIds":this.tableData.data.map((item:any)=>item.id),
      this.currentPageNo = 0;

      let combinedparam = {
        ...param,
        ...this.tableData.commonparams
      }
      combinedparam.pageNo = this.currentPageNo
      combinedparam.pageSize = this.currentPageSize
      this.publicParam = param;
      this.commonconbinedparam = combinedparam
      this.getIncidentSubFilterCountData(combinedparam);
      let response: any = await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER, combinedparam);
      if (response) {
        let data = response.payLoad;
        let uniqueData = [];
        for (let x of data) {
          let isExist = uniqueData.filter(function (item: any) {
            return item.id == x.id
          });
          if (isExist.length == 0) {
            uniqueData.push(x);
          }
        }
        this.tableData.data = uniqueData;
        this.ngxService.stop();
      } else {
        this.ngxService.stop();
      }
      this.getSubFilterListData(combinedparam);
      let emitData = { type: 4, data: this.tableData, param: param };
      this.allListEvent.emit(emitData);
    } else {
      //   this.getCreatedByData();
      // this.getTypesData();
      // this.getRolesData();
      // this.getStatusData();
      // this.getStoreData();
      // this.getPriorityData();

      this.getDefaultSubFilterDropDown();
      for (let x of this.incidentTypeShowData) {
        x.isShow = true
      }
      for (let y of this.flagData) {
        y.isShow = true;
      }
      this.publicParam.createdBy = [];
      this.publicParam.flagValue = [];
      this.publicParam.incidentCauseIds = [];
      this.publicParam.incidentStatus = [];
      this.publicParam.incidentType = [];
      this.publicParam.initialList = [];
      this.publicParam.priority = [];
      this.publicParam.roleBy = [];
      this.publicParam.sortType = '';
      this.publicParam.store = [];
      let emitData = { type: 1, data: this.tableData, param: param };
      this.allListEvent.emit(emitData);
    }

  }
  publicParam: any;
  commonconbinedparam: any;
  async filterNextPage() {
    //this.ngxService.start();
    let createdby = this.createdByData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.employeeId);

    let selectedStore = this.storeData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.id);
    let selectedPriority = this.priorityCodeData.filter(function (item: any) {
      return item.checked == true
    }).map((item: any) => item.id);
    let param = {
      "incidentStatus": this.selectedStatus,
      "createdBy": createdby,
      "roleBy": this.selectedRole,
      "incidentType": this.selectedType,
      "priority": selectedPriority,
      "store": selectedStore,
      "pageNo": this.currentPageNo,
      "pageSize": this.currentPageSize,
      "sortBy": "createdOn",
      "sortType": this.dateSortValue,
      "isDateWiseSorting": this.isDateWiseSorting,
      "userName": this.username,
      "flagValue": this.selectedFlagvalue,
      "initialList": this.selectedInitials,
      "incidentCauseIds": this.selectedCause.map((item: any) => item.id),
      // ...this.tableData.commonparams
    }
    let combinedparam = {
      ...param,
      ...this.tableData.commonparams
    }
    combinedparam.pageNo = this.currentPageNo
    combinedparam.pageSize = this.currentPageSize
    this.publicParam = param;
    this.commonconbinedparam = combinedparam
    let response: any = await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER, combinedparam);
    if (response) {
      if (response.payLoad.length > 0) {
        let oldData = this.tableData.data;
        let newData = response.payLoad;
        let finalData = oldData.concat(newData);
        let uniqueData: any = [];
        for (let x of finalData) {
          let isExist = uniqueData.filter(function (item: any) {
            return item.id == x.id;
          })
          if (isExist.length == 0) {
            uniqueData.push(x);
          }
        }
        this.tableData.data = uniqueData;
        this.isStopScroll = false;
        // this.getSubFilterListData(combinedparam);

      } else {
        this.isStopScroll = true;
        this.currentPageNo = 0;
        this.commonconbinedparam.pageNo = 0;
      }

      //this.ngxService.stop();
    } else {
      //this.ngxService.stop();
    }
    let emitData = { type: 4, data: this.tableData, param: param };
    this.allListEvent.emit(emitData);
  }


  async getSubFilterListData(param: any) {

    let response: any = await this.requestapi.postData(this.utils.API.GET_SUBFILTER_LIST, param);
    if (response) {
      let rolesList = response.payLoad.rolesList;
      let priorityList = response.payLoad.priorityList;
      let storesList = response.payLoad.storesList;
      let createdByNamesList = response.payLoad.createdByNamesList;
      let incidentStatusList = response.payLoad.incidentStatusList;
      let incidentTypesList = response.payLoad.incidentTypesList;
      let incidentFlagList = response.payLoad.incidentFlagList;
      let initialsList = response.payLoad.initialList;
      let injurycauseList = response.payLoad.causeInfoList;
      if (this.selectedStore.length == 0) {
        let selectedStore = this.selectedStore.map((item: any) => item.storeDescription);
        this.storeData = [];
        for (let st = 0; st < storesList.length; st++) {

          let isExist = this.storeData.filter(function (item: any) {
            return item.storeDescription == storesList[st].storeDescription;
          });
          let isChecked = selectedStore.includes(storesList[st].storeDescription);
          storesList[st].checked = isChecked;
          if (isExist.length == 0) {
            this.storeData.push(storesList[st]);
          }
        }
      }
      if (this.selectedType.length == 0) {
        for (let i = 0; i < this.incidentTypeShowData.length; i++) {
          let name = this.incidentTypeShowData[i].name;
          let isExist = incidentTypesList.filter(function (item: any) {
            return item == name;
          });
          let isChecked = this.selectedType.includes(incidentTypesList[i]);
          this.incidentTypeShowData[i].checked = isChecked;
          if (isExist.length > 0) {
            this.incidentTypeShowData[i].isShow = true;
          } else {
            this.incidentTypeShowData[i].isShow = false;
          }
        }
      }
      if (this.createdBySelected.length == 0) {
        this.createdByData = [];
        let createdBySelected = this.createdBySelected.map((item: any) => item.employeeName);
        for (let i = 0; i < createdByNamesList.length; i++) {
          let isExist = this.createdByData.filter(function (item: any) {
            return item.employeeName == createdByNamesList[i].employeeName;
          });
          let isChecked = createdBySelected.includes(createdByNamesList[i].employeeName);
          createdByNamesList[i].checked = isChecked;
          if (isExist.length == 0) {
            this.createdByData.push(createdByNamesList[i]);
          }
        }
      }
      if (this.selectedRole.length == 0) {
        this.roleData = [];
        for (let rl = 0; rl < rolesList.length; rl++) {
          let isExist = this.roleData.filter(function (item: any) {
            return item.roleName == rolesList[rl].roleName;
          });
          let isChecked = this.selectedRole.includes(rolesList[rl].roleName);
          rolesList[rl].checked = isChecked;
          if (isExist.length == 0) {
            this.roleData.push(rolesList[rl]);
          }
        }
      }
      if (this.selectedPriority.length == 0) {
        this.priorityCodeData = [];
        for (let prt = 0; prt < priorityList.length; prt++) {
          let isExist = this.priorityCodeData.filter(function (item: any) {
            return item.colorCode == priorityList[prt].colorCode;
          });
          let isChecked = this.selectedPriority.includes(priorityList[prt].colorCode);
          priorityList[prt].checked = isChecked;
          if (isExist) {
            this.priorityCodeData.push(priorityList[prt]);
          }
        }
      }

      //this.createdByData = createdByNamesList;
      if (this.selectedStatus.length == 0) {
        let i = 0;
        this.incidentStatusData = [];
        for (let x = 0; x < incidentStatusList.length; x++) {
          let isChecked = this.selectedStatus.includes(incidentStatusList[x]);
          let data = { id: (x + 1), name: incidentStatusList[x], checked: isChecked };
          let isExist = this.incidentStatusData.filter(function (item: any) {
            return item.name == incidentStatusList[x];
          });
          if (isExist.length == 0) {
            this.incidentStatusData.push(data);
          }

        }
      }

      if (this.selectedInitials.length == 0) {
        let i = 0;
        this.initialsData = [];
        for (let x = 0; x < initialsList.length; x++) {
          let isChecked = this.selectedInitials.includes(initialsList[x]);
          let data = { id: (x + 1), name: initialsList[x], checked: isChecked };
          let isExist = this.initialsData.filter(function (item: any) {
            return item.name == initialsList[x];
          });
          if (isExist.length == 0) {
            this.initialsData.push(data);
          }

        }

        const uniqueArray = [];
        const uniqueNames = new Set();

        this.initialsData.forEach(item => {
          const lowerCaseName = item.name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
          if (!uniqueNames.has(lowerCaseName)) {
            uniqueNames.add(lowerCaseName); // Add the lowercase name to the Set
            uniqueArray.push(item); // Push the original object to the result array
          }
        });
        this.initialsData = uniqueArray
      }
      if (this.selectedCause.length == 0) {
        let selectedcause = this.selectedCause.map((item: any) => item.id);
        this.causeData = [];
        for (let st = 0; st < injurycauseList.length; st++) {

          let isExist = this.causeData.filter(function (item: any) {
            return item.id == injurycauseList[st].id;
          });
          let isChecked = selectedcause.includes(injurycauseList[st].id);
          injurycauseList[st].checked = isChecked;
          if (isExist.length == 0) {
            this.causeData.push(injurycauseList[st]);
          }
        }


      }


      // if(this.selectedFlagvalue.length>0){
      //   for(let x of this.flagData){
      //     let isExist = incidentFlagList.filter(function(item:any){
      //       return item.toLowerCase()==x.name;
      //     })
      //     let isChecked = this.selectedFlagvalue.includes(x.name); 
      //     x.checked=isChecked;
      //     if(isExist.length>0){
      //       x.isShow=true;
      //     }else{
      //       x.isShow=false;
      //     }
      //   }
      // }




    }
  }

  async getDefaultSubFilterDropDown() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_VIEW_DEFAULT_SUBFILTER + '?userName=' + this.username + '&pageNo=' + this.currentPageNo + '&pageSize=' + this.currentPageSize + '&sortBy=created_on');
    if (response) {
      this.roleData = response.payLoad.rolesList;
      this.priorityCodeData = response.payLoad.priorityList;
      this.storeData = response.payLoad.storesList;
      this.createdByData = response.payLoad.createdByNamesList;
      let incidentStatusList = response.payLoad.incidentStatusList;
      this.incidentTypeData = response.payLoad.incidentTypesList;
      let incidentFlagList = response.payLoad.incidentFlagList;
      let initialsList = response.payLoad.initialList;
      this.causeData = response.payLoad.causeInfoList;

      for (let x = 0; x < this.incidentTypeShowData.length; x++) {
        let isExist = this.incidentTypeData.includes(this.incidentTypeShowData[x].name);
        if (isExist) {
          this.incidentTypeShowData[x].isShow = true;
        } else {
          this.incidentTypeShowData[x].isShow = false;
        }
      }

      let i = 0;
      this.incidentStatusData = [];
      for (let x = 0; x < incidentStatusList.length; x++) {
        let data = { id: (x + 1), name: incidentStatusList[x], checked: false };

        this.incidentStatusData.push(data);
      }

      this.initialsData = [];
      for (let x = 0; x < initialsList.length; x++) {
        let data = { id: (x + 1), name: initialsList[x], checked: false };

        this.initialsData.push(data);

      }

      const uniqueArray = [];
      const uniqueNames = new Set();

      this.initialsData.forEach(item => {
        const lowerCaseName = item.name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        if (!uniqueNames.has(lowerCaseName)) {
          uniqueNames.add(lowerCaseName); // Add the lowercase name to the Set
          uniqueArray.push(item); // Push the original object to the result array
        }
      });
      this.initialsData = uniqueArray
      //  this.initialsData = new Set(this.initialsData)
      // for(let x of this.flagData){
      //   let isExist = incidentFlagList.filter(function(item:any){ 
      //     return item.toLowerCase()==x.name
      //   })
      //   if(isExist.length>0){
      //    x.isShow=true;
      //   }else{
      //     x.isShow=false;
      //   }
      // }
    }
  }

  async getCreatedByData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_CREATEDBYNAME_FILTER + '?userName=' + this.username + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      this.createdByData = response.payLoad;
    }
  }
  async getRolesData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_ROLES_FOR_FILTER + '?userName=' + this.username + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      this.roleData = response.payLoad;
    }
  }
  async getTypesData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_TYPES_FOR_FILTER + '?userName=' + this.username + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      this.incidentTypeData = response.payLoad;
      for (let x = 0; x < this.incidentTypeShowData.length; x++) {
        let isExist = this.incidentTypeData.includes(this.incidentTypeShowData[x].name);
        if (isExist) {
          this.incidentTypeShowData[x].isShow = true;
        } else {
          this.incidentTypeShowData[x].isShow = false;
        }
      }
    }
  }
  async getStoreData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_STORE_FOR_FILTER + '?userName=' + this.username + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      this.storeData = response.payLoad;
    }
  }
  async getStatusData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_STATUS_FOR_FILTER + '?userName=' + this.username + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      let dataStatus = response.payLoad
      let i = 0;
      this.incidentStatusData = [];
      for (let x = 0; x < dataStatus.length; x++) {
        let data = { id: (x + 1), name: dataStatus[x], checked: false };

        this.incidentStatusData.push(data);
      }


    }
  }
  async getPriorityData() {
    let response: any = await this.requestapi.getData(this.utils.API.GET_PRIORITY_FOR_FILTER + '?employeeId=' + this.loginEmployeeId + '&pageNo=0&pageSize=100&sortBy=created_on');
    if (response) {
      this.priorityCodeData = response.payLoad;
    }
  }

  setPopOverDropDownValue() {
    this.createdByData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.createdBy != '' && item.createdBy != null;
    }).map((role: any) => role.createdBy))).map(rl => {
      return { name: rl, checked: false }
    });
    this.roleData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.roleNameDescription != '' && item.roleNameDescription != null;
    }).map((role: any) => role.roleNameDescription))).map(rl => {
      return { name: rl, checked: false }
    });
    this.incidentTypeData = Array.from(new Set(this.tableData.data.map((role: any) => role.incidentType))).map(rl => {
      return { name: rl, checked: false }
    });
    this.priorityCodeData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.priorityCode != '' && item.priorityCode != null;
    }).map((role: any) => role.priorityCode))).map(rl => {
      return { name: rl, checked: false }
    });
    this.incidentStatusData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.incidentStatus != '' && item.incidentStatus != null;
    }).map((role: any) => role.incidentStatus))).map(rl => {
      return { name: rl, checked: false }
    });

    this.storeData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.store != '' && item.store != null;
    }).map((role: any) => role.store))).map((rl: any) => {
      return { name: rl, checked: false }
    });
    this.incidentTypeData = Array.from(new Set(this.tableData.data.map((role: any) => role.incidentType))).map(rl => {
      return { name: rl, checked: false }
    });

    this.flagData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.incidentStatus != '' && item.incidentStatus != null;
    }).map((role: any) => role.incidentStatus))).map(rl => {
      return { name: rl, checked: false }
    });
  }
  onTableRowDataClick(data: any) {
    let emitData = { type: 2, data: data };
    if (data.isIncidentLocked) {
      this.common.openSnackBar('This Incident was editing by ' + data.lockedUserName, 2, '');
    } else {
      this.allListEvent.emit(emitData);
    }

  }
  clearTablefilter() {
    this.ngxService.start();
    this.publicParam.createdBy = [];
    this.publicParam.flagValue = [];
    this.publicParam.incidentCauseIds = [];
    this.publicParam.incidentStatus = [];
    this.publicParam.incidentType = [];
    this.publicParam.initialList = [];
    this.publicParam.priority = [];
    this.publicParam.roleBy = [];
    this.publicParam.sortType = "";
    this.publicParam.store = [];
    this.publicParam.isDateWiseSorting = false;
    this.getDefaultSubFilterDropDown();
    this.createdBySelected = [];
    this.selectedRole = [];
    this.selectedType = [];
    this.selectedPriority = [];
    this.selectedStatus = [];
    this.selectedStore = [];
    this.dateSortValue = '';
    this.selectedFlagvalue = [];
    this.selectedInitials = [];
    this.selectedCause = [];
    for (let x of this.incidentTypeShowData) {
      x.checked = false;
      x.isShow = true
    }
    for (let y of this.flagData) {
      y.checked = false;
      y.isShow = true;
    }
    let emitData = { type: 1, data: this.tableData, param: this.publicParam };
    this.allListEvent.emit(emitData);
  }
  // public incidentCountData:any = {draftIncidentCount:0,
  //   openIncidentCount:0,};
  async getIncidentCount() {

    let response: any = await this.requestapi.getData(this.utils.API.GET_INCIDENT_COUNT + '?userName=' + this.username);
    if (response) {
      this.incidentCountData = response.payLoad;
    }
  }

  async getIncidentSubFilterCountData(param: any) {
    let response: any = await this.requestapi.postData(this.utils.API.GET_INCIDENT_SUB_FILTER_COUNT, param);
    if (response) {
      this.incidentCountData = response.payLoad;
    }
  }
}
