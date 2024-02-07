import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuditListService } from './audit-list.service';
import { Router } from '@angular/router';
import { Utils } from "../../shared/incident-shared/module/utils";
import { RequestApiService } from "../../shared/services/incident-services/request-api.service";

import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { ngxService } from '../../shared/services/incident-services/ngxservice';
import { FlatTreeControl } from "@angular/cdk/tree";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CommonService } from '../../shared/services/incident-services/common.service';
import { ErrorHandlerService } from '../../shared/services/incident-services/error-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { files } from 'jszip';


/**
 * Node for to-do item
 */
export class FoodNode {
  children?: FoodNode[];
  item: any;
  id: any;
  name: any;
  countryId: any;
  companyCode: any;
}

/** Flat to-do item node with expandable and level information */
export class FoodFlatNode {
  item: any;
  level: any;
  expandable: any;
  id: any;
  name: any;
  countryId: any;
  companyCode: any;
}

const TREE_DATA: FoodNode[] = [];

@Injectable({ providedIn: "root" })
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<FoodNode[]>([]);
  treeData: any;
  constructor(private api: RequestApiService, private utils: Utils) {
  }
  get data(): FoodNode[] {
    return this.dataChange.value;
  }

  public filter(filterText: string) {
    let filteredTreeData;
    const data = filteredTreeData;
  }
}

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss']
})
export class AuditListComponent implements OnInit, OnDestroy {
  public recordData: boolean = false
  public columsData: string[] = [];
  public showColumnData: any[] = [];
  tableData: any = { colums: [], data: [], showColumn: [] };
  treeControl: FlatTreeControl<FoodFlatNode>;
  myControl = new FormControl();
  filteredOptions: any;
  auditList: any[] = [];
  shimmerTable: boolean = false;
  form!: FormGroup;
  submitted = false;
  downloadRows = [];
  downloadRowsStorecode:any;
  donwloadHide = false;
  countryRegionData: any[] = [];
  // disableFilter = false;
  mailId = "";
  Emails: any[] = [];
  tempTableData:any = [];
  tempTableDataOM:any = [];
  getLevel = (node: FoodFlatNode) => node.level;
  isExpandable = (node: FoodFlatNode) => node.expandable;
  isAllSelected: any = false;
  filterParam: any;
  statusList:any[] = []
  searchEmployee: any = [{ name: 'Store Code', key: 'storeCode' }, { name: 'Store Name', key: 'storeName' }];
  searchBy: any = 'storeCode';
  yearData: any[] = [];
  currentYear:any;
  currentDate:any;
  startDateOfYear:any
  device:any
  username:any = '';
  AuditaccessData:any;
  mainRole:any;
  configDate:any;
  constructor(private ref: ChangeDetectorRef, private formBuilder: FormBuilder, private _database: ChecklistDatabase, public router: Router, public viewservice: AuditListService, public utils: Utils, private api: RequestApiService, private http: HttpClient, public ngxservice: ngxService, public common: CommonService, private errorhandle: ErrorHandlerService, private snackBar: MatSnackBar, private ngxService: NgxUiLoaderService) {

    this.treeControl = new FlatTreeControl<FoodFlatNode>(
      this.getLevel,
      this.isExpandable
    );

    _database.dataChange.subscribe(data => {
      // this.dataSource.data = data;
    });

  }

  ngOnInit(): void {
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      this.ngxservice.userName = userDetails.auditRole;
      this.mainRole = userDetails.roleCode;
      this.getcinfigValues();
      this.generateYearsArray();
      // this.getAuditlist();
      if(this.ngxservice.userName !== 'SM' && this.ngxservice.userName !== 'DM'){
      this.getCountryRegion();
      
    }

    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
    // let HealthSafetyAccessData = JSON.parse(localStorage.getItem('HealthSafetyAccessData'));
    // this.ngxservice.AccessdataAudit = HealthSafetyAccessData[0].app.modules[1]
    let allAccessData = JSON.parse(localStorage.getItem('accessApps')) ;
  let accessData = allAccessData.filter(function(item:any){
              return item.app.appCode=='AT';
            });
    //let accessData = JSON.parse(localStorage.getItem('auditAccessData'));
    if(accessData.length > 0){
      this.AuditaccessData = accessData[0].app.modules[0]
    }
  }

  async getcinfigValues(){
    let configvalue: any = await this.api.getData(this.utils.API.GET_AUDIT_CONFIG_VALUES+ '?userName=' + this.ngxservice.userId + '&id=1');
    if(configvalue.payLoad){
    this.configDate = configvalue.payLoad.configValue;
  }
}

  async generateYearsArray() {
   
    /** With API Function */
    this.currentYear = new Date().getFullYear();
    this.currentDate = new Date();

    let response1: any = await this.api.getData(this.utils.API.GET_AUDIT_YEAR_LIST+ '?userName=' + this.ngxservice.userId);
      if(response1){
        // response1 = response1.map((year: string) => ({ year }))
        if(response1.payLoad.length == 1){
          this.ngxservice.selectedYear = response1.payLoad[0].toString();
          this.getAuditlist();

        }
        else if(response1.payLoad.length == 0){
          this.ngxservice.selectedYear = new Date().getFullYear();
          this.getAuditlist();
        }
        else{
          this.ngxservice.selectedYear = response1.payLoad[0]
          this.getAuditlist();
        }
        const originalArray = response1.payLoad;

        this.yearData = originalArray.map(year => ({ "year": year }));
        
      }
      else{
       this.yearData = [{year : this.currentYear.toString()}]
      }
     
  }

 async selectedyearvalue(){
  this.tableData.data = [];
    // this.ngxservice.shimmerTable = true;
    this.startDateOfYear = new Date(this.currentYear, 0, 1);
    this.startDateOfYear.setDate(this.startDateOfYear.getDate() + this.configDate);

    if(this.ngxservice.selectedYear < this.currentYear - 1){
      this.ngxservice.auditReadonly = true;
     }
   else if((this.currentYear > this.ngxservice.selectedYear) && (this.currentDate > this.startDateOfYear)){
      this.ngxservice.auditReadonly = true
     }
     else{
      this.ngxservice.auditReadonly = false
     }
     this.ngxservice.filterStore = '';
     this.ngxservice.recordButton = false
     this.ngxservice.inspected = false;
     this.ngxservice.disableFilter = false;
     this.ngxservice.onlyNew = false;
     this.tableData.data = [];
     this.ngxservice.selectedCountryRegionData = [];
     this.ngxservice.selectedRegionData = [];
     this.ngxservice.selectedRowLength = 0;
     this.ngxservice.isAllselect = false;
     this.ngxservice.indeterminate = false;
     this.ngxservice.recordButton = false;
     this.ngxservice.selectedRowData = [];
     this.ngxservice.activesort = -1;
     this.ngxservice.dateSortValue = '';
     if(this.tableData.data.length > 0){
     for(let x of this.tableData.data){
       x.checked = false
     }
   }
     if(this.countryRegionData.length > 0){
     for (let x of this.countryRegionData) {
       x.checked = false
     }
   }
   if(this.ngxservice.viewednameData){
     for (let x of this.ngxservice.viewednameData) {
       x.checked = false;
     }
   }
   if(this.ngxservice.assignedManagerData){
     for (let x of this.ngxservice.assignedManagerData) {
       x.checked = false;
     }
   }
   this.ngxservice.selectedassignedManagerType = [];
   this.ngxservice.selectedviewedNameBy = [];
  
     
     this.getAuditlist()

  }
  get f() { return this.form.controls; }

  inspectedvalue() {
    this.ngxservice.filterStore = '';
    this.ngxservice.activesort = -1;
    this.ngxservice.dateSortValue = '';
    this.ngxservice.inspected = this.ngxservice.inspected ? false : true;
    this.ngxservice.isAllselect = false;
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false
    }
  }
    this.ngxservice.indeterminate = false;
    this.ngxservice.recordButton = false
    if(this.ngxservice.filterStore == ''){
    setTimeout(() => {
      this.getYearCrAuditedFilter();
    }, 200);
  }
  else{
    setTimeout(() => {
    this.getFilterData();
  }, 200);
  
  }
  }

  // async getStoreandinspected(){
  //   this.tableData.data = [];
  //   this.ngxservice.shimmerTable = true;
  //   this.http.get(this.utils.API.FILTER_INSPECTED_STORE + '?store=' + this.ngxservice.filterStore + '&year=' + this.ngxservice.selectedYear).subscribe((res: any) => {
  //     if(res.payLoad){
  //     this.tableData.data = res.payLoad;
  //     this.tableData.data = this.tableData.data.filter((item:any) => {
  //       return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
  //      }) 
  //     this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
  //     this.ngxservice.shimmerTable = false;
  //     if (this.tableData.data.length == 0) {
  //       this.ngxservice.recordButton = true;
  //     }
  //     else {
  //       this.ngxservice.recordButton = false;
  //     }
  //   }
  //   });
  // }

  async inspectedvalue1() {
    this.ngxservice.onlyNew = this.ngxservice.onlyNew ? false : true;
    this.ngxservice.filterStore = '';
    this.ngxservice.recordButton = false
    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.selectedassignedManagerType = [];
    this.ngxservice.indeterminate = false;
    this.ngxservice.isAllselect = false;
    this.ngxservice.selectedRowLength = 0;
    if(this.ngxservice.onlyNew == true){
    this.tableData.data = this.tableData.data.filter((item:any)=> item.storeAuditStatus == 'open')
    this.ngxservice.commonauditTablelist = this.tableData.data;
    this.ngxservice.TempcommonauditTablelist = this.tableData.data;
    this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: false }
    });
    if(this.tableData.data.length == 0){
      this.ngxservice.recordButton = true;
    }
    else{
      this.ngxservice.recordButton = false
    }
  }
    else{
     this.tableData.data = this.tempTableData;
     this.ngxservice.commonauditTablelist = this.tableData.data;
     this.ngxservice.TempcommonauditTablelist = this.tableData.data;
     this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: false }
    });
     this.ngxservice.recordButton = false;
    }
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false;
    }
  }
  }

  async getCountryRegion() {
    let response1: any = await this.api.getData(this.utils.API.GET_COUNTRY_DATA + '?userName=' + this.ngxservice.userId);
    if(response1){
    this.countryRegionData = response1.payLoad;
    if(this.countryRegionData.length > 0)
    for (let x of this.countryRegionData) {
     x.checked = false
    }
    }
  }
  
  async getAuditlist() {
    this.ngxservice.shimmerTable = true;
    /** +'&currentYear='+ this.ngxservice.selectedYear */
    let response: any = await this.api.getData(this.utils.API.STORE_LIST + '?userName=' + this.ngxservice.userId +'&currentYear='+ this.ngxservice.selectedYear); 
    this.auditList = response.payLoad;
    // this.auditList = this.auditList.filter((item:any) => {
    //  return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
    // })   
    this.auditList.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
    this.tableData.data = this.auditList;
    this.ngxservice.commonauditTablelist = this.tableData.data;
    this.ngxservice.TempcommonauditTablelist = this.tableData.data;
    this.ngxservice.fixedauditTablelist = this.tableData.data;
    this.tempTableData = this.tableData.data;
    this.tempTableDataOM = this.tableData.data;

     if(response.payLoad[0] == null){
      this.ngxservice.recordButton = true;
      this.ngxservice.hideTable = true
     }
     else{
      if (this.tableData.data.length > 0){

        this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.assignedManager != '' && item.assignedManager != null;
        }).map((role: any) => role.assignedManager))).map(rl => {
          return { name: rl, checked: false }
        });
        let finalassignedManagerData = []
        this.ngxservice.assignedManagerData.forEach(element => {
         let data = element.name.split(',');
         if(data.length>0){
          finalassignedManagerData = finalassignedManagerData.concat(data);
         } 
        });
        let finalOriginalData = [];
    
        for(let x of finalassignedManagerData){
          if(finalOriginalData.includes(x)==false){
  
            finalOriginalData.push(x.trim());
          }
        
        }
        finalOriginalData = Array.from(new Set(finalOriginalData));
        this.ngxservice.assignedManagerData = finalOriginalData.map(rl => {
          return { name: rl, checked: false }
        })
        /* Last Viewed Persion Filter */
        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });
  
        /* Store Name Filter Data */
        this.ngxservice.storenameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.storeDescription != '' && item.storeDescription != null;
        }).map((role: any) => role.storeDescription))).map(rl => {
          return { name: rl, checked: false }
        });
  
        /* Upload Date Filter Data */
        this.ngxservice.updatepdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.updatedAt != '' && item.updatedAt != null;
        }).map((role: any) => role.updatedAt))).map(rl => {
          return { name: rl, checked: false }
        });
  
        /* View Date Filter Data */
        this.ngxservice.reviewpdfData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewAt != '' && item.reviewAt != null;
        }).map((role: any) => role.reviewAt))).map(rl => {
          return { name: rl, checked: false }
        });
      
      let fileavailableTable = this.tableData.data.filter((x: any) => (x.files !== null && x.files !== ''))
      if (fileavailableTable.length > 0) {
        this.ngxservice.donwloadHide = false
      }
      else {
        this.ngxservice.donwloadHide = true
      }

    if (this.tableData.data == 0) {
      this.ngxservice.recordButton = true;
      this.ngxservice.shimmerTable = false;
    }
    else {
      this.ngxservice.recordButton = false;
      this.ngxservice.shimmerTable = true;
    }
     }
    }
    this.ngxservice.shimmerTable = false;
    if(document.getElementById("listTable")){
      const doc: any = document.getElementById("listTable")?.clientWidth;
      this.ngxservice.auditShimmerWidth = doc;
      this.ngxservice.auditShimmerWidth = this.ngxservice.auditShimmerWidth - 0;
      }
  }

  getTableListEvent(data: any) {
    // this.getAuditlist();
  }

  getSelectedItems() {
    if (!this.ngxservice.selectedCountryRegionData.length)
      return "All";
    return "Filter Applied";
  }


  /* Get Selected Country or Region Value */
  getSelectedCR(node: any) {
    this.ngxservice.filterStore = '';
    this.ngxservice.recordButton = false
    node.checked = node.checked ? false : true;
    if(this.ngxservice.userName == 'AD' || this.ngxservice.userName == 'HR' || this.ngxservice.userName == 'SA'){
      this.ngxservice.selectedCountryRegionData = this.countryRegionData.filter(function (item: any) {
      return item.checked;
    }).map((role: any) => role.countryDescription).map(rl => {
      return rl
    });
  }
  else{
      this.ngxservice.selectedRegionData = this.countryRegionData.filter(function (item: any) {
      return item.checked;
    }).map((role: any) => role.id).map(rl => {
      return rl
    });
    this.ngxservice.selectedCountryRegionData = this.countryRegionData.filter(function (item: any) {
      return item.checked;
    }).map((role: any) => role.regionDescription).map(rl => {
      return rl
    });
  }
  if(this.ngxservice.dateSortValue == ''){
 setTimeout(() => {
  this.getYearCrAuditedFilter()
 }, 200);
}
else{
  this.getAuduiListFilter()
}
  }

  filterChanged(e: any) {
    let filterText = e.target.value;
    this._database.filter(filterText);
  }

  /* Year Filter Value*/
  async getYearFilter() {
    // await this.http.get(this.utils.API.FILTER_YEAR).subscribe((res:any)=>{
    //  });
  }

  /* Get Filter Data by Store name or Store id */
  async getFilterData() {
    // this.tableData.data = [];
    // this.ngxservice.shimmerTable =true;
    // this.http.get(this.utils.API.FILTER_STORE + '?store=' + this.filterStore + "&employeeId=" + this.ngxservice.userId).subscribe((res: any) => {
    //   this.tableData.data = res.payLoad;
    //   this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
    //   this.ngxservice.shimmerTable = false;
    //   if (this.tableData.data.length == 0) {
    //     this.ngxservice.recordButton = true;
    //   }
    //   else {
    //     this.ngxservice.recordButton = false;
    //   }
    // });
    this.ngxservice.recordButton = false
    this.tableData.data = this.ngxservice.fixedauditTablelist;
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false;
    }
  }
    if(this.searchBy == 'storeCode'){
    this.tableData.data = this.tableData.data.filter((item:any) =>
      item.storeCode.toLowerCase().startsWith(this.ngxservice.filterStore.toLowerCase())
    );
    }
    else{
      this.tableData.data = this.tableData.data.filter((item:any) =>
      item.storeDescription.toLowerCase().startsWith(this.ngxservice.filterStore.toLowerCase())
    );
    }
    if(this.tableData.data.length == 0){
      this.ngxservice.recordButton = true
    }
    else{
      this.ngxservice.recordButton = false
    }
    // let fileavailableTable = this.tableData.data.filter((x: any) => (x.files !== null && x.files !== ''))
    //   if (fileavailableTable.length > 0) {
    //     this.ngxservice.donwloadHide = false
    //   }
    //   else {
    //     this.ngxservice.donwloadHide = true
    //   }
  }

   getYearCrAuditedFilter() {
    if (this.ngxservice.userName == 'AD' || this.ngxservice.userName == 'HR' || this.ngxservice.userName == 'SA') {
      this.filterParam = {
        "year": this.ngxservice.selectedYear,
        "country": (this.ngxservice.selectedCountryRegionData.length) ? this.ngxservice.selectedCountryRegionData : null,
        "inspectedFlag": (this.ngxservice.inspected) ? false : true,
        "userName" : this.ngxservice.userId
      }
      this.tableData.data = [];
      this.ngxservice.shimmerTable = true;
      let Token = localStorage.getItem("authenticationToken")
      this.http.post(this.utils.API.GET_FILTERS_COUNTRY_DATA, this.filterParam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
        this.tableData.data = res.payLoad;
        // this.tableData.data = this.tableData.data.filter((item:any) => {
        //   return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
        //  }) 
        this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
        this.tempTableData = this.tableData.data;
        this.ngxservice.commonauditTablelist = this.tableData.data;
        this.ngxservice.TempcommonauditTablelist = this.tableData.data;
          /* Assigned Manager Filter */

      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      let finalassignedManagerData = []
      this.ngxservice.assignedManagerData.forEach(element => {
       let data = element.name.split(',');
       if(data.length>0){
        finalassignedManagerData = finalassignedManagerData.concat(data);
       } 
      });
      let finalOriginalData = [];
  
      for(let x of finalassignedManagerData){
        if(finalOriginalData.includes(x)==false){

          finalOriginalData.push(x.trim());
        }
      
      }
      finalOriginalData = Array.from(new Set(finalOriginalData));
      this.ngxservice.assignedManagerData = finalOriginalData.map(rl => {
        return { name: rl, checked: false }
      })
          /* Last Viewed Persion Filter */
        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });
        if (this.tableData.data.length == 0) {
          this.ngxservice.recordButton = true;
          this.ngxservice.shimmerTable = false;

        }
        else {
          this.ngxservice.recordButton = false
        }
        this.ngxservice.shimmerTable = false
      });
    }
    else if (this.ngxservice.userName == 'OM') {
      this.filterParam = {
        "year": this.ngxservice.selectedYear,
        "region": (this.ngxservice.selectedRegionData.length) ? this.ngxservice.selectedRegionData : null,
        "userName" : this.ngxservice.userId
      }
      this.tableData.data = []
      this.ngxservice.shimmerTable = true;
      let Token = localStorage.getItem("authenticationToken")
      this.http.post(this.utils.API.GET_FILTERS_REGION_DATA, this.filterParam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
        this.tableData.data = res.payLoad;
        // this.ngxservice.commonauditTablelist = this.tableData.data;
        // this.tableData.data = this.tableData.data.filter((item:any) => {
        //   return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
        //  }) 
        this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
        this.tempTableData = this.tableData.data;

          if(this.ngxservice.onlyNew == true){
        this.tableData.data = this.tableData.data.filter((item:any)=> item.storeAuditStatus == 'open')
        this.ngxservice.commonauditTablelist = this.tableData.data;
        this.ngxservice.TempcommonauditTablelist = this.tableData.data;
        this.ngxservice.viewednameData = Array.from(new Set(this.ngxservice.commonauditTablelist.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });
        if(this.tableData.data.length == 0){
          this.ngxservice.recordButton = true;
        }

      }
        else{
         this.tableData.data = this.tempTableData;
         this.ngxservice.commonauditTablelist = this.tableData.data;
         this.ngxservice.TempcommonauditTablelist = this.tableData.data;
         this.ngxservice.recordButton = false;
         /* Assigned Manager Filter */

      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      let finalassignedManagerData = []
      this.ngxservice.assignedManagerData.forEach(element => {
       let data = element.name.split(',');
       if(data.length>0){
        finalassignedManagerData = finalassignedManagerData.concat(data);
       } 
      });
      let finalOriginalData = [];
  
      for(let x of finalassignedManagerData){
        if(finalOriginalData.includes(x)==false){

          finalOriginalData.push(x.trim());
        }
      
      }
      finalOriginalData = Array.from(new Set(finalOriginalData));
      this.ngxservice.assignedManagerData = finalOriginalData.map(rl => {
        return { name: rl, checked: false }
      })
         /* Last Viewed Persion Filter */
    this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: false }
    });
        }
        if (this.tableData.data.length == 0) {
          this.ngxservice.recordButton = true;
          this.ngxservice.shimmerTable = false;

        }
        else {
          this.ngxservice.recordButton = false
        }
        this.ngxservice.shimmerTable = false
      });
    }
    else {
      this.filterParam = {
        "year": this.ngxservice.selectedYear,
        "userName" : this.ngxservice.userId,
      }
      this.tableData.data = []
      this.ngxservice.shimmerTable = true;
      let Token = localStorage.getItem("authenticationToken")
      this.http.post(this.utils.API.GET_FILTERS_REGION_DATA, this.filterParam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
        this.tableData.data = res.payLoad;
        // this.tableData.data = this.tableData.data.filter((item:any) => {
        //   return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
        //  }) 
        this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
        this.tempTableData = this.tableData.data;
          if(this.ngxservice.onlyNew == true){
        this.tableData.data = this.tableData.data.filter((item:any)=> item.storeAuditStatus == 'open')
        this.ngxservice.commonauditTablelist = this.tableData.data;
        this.ngxservice.TempcommonauditTablelist = this.tableData.data;

        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });
        if(this.tableData.data.length == 0){
          this.ngxservice.recordButton = true;
        }
      }
        else{
         this.tableData.data = this.tempTableData;
         this.ngxservice.recordButton = false;
         /* Assigned Manager Filter */

      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      let finalassignedManagerData = []
      this.ngxservice.assignedManagerData.forEach(element => {
       let data = element.name.split(',');
       if(data.length>0){
        finalassignedManagerData = finalassignedManagerData.concat(data);
       } 
      });
      let finalOriginalData = [];
  
      for(let x of finalassignedManagerData){
        if(finalOriginalData.includes(x)==false){

          finalOriginalData.push(x.trim());
        }
      
      }
      finalOriginalData = Array.from(new Set(finalOriginalData));
      this.ngxservice.assignedManagerData = finalOriginalData.map(rl => {
        return { name: rl, checked: false }
      })
      /* Last Viewed Persion Filter */
    this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
      return item.reviewByName != '' && item.reviewByName != null;
    }).map((role: any) => role.reviewByName))).map(rl => {
      return { name: rl, checked: false }
    });
        }
        if (this.tableData.data.length == 0) {
          this.ngxservice.recordButton = true;
          this.ngxservice.shimmerTable = false;

        }
        else {
          this.ngxservice.recordButton = false
        }
        this.ngxservice.shimmerTable = false
      });

    }

    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.selectedassignedManagerType = [];
    // this.ngxservice.activesort = -1;
    this.ngxservice.selectedRowLength = 0;
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false
    }
  }
    this.ngxservice.isAllselect = false;
    this.ngxservice.indeterminate = false;
    this.downloadRows = [];
  }

  /* Clear All Filter */
 async clearFilter() {
    this.ngxservice.filterStore = '';
    this.ngxservice.recordButton = false
    this.ngxservice.inspected = false;
    this.ngxservice.disableFilter = false;
    this.ngxservice.onlyNew = false;
    this.tableData.data = [];
    this.ngxservice.selectedCountryRegionData = [];
    this.ngxservice.selectedRegionData = [];
    this.ngxservice.selectedRowLength = 0;
    this.ngxservice.isAllselect = false;
    this.ngxservice.indeterminate = false;
    this.ngxservice.recordButton = false;
    this.ngxservice.selectedRowData = [];
    
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false
    }
  }
    if(this.countryRegionData.length > 0){
    for (let x of this.countryRegionData) {
      x.checked = false
    }
  }
  if(this.ngxservice.viewednameData){
    for (let x of this.ngxservice.viewednameData) {
      x.checked = false;
    }
  }
  if(this.ngxservice.assignedManagerData){
    for (let x of this.ngxservice.assignedManagerData) {
      x.checked = false;
    }
  }
  this.ngxservice.selectedassignedManagerType = [];
  this.ngxservice.selectedviewedNameBy = [];
    setTimeout(() => {
      this.getAuditlist();
    }, 200);

  }

  async getDataByFindStoreChange(e: any) {
    this.ngxservice.filterStore = e.srcElement.value.trim();
    this.ngxservice.activesort = -1;
    if(this.countryRegionData.length > 0){
    for (let x of this.countryRegionData) {
      x.checked = false
    }
  }
  if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false
    }
  }
  if(this.ngxservice.viewednameData){
    for (let x of this.ngxservice.viewednameData) {
      x.checked = false;
    }
  }
  if(this.ngxservice.assignedManagerData){
    for (let x of this.ngxservice.assignedManagerData) {
      x.checked = false;
    }
  }
    this.ngxservice.selectedCountryRegionData = [];
    this.ngxservice.isAllselect = false;
    this.ngxservice.indeterminate = false;
    this.ngxservice.selectedRowLength = 0;
    this.ngxservice.inspected = false;
    this.ngxservice.onlyNew = false;
    this.ngxservice.selectedassignedManagerType = [];
    this.ngxservice.selectedviewedNameBy = [];
    // this.ngxservice.shimmerTable = true;

    this.getFilterData();
    if (this.ngxservice.filterStore !== '') {
      this.ngxservice.disableFilter = true
    }
    else {
      this.tableData.data = [];
      this.ngxservice.recordButton = false
      this.ngxservice.shimmerTable = true;
      this.getAuditlist();
      this.ngxservice.disableFilter = false
    }
  }

  async yearChange(e: any) {
    this.getYearFilter()
  }

  getMail(e: any) {
    if (this.form.valid) {
      this.mailId = e.target.value;
    }
  }

  mailparam:any
  downloadRows1:any = [];
  async sendMail() {
    this.ngxservice.isAllselect = false;
    this.ngxservice.indeterminate = false;
    if(this.tableData.data.length > 0){
    for(let x of this.tableData.data){
      x.checked = false
    }
    }
    this.ngxservice.selectedRowLength = 0;
    if(this.ngxservice.fixedauditTablelist.length == 1){
      this.mailparam = {
        "year" : this.ngxservice.selectedYear,
        "storeCode" : [this.ngxservice.fixedauditTablelist[0].storeCode],
        "emailId": this.Emails.toString(),
        "userName" : this.ngxservice.userId
      }
    }
  
  else{
    if(this.downloadRows.length == 0){
      this.mailparam = {
        "year": this.ngxservice.selectedYear,
        "storeCode": this.downloadRows1,
        "emailId": this.Emails.toString(),
        "userName" : this.ngxservice.userId
      }
    }
   else {
      this.mailparam = {
        "year" : this.ngxservice.selectedYear,
        "storeCode": this.downloadRows,
        // "storeCode" :this.downloadRowsStorecode !== undefined ? this.downloadRowsStorecode: '',
        "emailId": this.Emails.toString(),
        "userName" : this.ngxservice.userId
      }
    }

  }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_DOWNLIAD_FILE, this.mailparam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
     if(res.payLoad.status == "Success"){
      this.common.openSnackBar('Generating the report. Will send to the mail shortly.', 2, "");
     }
    });
    this.Emails = [];
    this.downloadRows = [];
  }

  addMailId() {
    if (this.form.valid) {
      let existing = this.Emails.filter((item:any)=>{
        return item == this.mailId
       })
    
       if(existing.length > 0){
        this.common.openSnackBar("Mail Id Already Exists",2,"Invalid")
       }
       else{
      this.Emails.push(this.mailId);
      this.mailId = "";
      this.ref.detectChanges();
       }
    }
  }

  removeEmail(m: any) {
    let temp = this.Emails.splice(m, 1);
  }

  getdownloadRow() {
    //   this.ngxservice.selectedRowData = [];
    this.Emails = [];
    if (this.tableData.data.filter((data: any) => data.checked == true).length > 0) {
      this.downloadRows = (this.tableData.data.filter((data: any) => (data.checked == true && data.files!='' && data.files!=null))).map((item: any) => item.storeCode)
    }
    else {
      // this.downloadRows = this.tableData.data.map((item: any) => item.auditId);
      this.downloadRows1 = this.tableData.data.filter(function(item:any){
        return item.files!='' && item.files!=null;
      }).map((item: any) => item.storeCode);
    }

    if(this.tableData.data.filter((data: any) => data.checked == true).length == 1){
    this.downloadRowsStorecode = (this.tableData.data.filter((data: any) => data.checked == true)).map((item: any) => item.storeCode)
    }
  }

  cancelMail() {
    this.mailId = '';
    this.Emails = [];
    this.ref.detectChanges();
  }

 async getMailStatus(){
  this.ngxService.start();
    let response: any = await this.api.getData(this.utils.API.GET_EXPORT_STATUS + '?userName=' + this.ngxservice.userId);
    if(response.payLoad){
       this.statusList = response.payLoad;
       this.ngxService.stop();
    }
    else{
      this.ngxService.stop();
      this.common.openSnackBar("Internal Server Error",2,"Invalid"
      );
    }
  }
  clearSearchText(){
    // this.filterStore = '';
    // this.getFilterData();
  }
  ngOnDestroy(){
    this.ngxservice.filterStore = '';
    this.ngxservice.recordButton = false
    this.ngxservice.inspected = false;
    this.ngxservice.onlyNew = false;
    this.ngxservice.selectedCountryRegionData = [];
    this.ngxservice.selectedRegionData = [];
    this.ngxservice.selectedRowLength = 0;
    this.ngxservice.isAllselect = false;
    this.ngxservice.indeterminate = false;
    this.ngxservice.recordButton = false;
    this.ngxservice.selectedRowData = [];
    this.ngxservice.activesort = -1;
    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.assignedManagerData = [];
    this.ngxservice.selectedassignedManagerType = [];
    this.ngxservice.selectedviewedNameBy = [];
    this.ngxservice.auditReadonly = false;
   }

   
  async getAuduiListFilter() {
    this.ngxservice.shimmerTable = true
    this.tableData.data = [];
    let param: any;
    if (this.ngxservice.userName == "AD" || this.ngxservice.userName == "HR" || this.ngxservice.userName == "SA") {
      param = {
        "sortType": this.ngxservice.dateSortValue,
        "sortBy": "storeDescription",
        "country": (this.ngxservice.selectedCountryRegionData.length) ? this.ngxservice.selectedCountryRegionData : null,
        "filterType": "country",
         "userName":this.ngxservice.userId,
         "year":this.ngxservice.selectedYear
      }
    }
    else if (this.ngxservice.userName == "OM") {
      param = {
        "sortType": this.ngxservice.dateSortValue,
        "sortBy": "storeDescription",
        "region": (this.ngxservice.selectedRegionData.length) ? this.ngxservice.selectedRegionData : null,
        "filterType": "region",
         "userName":this.ngxservice.userId,
         "year":this.ngxservice.selectedYear
      }
    }
    else {
      param = {
        "sortType": this.ngxservice.dateSortValue,
        "sortBy": "storeDescription",
         "userName":this.ngxservice.userId,
         "year":this.ngxservice.selectedYear
      }
    }
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.AUDIT_LIST_FILTER, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      this.tableData.data = res.payLoad;
      // this.tableData.data = this.tableData.data.filter((item:any) => {
      //   return (item.storeIsActive == true && (item.fileName !== '' || item.fileName !== null)) || (item.storeIsActive == false && (item.fileName !== '' && item.fileName !== null))
      //  }) 
      // this.tableData.data.sort((a: any, b: any) => (a.storeCode > b.storeCode) ? 1 : -1);
      this.tempTableData = this.tableData.data;
         /* Assigned Manager Filter */
        /* Assigned Manager Filter */

      this.ngxservice.assignedManagerData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
        return item.assignedManager != '' && item.assignedManager != null;
      }).map((role: any) => role.assignedManager))).map(rl => {
        return { name: rl, checked: false }
      });
      let finalassignedManagerData = []
      this.ngxservice.assignedManagerData.forEach(element => {
       let data = element.name.split(',');
       if(data.length>0){
        finalassignedManagerData = finalassignedManagerData.concat(data);
       } 
      });
      let finalOriginalData = [];
  
      for(let x of finalassignedManagerData){
        if(finalOriginalData.includes(x)==false){

          finalOriginalData.push(x.trim());
        }
      
      }
      finalOriginalData = Array.from(new Set(finalOriginalData));
      this.ngxservice.assignedManagerData = finalOriginalData.map(rl => {
        return { name: rl, checked: false }
      })
        /* Last Viewed Persion Filter */
        this.ngxservice.viewednameData = Array.from(new Set(this.tableData.data.filter(function (item: any) {
          return item.reviewByName != '' && item.reviewByName != null;
        }).map((role: any) => role.reviewByName))).map(rl => {
          return { name: rl, checked: false }
        });

      for( let x of this.tableData.data){
        let isExist=this.ngxservice.selectedRowData.filter(function(item:any){
          return item.auditId==x.auditId
        })
        if(isExist.length > 0){
          x.checked=true;
        }
      }
      this.ngxservice.selectedRowLength = (this.tableData.data.filter((x: any) => x.checked == true).length);
      if (this.tableData.data.length == 0) {
        this.ngxservice.recordButton = true
        this.ngxservice.shimmerTable = false
      }
      else {
        this.ngxservice.recordButton = false
      }
      this.ngxservice.shimmerTable = false
    });
  }
}

