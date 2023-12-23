import { Component,OnInit,Injectable,  ChangeDetectorRef,HostListener,ViewChild
  ,ViewChildren, 
  QueryList,
  AfterViewInit} from '@angular/core';
  import { IncidentService } from '../incident.service';
  import { Router } from "@angular/router";
  import { RequestApiService } from '../../shared/services/incident-services/request-api.service';
  import { Utils } from '../../shared/incident-shared/module/utils';
  import { Utils as leranersutils }  from '../../shared/utils';
  
  import { SelectionModel } from "@angular/cdk/collections";
  import { FlatTreeControl } from "@angular/cdk/tree";
  import { CommonService } from '../../shared/services/incident-services/common.service';
  // import { Component, Injectable, OnInit } from "@angular/core";
  import {
    MatTreeFlatDataSource,
    MatTreeFlattener
  } from "@angular/material/tree";
  import { BehaviorSubject } from "rxjs";
  import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
  import { Observable } from "rxjs";
  import { map, startWith } from "rxjs/operators";
  import { DatePipe } from '@angular/common';
  import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
  import { NgxUiLoaderService } from 'ngx-ui-loader';
  import { HttpClient } from '@angular/common/http';
  import { getDay, getFullYear, getMonth } from 'ngx-bootstrap/chronos';
  import moment from 'moment';
  import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';
  import { DaterangepickerComponent } from 'ng2-daterangepicker';

  export interface incidentData {
    incidentId: string;
    createdOn: string;
    CreatedBy: string;
    createrRole: string;
    type:string,
    priority:string,
    status:string,
    country:string,
    region:string,
    store:string
  }
  
  
  
  /**
   * Node for to-do item
   */
  export class FoodNode {
    children?: FoodNode[];
    item: any;
    id:any;
    name:any;
    countryId:any;
    companyCode:any;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class FoodFlatNode {
    item: any;
    level: any;
    expandable: any;
    id: any;
    name:  any;
     countryId:any;
     companyCode:any;
  }
  
  /**
   * The Json object for to-do list data.
  
    {
      item: "UK",
      id:2,
      name:'UK',
      countryId:0 ,
      companyCode:'UK',
      children: [
        { item: "Carrickmines Dublin",id:1,name:'UK',countryId:2,
      companyCode:'UK',},
        { item: "Region 5",id:1,name:'UK',countryId:2,
      companyCode:'UK', },
      ]
    },
    {
      item: "RIO"
      ,id:2,name:'UK',
      countryId:0,
      companyCode:'UK',
      children: [
      {item: "Region 11" ,id:2,name:'UK' , countryId:2,
      companyCode:'UK'    },
      { item: "Region 12" , id:2, name:'UK', countryId:2,
      companyCode:'UK'   }
      ]
    }
   */
  const TREE_DATA: FoodNode[] = [];
  
  /**
   * Checklist database, it can build a tree structured Json object.
   * Each node in Json object represents a to-do item or a category.
   * If a node is a category, it has children items and new items can be added under the category.
   */
  @Injectable({ providedIn: "root" })
  export class ChecklistDatabase {
  
    dataChange = new BehaviorSubject<FoodNode[]>([]);
    treeData: any;
  
    get data(): FoodNode[] {
      return this.dataChange.value;
    }
  
    constructor (private requestapi:RequestApiService,private utils:Utils,public incidentService:IncidentService, public formBuilder: FormBuilder) {
      this.initialize();
    }
  public loginEmployeeId:any;
  public username:any;
  
  
    async initialize() {
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      this.username = localStorage.getItem('username');
      this.loginEmployeeId = userDetails.employeeId;
      let countryRegionData:any = await this.getEmployeeRegion();
        let data1:any = [];
      for (var i = 0; i < countryRegionData.length; i++) {
        let country:any={item:countryRegionData[i].countryDescription,
          name:countryRegionData[i].countryDescription,
          id:countryRegionData[i].id,
          countryId:0,
          companyCode:countryRegionData[i].companyCode,
          children:[],
  
        }
        for (var j = 0; j < countryRegionData[i].regions.length; j++) {
           let regions:any ={item:countryRegionData[i].regions[j].regionDescription,
          name:countryRegionData[i].regions[j].regionDescription,
          id:countryRegionData[i].regions[j].id,
          countryId:countryRegionData[i].regions[j].countryId,
          companyCode:countryRegionData[i].regions[j].companyCode};
          country.children.push(regions);
        }
         data1.push(country);
      }
      this.treeData = data1;
      //this.treeData = TREE_DATA;
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      //     file node as children.
      //const data = TREE_DATA;
  const data = data1;
      // Notify the change.
      this.dataChange.next(data);
    }
    async getEmployeeRegion(){
  
    let response:any=await this.requestapi.getData(this.utils.API.GET_COUNTRY_REGION+'?userName='+this.username);
    return response.payLoad;
  
  }
  
    public filter(filterText: string) {
      let filteredTreeData;
      if (filterText) {
        // Filter the tree
        function filter(array:any, text:any) {
          const getChildren = (result:any, object:any) => {
            if (object.item .toLowerCase() === text.toLowerCase() ) {
              result.push(object);
              return result;
            }
            if (Array.isArray(object.children)) {
              const children = object.children.reduce(getChildren, []);
              if (children.length) result.push({ ...object, children });
            }
            return result;
          };
  
          return array.reduce(getChildren, []);
        }
  
        filteredTreeData = filter(this.treeData, filterText);
      } else {
        // Return the initial tree
        filteredTreeData = this.treeData;
      }
  
      // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
      // file node as children.
      const data = filteredTreeData;
      // Notify the change.
      this.dataChange.next(data);
    }
  }
  @Component({
    selector: 'app-incident-list',
    templateUrl: './incident-list.component.html',
    styleUrls: ['./incident-list.component.scss']
  })
  export class IncidentListComponent implements OnInit, AfterViewInit{
     @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoCompleteTrigger: any;
    @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autoCompleteTrigger1: any;
    @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) autoCompleteTrigger2: any;
     @ViewChildren(MatAutocompleteTrigger) autoCompleteTriggers:any;
   @HostListener('window:scroll', ['$event']) onScrollEvent($event:any){
      this.closeAllPanels();
    }
   public closeAllPanels() {
      this.autoCompleteTriggers.forEach((trigger:any) => {
        if (trigger.panelOpen) {
          trigger.closePanel();
        }
      });
    }
  
    public maxDate:any;
    public isShimmerShow = true;
    public incidentSelectedTypeData:any;
    public isList:boolean = true;
    public incidentTypeData = [{id:1,name:'Customer',isShow:true},{id:2,name:'Employee',isShow:true},{id:3,name:'Contractor',isShow:true},{id:4,name:'Product',isShow:true}];
    public columsData:string[] = [];
    public showColumnData:any[] = [];
    public titleData: any[] = [{id:1,name:'Incident',url:'incident-list',isActive:true}]
    public incidentDataList: any = [];
  tableData:any = {colums:[],data:[],showColumn:[],commonparams:{}};
  isShowTable:any = false;
  filterParam ={findCase:'',countryRegion:'',fromDate:'',toDate:'',status:'all',storeId:'', searchby : '1'};
  statusListData:any = []
  public countryRegionData:any = [];
  public filterAppliadText:any = '';
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<FoodFlatNode, FoodNode>();
  
    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<FoodNode, FoodFlatNode>();
  
    /** A selected parent node to be inserted */
    selectedParent: FoodFlatNode | null = null;
  
    /** The new item's name */
    newItemName = "";
  
    treeControl: FlatTreeControl<FoodFlatNode>;
  
    treeFlattener: MatTreeFlattener<FoodNode, FoodFlatNode>;
  
    dataSource: MatTreeFlatDataSource<FoodNode, FoodFlatNode>;
  
    /** The selection for checklist */
    checklistSelection = new SelectionModel<FoodFlatNode>(true /* multiple */);
  
    /// Filtering
    myControl = new FormControl();
    options: string[] = ["One", "Two", "Three"];
    filteredOptions: any;
    
  constructor(public ngxservice:ngxService, public learnutils: leranersutils,private api: RequestApiService,private http: HttpClient, public formBuilder: FormBuilder, private datepipe:DatePipe,private cdref:ChangeDetectorRef,public common:CommonService,private _database: ChecklistDatabase,private utils:Utils,public incidentService:IncidentService,private router:Router,private requestapi:RequestApiService, private ngxService: NgxUiLoaderService){
  
      this.treeFlattener = new MatTreeFlattener(
        this.transformer,
        this.getLevel,
        this.isExpandable,
        this.getChildren
      );
      this.treeControl = new FlatTreeControl<FoodFlatNode>(
        this.getLevel,
        this.isExpandable
      );
      this.dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
      );
  
      _database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
      });
  }
  fromMinDate:any;
  toMinDate:any;
  fromMaxDate:any;
  toMaxDate:any;
  public bsConfigFromDate:any;
  public bsConfigToDate:any;
  public selectedAllstatus:any
  loginEmployeeRoleCode:any;
  loginEmployeeCountry:any;
  public allStatusData = [{id:1,name:'Draft'},{id:2,name:'Open'},{id:3,name:'Closed'},{id:4,name:'Minor Incident'}]
  loginEmployeeId:any;
  retectedRuleData:any;
  isCreateBtnHidden = true;
  public currentPageNo = 0;
  public currentPageSize = 100;
  public isStopScroll:boolean = false;
  public username:any;
    public isIncharge:boolean = false;
  public incidentSubscription:any;
  public incidentAccess:any;
   isAllSelected:any = false;
   public incidentCountData:any = {draftIncidentCount:0,
  openIncidentCount:0,};
  public totalRegionCount = 0;
  loginMainRoleCode:any;
  searchFilter: any = [{id: 101, name: 'Incident ID/ CSD no./Article ID'}, {id: 102, name: 'Key word 1/ Key word 2' }, {id: 103, name: 'Country/Region'}];
  filterBy: any = 101;
  findCasetooltipmsg:any;
  form!: FormGroup;
  checkboxdata:any = [];
  expoertcheckBoxdata:any = [];
  ddLsitdata:any = [];
  searchByDatelist: any = [{ name: 'Date of Joining', key: 'dateOfJoining'}];
  dateBy: any = 'dateOfJoining';
  dropdownSelect:any = 'filter1'
  dropdownValue1: any = [];
  keyword1Array:any = [];
  ddLsitdatasearchby:any [];
  myModelDatepicker:any;
  // https://github.com/evansmwendwa/ng2-daterangepicker#readme
  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;
  ngOnInit():void{
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.loginEmployeeId = userDetails.employeeId;
    this.loginEmployeeCountry = userDetails.country;
    this.loginEmployeeRoleCode = userDetails.incidentRole;
    this.loginMainRoleCode = userDetails.roleCode;
    this.isIncharge = userDetails.incharge;
    if(this.loginEmployeeRoleCode == 'PC'){
      this.findCasetooltipmsg = 'Search by Incident ID/ CSD no./ Article ID/ Key Word 1 & 2 (If applicable)'; 
      this.checkboxdata = ['Product Report'] 
    }
    else{
     this.findCasetooltipmsg = "Search by Incident ID/ CSD no./ Article ID";
     this.checkboxdata = ['Product Report', 'Incident Report']
    }
    this.getIncidentDDlist();
    this.setInitialFromToDate();
    this.getRetectedRoleMapInfo();
    this.getotherinfodropDown1();
    this.getIncidentsearchByDD();
    setTimeout(() => {
    this.getIncidentList();
    }, 500);
    this.setDataSource();
  
    this.getIncidentCount();
    this.cdref.detectChanges();
    if(this.incidentService.compareIncidentSubscript!=undefined){
      this.incidentService.compareIncidentSubscript.unsubscribe();  
    }
  
    // this.filterDateOption.autoUpdateInput = false;  
  
  } 
  ngAfterViewInit() {
    // setTimeout(() => {
    //   let headerHeight = document.getElementById("headerForm")?.offsetHeight;    
    //   document.getElementById("listview").style.height = 'calc(100vh - ' + (headerHeight + 45) + 'px)';
      
    // }, 500);
   
    }
  get f() { 
    return this.form.controls; }
  
    async getotherinfodropDown1() {
      let response: any = await this.requestapi.getData(this.utils.API.GET_OTHERINFO_DROPDOWN1 + '?userName=' + this.username);
      if (response) {
        this.dropdownValue1 = response.payLoad;
      }
      else {
        this.dropdownValue1 = [];
      }
    }
  incidentTypeClick(e:any,data:any){
    this.isList = false;
    this.incidentSelectedTypeData = data;
    let incidentCreateData ={isAdd:true,idIncident:0,incidentSelectedTypeData:this.incidentSelectedTypeData,incidentRowData:{}};
    this.incidentService.subject$.next(incidentCreateData);
    this.router.navigate(['incident-create']);
  }
  async getIncidentDDlist(){
    let response:any=await this.requestapi.getData(this.utils.API.GET_INCIDENT_LISTDD_VALUES+'?userName='+this.username+'&roleName='+this.loginEmployeeRoleCode+'&country='+this.loginEmployeeCountry+'&dropdownName=status_dropdown');
    if(response){
     let dropdownOptions = JSON.parse(response.payLoad.dropdownOptions)
     this.ddLsitdata = dropdownOptions;
     this.filterParam ={findCase:'',countryRegion:'',fromDate:'',toDate:'',status:this.ddLsitdata[0].name,storeId:'', searchby : '1'};
    }
  }
  async getIncidentsearchByDD(){
    let response:any=await this.requestapi.getData(this.utils.API.GET_INCIDENT_LISTDD_VALUES+'?userName='+this.username+'&roleName='+this.loginEmployeeRoleCode+'&country='+this.loginEmployeeCountry+'&dropdownName=searchby_dropdown');
    if(response){
     let dropdownOptions = JSON.parse(response.payLoad.dropdownOptions)
     this.ddLsitdatasearchby = dropdownOptions;
    }
  }
  async getIncidentList(){
    this.currentPageNo = 0;
    let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_LIST+'?userName='+this.username+'&pageNo='+this.currentPageNo+'&pageSize='+this.currentPageSize+'&sortBy=created_on');
    if(response){
      this.incidentDataList = response.payLoad;
    this.tableData.colums=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE.map(name=>name.indexName);
    this.tableData.data=this.incidentDataList;
    this.tableData.showColumn=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE;
    this.isShowTable = true;
    this.ngxService.stop();
    // this.getIncidentViewLockInfo();
    }else{
      this.isShowTable = true;
      this.tableData.colums=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE.map(name=>name.indexName);
      this.tableData.showColumn=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE;
      this.tableData.data = []
      this.ngxService.stop();
    }
  }
  async getDataByFindCaseChange(e:any){
    this.myModelDatepicker = null;
    this.picker.datePicker.setStartDate(new Date());
    this.picker.datePicker.setEndDate(new Date());
      this.filterParam.fromDate= '';
      this.filterParam.toDate= '';
      this.filterParam.status= this.ddLsitdata[0].name;
      this.filterParam.storeId='';
      this.filterParam.searchby = '1';
      this.drop1changeValue = '';
      this.keyword1Array = [];
      this.selectedOptionsnew = [];
      this.clearCuntryRegion();
     this.getFilterData();
  }
  fromDateChange(e:any){
    // this.filterParam.findCase='';
      // this.filterParam.fromDate= '';
      // this.filterParam.toDate= '';
  
   this.filterParam.fromDate=e;
     this.toMinDate=this.datepipe.transform(this.filterParam.fromDate,'yyyy-MM-dd');
    //  if(this.filterParam.toDate!='' && this.filterParam.fromDate>this.filterParam.toDate){
    //   this.filterParam.toDate="";
    //  }
    this.toMinDate = new Date(this.toMinDate);
      this.toMinDate.setDate(this.toMinDate.getDate());
     if(this.filterParam.fromDate!=undefined && this.filterParam.fromDate!='' && this.filterParam.toDate!='' && this.filterParam.fromDate!=null && this.filterParam.toDate!=null){
      this.filterParam.status= this.ddLsitdata[0].name;
      this.filterParam.findCase='';
       this.filterParam.storeId='';
       this.selectedOptionsnew = [];
      this.clearCuntryRegion();
      this.getFilterData();
     }
  
  }
  toDateChange(e:any){
     // this.filterParam.findCase='';
      // this.filterParam.fromDate= '';
      // this.filterParam.toDate= '';
  
    this.filterParam.toDate = e;
    if(this.filterParam.fromDate!=undefined && this.filterParam.fromDate!='' && this.filterParam.toDate!='' && this.filterParam.fromDate!='' && this.filterParam.toDate!='' && this.filterParam.toDate!=undefined){
      this.filterParam.status= this.ddLsitdata[0].name;
      this.filterParam.findCase='';
       this.filterParam.storeId='';
       this.selectedOptionsnew = [];
      this.clearCuntryRegion();
      this.getFilterData();
     }
  }
  async getFilterData(){
    let countryRegion = this.checklistSelection.selected;
    // let selectedCountry = this.checklistSelection.selected.filter(function(item:any){
    //    return item.countryId>0
    // });
   let selectedCountry=Array.from(new Set(this.checklistSelection.selected.filter(function(item:any){
    return item.countryId>0;
    }).map((cntry:any)=>cntry.countryId))).map(cntry=>{
    return {countryId:cntry,regionId:''}
    });
    let selectedRegionData = this.checklistSelection.selected.filter(function(item:any){
      return item.level==1
    }).map(item=>item.id);
    for (var i = 0; i < selectedCountry.length; ++i) {
      let countryId = selectedCountry[i].countryId;
      selectedCountry[i].countryId=countryId.toString();
     let regionid= this.checklistSelection.selected.filter(function(item:any){
        return item.countryId==countryId;
      }).map(item=>item.id).toString();
     selectedCountry[i].regionId=regionid;
    }
      let todate = '';
     if(this.filterParam.fromDate=='' && this.filterParam.toDate!=''){
        todate='';
     }else {
        todate=this.filterParam.toDate;
     }
    if(this.filterParam.findCase!='' || (this.filterParam.fromDate!='' && this.filterParam.fromDate!=null && this.filterParam.fromDate!=undefined) && (todate!='' || todate!=null || todate!=undefined) || selectedCountry.length > 0 || this.selectedOptionsnew.length > 0  ||
      this.filterParam.storeId!='' || this.keyword1Array.length > 0){      
  let fromdate=this.filterParam.fromDate;
   let todatefinal=this.filterParam.toDate;
  let incidentDate = "";
    let incidentReportedDate = "";
    let incidentCreatedDate = ""
   if(fromdate!='' && fromdate!=null && todatefinal!='' && todatefinal!=null){
      if(this.filterParam.searchby=='1'){
         incidentDate = 'yes';
      }else if(this.filterParam.searchby=='2'){
         incidentReportedDate = 'yes';
      }else if(this.filterParam.searchby=='3'){
        incidentCreatedDate = 'yes';
      }
   }
   this.filterParam.countryRegion = selectedCountry.toString();
   
      let param = {
      "caseId": this.filterParam.findCase.trim(),
      "createdFromDate": (fromdate!='' && fromdate!=null)?fromdate:'',
      "createdToDate":(todatefinal!='' && todatefinal!=null)?todatefinal:'',
      "pageNo":0,
      "pageSize":this.currentPageSize,
      "sortBy":"createdOn",
      "userName":this.username,
      "countryRegions":(selectedRegionData.length>0)?selectedRegionData:[],
      "allStatus":this.selectedOptionsnew,
      // "allStatus":(this.filterParam.status!=this.ddLsitdata[0].name || this.filterParam.status!='all')?[this.filterParam.status]:[],
      "incidentDate":incidentDate,
      "incidentReportedDate":incidentReportedDate,
      "incidentCreatedDate":incidentCreatedDate,
      "keyword1": this.keyword1Array,
      "storeCode":  this.filterParam.storeId,
  };
   
  let combinedParam = {
    ...param,
    ...this.commontableParam
  }
  this.tableData.commonparams = param;
  this.sendmailParam = param;
  combinedParam.pageNo = 0;
  this.ngxService.start();
  this.getIncidentSubFilterCountData(combinedParam);
    let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER,combinedParam);
    if(response){
      this.tableData.data = response.payLoad;
      this.ngxService.stop();
      if(response.payLoad.length == 0){
        this.currentPageNo = 0;
        this.tableData.commonparams.pageNo = 0
      }
    }
  }
  else if(this.commontableParam !== undefined && (this.commontableParam?.incidentStatus.length > 0 || (this.commontableParam?.createdBy.length > 0) || this.commontableParam?.roleBy.length > 0 || this.commontableParam?.incidentType.length > 0 || this.commontableParam?.priority.length > 0 || this.commontableParam?.store.length > 0
  || this.commontableParam?.flagValue.length > 0 || this.commontableParam?.initialList.length > 0 || this.commontableParam?.incidentCauseIds.length > 0 || this.commontableParam?.sortType !== '')){
      let fromdate=this.filterParam.fromDate;
       let todatefinal=this.filterParam.toDate;
      let incidentDate = "";
        let incidentReportedDate = "";
        let incidentCreatedDate = ""
       if(fromdate!='' && fromdate!=null && todatefinal!='' && todatefinal!=null){
          if(this.filterParam.searchby=='1'){
             incidentDate = 'yes';
          }else if(this.filterParam.searchby=='2'){
             incidentReportedDate = 'yes';
          }else if(this.filterParam.searchby=='3'){
            incidentCreatedDate = 'yes';
          }
       }
       this.filterParam.countryRegion = selectedCountry.toString();
      
          let param = {
          "caseId": this.filterParam.findCase.trim(),
          "createdFromDate": (fromdate!='' && fromdate!=null)?fromdate:'',
          "createdToDate":(todatefinal!='' && todatefinal!=null)?todatefinal:'',
          "pageNo":0,
          "pageSize":this.currentPageSize,
          "sortBy":"createdOn",
          "userName":this.username,
          "countryRegions":(selectedRegionData.length>0)?selectedRegionData:[],
          "allStatus":this.selectedOptionsnew,
          // "allStatus":(this.filterParam.status!=this.ddLsitdata[0].name || this.filterParam.status!='all')?[this.filterParam.status]:[],
          "incidentDate":incidentDate,
          "incidentReportedDate":incidentReportedDate,
          "incidentCreatedDate":incidentCreatedDate,
          "keyword1": this.keyword1Array,
          "storeCode":  this.filterParam.storeId,
      };
      
      let combinedParam = {
        ...param,
        ...this.commontableParam
      }

      this.tableData.commonparams = param;
      this.sendmailParam = param;
      combinedParam.pageNo = 0;
      this.ngxService.start();
      this.getIncidentSubFilterCountData(combinedParam);
        let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER,combinedParam);
        if(response){
          this.tableData.data = response.payLoad;
          this.ngxService.stop();
          if(response.payLoad.length == 0){
            this.currentPageNo = 0;
            this.tableData.commonparams.pageNo = 0
          }
        }
  
  }
  else{

    this.ngxService.start();
    this.tableData.commonparams.caseId = '';
    this.tableData.commonparams.allStatus = [];
    this.tableData.commonparams.countryRegions = [];
    this.tableData.commonparams.createdFromDate = '';
    this.tableData.commonparams.createdToDate = '';
    this.tableData.commonparams.keyword1 = [];
    this.tableData.commonparams.pageNo = 0;
    this.tableData.commonparams.pageSize = 100;
    this.tableData.commonparams.storeCode = '';
    this.getIncidentList();
    this.getIncidentCount();
  }
  
  }
    dontCallScrollFilter=false;
  async getFilterDataPageNext(){
     let countryRegion = this.checklistSelection.selected;
    // let selectedCountry = this.checklistSelection.selected.filter(function(item:any){
    //    return item.countryId>0
    // });
   let selectedCountry=Array.from(new Set(this.checklistSelection.selected.filter(function(item:any){
    return item.countryId>0;
    }).map((cntry:any)=>cntry.countryId))).map(cntry=>{
    return {countryId:cntry,regionId:''}
    });
    let selectedRegionData = this.checklistSelection.selected.filter(function(item:any){
      return item.level==1
    }).map(item=>item.id);
    for (var i = 0; i < selectedCountry.length; ++i) {
      let countryId = selectedCountry[i].countryId;
      selectedCountry[i].countryId=countryId.toString();
     let regionid= this.checklistSelection.selected.filter(function(item:any){
        return item.countryId==countryId;
      }).map(item=>item.id).toString();
     selectedCountry[i].regionId=regionid;
    }
      let todate = '';
     if(this.filterParam.fromDate=='' && this.filterParam.toDate!=''){
        todate='';
     }else {
        todate=this.filterParam.toDate;
     }
    if(this.filterParam.findCase!='' || (this.filterParam.fromDate!='' && this.filterParam.fromDate!=null && this.filterParam.fromDate!=undefined) && (todate!='' || todate!=null || todate!=undefined) || selectedCountry.length>0 || this.selectedOptionsnew.length > 0 || this.filterParam.storeId!='' || this.keyword1Array.length > 0
   ){
  // let fromdate=this.datepipe.transform(this.filterParam.fromDate,'yyyy-MM-dd');
  //  let todatefinal=this.datepipe.transform( todate,'yyyy-MM-dd');
   let fromdate=this.filterParam.fromDate;
   let todatefinal=this.filterParam.toDate;
  let incidentDate = "";
    let incidentReportedDate = "";
    let incidentCreatedDate = ""
   if(fromdate!='' && fromdate!=null && todatefinal!='' && todatefinal!=null){
      if(this.filterParam.searchby=='1'){
         incidentDate = 'yes';
      }else if(this.filterParam.searchby=='2'){
         incidentReportedDate = 'yes';
      }else if(this.filterParam.searchby=='3'){
        incidentCreatedDate = 'yes';
      }
   }
   this.currentPageNo = 0;
   this.currentPageNo=this.currentPageNo == 0? this.currentPageNo + 100 : this.currentPageNo + 100;
  
      let param = {
      "storeCode":  this.filterParam.storeId,
      "caseId": this.filterParam.findCase.trim(),
      "createdFromDate": (fromdate!='' && fromdate!=null)?fromdate:'',
      "createdToDate":(todatefinal!='' && todatefinal!=null)?todatefinal:'',
      "pageNo":this.currentPageNo,
      "pageSize":this.currentPageSize,
      "sortBy":"createdOn",
      "userName":this.username,
      "countryRegions":(selectedRegionData.length>0)?selectedRegionData:[],
      "allStatus":this.selectedOptionsnew,
      // "allStatus":(this.filterParam.status!=this.ddLsitdata[0].name || this.filterParam.status!='all')?[this.filterParam.status]:[],
      "keyword1": this.keyword1Array,
      "incidentDate":incidentDate,
      "incidentReportedDate":incidentReportedDate,
      "incidentCreatedDate":incidentCreatedDate,
    };  
    let combinedParam = {
      ...param,
      ...this.commontableParam
    }
  this.tableData.commonparams = param;
  this.sendmailParam = param;
  combinedParam.pageNo = this.currentPageNo
  combinedParam.pageSize = this.currentPageSize
  
  //this.ngxService.start();
    let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER,combinedParam);
    if(response){
      let data = response.payLoad;
      if(data.length>0){
        let finaldata=this.tableData.data.concat(data);
                let uniqueData:any = [];
        for(let x of finaldata){
          let isExist=uniqueData.filter(function(item:any){
            return item.id==x.id;
          })
          if(isExist.length==0){
            uniqueData.push(x);
          }
        }
        if(finaldata.length<100){
          this.dontCallScrollFilter = true;
        }
      this.tableData.data = uniqueData;
      }
  
      //this.ngxService.stop();
    }
  }
  else if(this.commontableParam !== undefined && (this.commontableParam?.incidentStatus.length > 0 || (this.commontableParam?.createdBy.length > 0) || this.commontableParam?.roleBy.length > 0 || this.commontableParam?.incidentType.length > 0 || this.commontableParam?.priority.length > 0 || this.commontableParam?.store.length > 0
  || this.commontableParam?.flagValue.length > 0 || this.commontableParam?.initialList.length > 0 || this.commontableParam?.incidentCauseIds.length > 0 || this.commontableParam?.sortType !== '')){
   // let fromdate=this.datepipe.transform(this.filterParam.fromDate,'yyyy-MM-dd');
  //  let todatefinal=this.datepipe.transform( todate,'yyyy-MM-dd');
   let fromdate=this.filterParam.fromDate;
   let todatefinal=this.filterParam.toDate;
  let incidentDate = "";
    let incidentReportedDate = "";
    let incidentCreatedDate = ""
   if(fromdate!='' && fromdate!=null && todatefinal!='' && todatefinal!=null){
      if(this.filterParam.searchby=='1'){
         incidentDate = 'yes';
      }else if(this.filterParam.searchby=='2'){
         incidentReportedDate = 'yes';
      }else if(this.filterParam.searchby=='3'){
        incidentCreatedDate = 'yes';
      }
   }
   this.currentPageNo = 0;
   this.currentPageNo=this.currentPageNo == 0? this.currentPageNo + 100 : this.currentPageNo + 100;
  
      let param = {
      "storeCode":  this.filterParam.storeId,
      "caseId": this.filterParam.findCase.trim(),
      "createdFromDate": (fromdate!='' && fromdate!=null)?fromdate:'',
      "createdToDate":(todatefinal!='' && todatefinal!=null)?todatefinal:'',
      "pageNo":this.currentPageNo,
      "pageSize":this.currentPageSize,
      "sortBy":"createdOn",
      "userName":this.username,
      "countryRegions":(selectedRegionData.length>0)?selectedRegionData:[],
      "allStatus":this.selectedOptionsnew,
      // "allStatus":(this.filterParam.status!=this.ddLsitdata[0].name || this.filterParam.status!='all')?[this.filterParam.status]:[],
      "keyword1": this.keyword1Array,
      "incidentDate":incidentDate,
      "incidentReportedDate":incidentReportedDate,
      "incidentCreatedDate":incidentCreatedDate,
    };  
    let combinedParam = {
      ...param,
      ...this.commontableParam
    }
  this.tableData.commonparams = param;
  this.sendmailParam = param;
  combinedParam.pageNo = this.currentPageNo
  combinedParam.pageSize = this.currentPageSize
  
  //this.ngxService.start();
    let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LIST_FILTER,combinedParam);
    if(response){
      let data = response.payLoad;
      if(data.length>0){
        let finaldata=this.tableData.data.concat(data);
                let uniqueData:any = [];
        for(let x of finaldata){
          let isExist=uniqueData.filter(function(item:any){
            return item.id==x.id;
          })
          if(isExist.length==0){
            uniqueData.push(x);
          }
        }
        if(finaldata.length<100){
          this.dontCallScrollFilter = true;
        }
      this.tableData.data = uniqueData;
      }
  
      //this.ngxService.stop();
    }
  
  }
  else{
    this.ngxService.start();
    this.tableData.commonparams.caseId = '';
    this.tableData.commonparams.allStatus = [];
    this.tableData.commonparams.countryRegions = [];
    this.tableData.commonparams.createdFromDate = '';
    this.tableData.commonparams.createdToDate = '';
    this.tableData.commonparams.keyword1 = [];
    this.tableData.commonparams.storeCode = '';
    this.getIncidentList();
    this.getIncidentCount();
  }
  }
 
  clearFilter(){
    this.ngxService.start();
    this.tableData.commonparams.caseId = '';
    this.tableData.commonparams.allStatus = [];
    this.tableData.commonparams.countryRegions = [];
    this.tableData.commonparams.createdFromDate = '';
    this.tableData.commonparams.createdToDate = '';
    this.tableData.commonparams.keyword1 = [];
    this.tableData.commonparams.pageNo = 0;
    this.tableData.commonparams.pageSize = 100;
    this.tableData.commonparams.storeCode = '';
    this.picker.datePicker.setStartDate(new Date());
    this.picker.datePicker.setEndDate(new Date());
        this.filterParam ={findCase:'',countryRegion:'',fromDate:'',toDate:'',status:this.ddLsitdata[0].name,storeId:'',searchby : '1'};
       this.isAllSelected = false;
       this.drop1changeValue = '';
       this.dropdownSelect = 'filter1';
       this.myModelDatepicker = null;
       this.keyword1Array = [];
       this.selectedOptionsnew = [];
       this.statusappliedText = '';
       this.clearCuntryRegion();
       if(this.commontableParam == undefined){
        this.getIncidentList();
        this.getIncidentCount();
       }
       else if(this.commontableParam.incidentStatus.length > 0 || this.commontableParam.createdBy.length > 0 || this.commontableParam.roleBy.length > 0 || this.commontableParam.incidentType.length > 0 || this.commontableParam.priority.length > 0 || this.commontableParam.store.length > 0
           || this.commontableParam.flagValue.length > 0 || this.commontableParam.initialList.length > 0 || this.commontableParam.incidentCauseIds.length > 0 || this.commontableParam.sortType !== ''){
            this.currentPageNo = 0;
            console.log("THISM FUNCTION Containe")
            this.getFilterData();
           }
           else{
            this.sendmailParam = undefined;
            this.getIncidentList();
            this.getIncidentCount();
           }
  }
  clearCuntryRegion(){
     this.isAllSelected = false;
      this.filterAppliadText='';
        for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
           this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
           const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[i]);
  this.checklistSelection.deselect(...descendants)
  
      }
  }
  getTableListEvent(data:any){
    if(data.type==1){
      if(this.tableData.commonparams?.caseId !== '' || this.tableData.commonparams?.createdFromDate !== '' || this.tableData.commonparams?.createdToDate !== '' || this.tableData.commonparams?.countryRegions.length > 0 || 
      this.tableData.commonparams?.allStatus.length > 0 || this.tableData.commonparams?.storeCode !== '' || this.tableData.commonparams?.keyword1.length > 0 ){
        this.commontableParam = data.param;
        this.commontableParam.pageNo = 0;
        this.getFilterData();
        // this.getIncidentCount();
      }
      else{
        this.getIncidentList();
        this.getIncidentCount();
        this.sendmailParam = undefined;
      }
    }else if(data.type==2){
      if(this.incidentService.isIncidentWriteAccess() || this.incidentService.isIncidentViewAccess()){
          let currentIncident = localStorage.getItem("currentIncident");
      if (
        currentIncident != "" &&
        currentIncident != null &&
        currentIncident != undefined &&
        currentIncident != "undefined"
      ) {
        localStorage.removeItem("currentIncident");
      }
           let incidentTypeName = data.data.incidentType;
        let incidentId = data.data.incidentId;
        let id = data.data.id;
        let currentIncidentTypeData = this.incidentTypeData.filter(function(item:any){
        return item.name.toLowerCase()==incidentTypeName;
        })[0];
        let incidentCreateData ={isAdd:false,idIncident:data.data.incidentId,id:id,incidentSelectedTypeData:currentIncidentTypeData,incidentRowData:data.data};
        this.incidentService.subject$.next(incidentCreateData);
        if(data.data.incidentStatus!='Draft'){
          this.common.showLoader=true;
        //this.lockIncident(id);
        // this.updateIncidentViewStatus(id);
         this.router.navigate(['incident-create']);
        }else{
        this.router.navigate(['incident-create']);
        }
      }else{
        this.common.openSnackBar("Invalid access",2,"Unauthorized")
      }
       
  
    }else if(data.type==3){
      this.currentPageNo=this.currentPageNo == 0? this.currentPageNo + 100 : this.currentPageNo + 100;
      this.currentPageSize=100;
        if(this.filterParam.findCase!='' || this.filterParam.countryRegion!='' || (this.filterParam.fromDate!='' && this.filterParam.fromDate!=undefined) || (this.filterParam.toDate!='' && this.filterParam.toDate!=undefined) || this.selectedOptionsnew.length > 0 || this.filterParam.storeId!='' || this.keyword1Array.length > 0){
          if(this.dontCallScrollFilter==false){
               this.getFilterDataPageNext();
          }
  
  
        }else{
           if(this.dontCallScrollFilter==false){
               this.getNextPageIncidentList();
           }
  
        }
       }else if(data.type==4){
        // this.filterParam.fromDate='';
        // this.filterParam.toDate='';
        // this.filterParam.findCase='';
        // this.filterParam.status=this.ddLsitdata[0].name;
        // this.filterParam.storeId='';
        // this.filterParam.searchby = '1';
        // this.drop1changeValue = '';
        // this.dropdownSelect = 'filter1';
        // this.myModelDatepicker = null;
        // this.keyword1Array = [];
        // this.clearCuntryRegion();
        //  this.sendmailParam = data.param;
        this.commontableParam = data.param;
       }else if(data.type==5){
  //this.closeAllPanels();
       }
  
  }
  sendmailParam:any;
  commontableParam:any
  async updateIncidentViewStatus(incidentId:any){
    let param ={'incidentId':incidentId.toString(),'userName':this.username}
     let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_UPDATE_VIEWED_STATUS,param);
  
    if(response){
     // this.tableData.data = response.payLoad;
    }
  }
  async lockIncident(incidentId:any){
    let param ={
      "incidentId":incidentId,
      "lockedUserId":this.username,
      "pageName":"update",
      "userName":this.username
  }
  
     let response:any=await this.requestapi.postData(this.utils.API.INCIDENT_LOCK,param);
  
    if(response){
     // this.tableData.data = response.payLoad;
     if(response.payLoad.lockedStatus==true){
       this.common.openSnackBar("This Incident was editing by "+response.payLoad.lockedUser,2,'');
     }else{
       this.router.navigate(['incident-create']);
     }
    }
  }
  
  setDataSource(){
     this.treeFlattener = new MatTreeFlattener(
        this.transformer,
        this.getLevel,
        this.isExpandable,
        this.getChildren
      );
      this.treeControl = new FlatTreeControl<FoodFlatNode>(
        this.getLevel,
        this.isExpandable
      );
      this.dataSource = new MatTreeFlatDataSource(
        this.treeControl,
        this.treeFlattener
      );
  
      this._database.dataChange.subscribe((data:any) => {
        this.dataSource.data = data;
       for(let x of data){
         this.totalRegionCount=this.totalRegionCount+(x.children.length);
  
       }
      });
  }
  
  
  getLevel = (node: FoodFlatNode) => node.level;
  
    isExpandable = (node: FoodFlatNode) => node.expandable;
  
    getChildren = (node: FoodNode): any => node.children;
  
    hasChild = (_: number, _nodeData: FoodFlatNode) => _nodeData.expandable;
  
    hasNoContent = (_: number, _nodeData: FoodFlatNode) => _nodeData.item === "";
  
    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: FoodNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode =
        existingNode && existingNode.item === node.item
          ? existingNode
          : new FoodFlatNode();
      flatNode.item = node.item;
      flatNode.level = level;
      flatNode.id = node.id;
      flatNode.name = node.name;
       flatNode.countryId = node.countryId;
      flatNode.expandable = !!node.children;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    };
  
    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: FoodFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      return descAllSelected;
    }
  
    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: FoodFlatNode): boolean {
      const descendants = this.treeControl.getDescendants(node);
      const result = descendants.some(child =>
        this.checklistSelection.isSelected(child)
      );
      return result && !this.descendantsAllSelected(node);
    }
  
    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: FoodFlatNode): void {
      this.checklistSelection.toggle(node);
      const descendants = this.treeControl.getDescendants(node);
      this.checklistSelection.isSelected(node)
        ? this.checklistSelection.select(...descendants)
        : this.checklistSelection.deselect(...descendants);
  
      // Force update for the parent
      descendants.every(child => this.checklistSelection.isSelected(child));
      this.checkAllParentsSelection(node);
  
    }
  
    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: FoodFlatNode): void {
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
    }
  
    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: FoodFlatNode): void {
      let parent: FoodFlatNode | null = this.getParentNode(node);
      while (parent) {
        this.checkRootNodeSelection(parent);
        parent = this.getParentNode(parent);
      }
    }
  
    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: FoodFlatNode): void {
      const nodeSelected = this.checklistSelection.isSelected(node);
      const descendants = this.treeControl.getDescendants(node);
      const descAllSelected = descendants.every(child =>
        this.checklistSelection.isSelected(child)
      );
      if (nodeSelected && !descAllSelected) {
        this.checklistSelection.deselect(node);
      } else if (!nodeSelected && descAllSelected) {
        this.checklistSelection.select(node);
      }
      this.isAllSelected = (this.checklistSelection.selected.length<this.dataSource.data.length)?false:this.isAllSelected;
    }
  
    /* Get the parent node of a node */
    getParentNode(node: FoodFlatNode): FoodFlatNode | null {
      this.keyword1Array = [];
      // this.selectedOptionsnew = [];
      this.drop1changeValue = '';
      const currentLevel = this.getLevel(node);
      this.getFilterData();
  if(this.checklistSelection.selected.length>0){
    this.filterAppliadText="Filter Applied";
    this.filterParam.findCase = '';
    // this.filterParam.fromDate = '';
    // this.filterParam.toDate = '';
  //   this.filterParam.status = this.ddLsitdata[0].name;
  //   this.filterParam.storeId = '';
  //   this.filterParam.searchby = '1';
  //  this.myModelDatepicker = null;
  //  this.picker.datePicker.setStartDate(new Date());
  //  this.picker.datePicker.setEndDate(new Date());
   this.keyword1Array = [];
  //  this.selectedOptionsnew = [];
   this.drop1changeValue = '';
  }else{
    this.filterAppliadText="";
    // this.myModelDatepicker = null;
    this.keyword1Array = [];
    // this.selectedOptionsnew = [];
    this.drop1changeValue = '';
    this.filterParam.countryRegion = ''
  }
  let selectedCountryCount=this.checklistSelection.selected.filter(function(item:any){
    return item.level==0;
  })
  if(selectedCountryCount.length==this.dataSource.data.length){
    this.isAllSelected=true;
  }else{
    this.isAllSelected=false;
  }
      if (currentLevel < 1) {
        return null;
      }
  
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
  
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
  
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
  
      return null;
    }
  
    getSelectedItems(): string {
      if (!this.checklistSelection.selected.length) return '';
      return this.checklistSelection.selected.map(s => s.item).join(",");
    }
  
    filterChanged(e: any) {
     let filterText= e.target.value
  
      // ChecklistDatabase.filter method which actually filters the tree and gives back a tree structure
      this._database.filter(filterText);
      if (filterText) {
        this.treeControl.expandAll();
      } else {
        this.treeControl.collapseAll();
      }
    }
   
  allSelecteChange(e:any){
    if(e.checked){
      this.isAllSelected = true;
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if(!this.checklistSelection.isSelected(this.treeControl.dataNodes[i]))
          this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i])
      }
    this.filterAppliadText='Filter Applied';
    this.filterParam.findCase = '';
    // this.filterParam.fromDate = '';
    // this.filterParam.toDate = '';
    // this.filterParam.status = this.ddLsitdata[0].name;
    // this.filterParam.storeId = '';
    // this.filterParam.searchby = '1';
  // this.filterParam ={findCase:'',countryRegion:this.filterParam.countryRegion,fromDate:'',toDate:'',status:this.ddLsitdata[0].name,storeId:'', searchby : '1'};
  // this.myModelDatepicker = null; 
  // this.picker.datePicker.setStartDate(new Date());
  // this.picker.datePicker.setEndDate(new Date());
  this.keyword1Array = [];
  // this.selectedOptionsnew = [];
  this.getFilterData();
    }else{
        this.isAllSelected = false;
       this.filterAppliadText='';
       this.filterParam.findCase = ''
      //  this.filterParam ={findCase:'',countryRegion:'',fromDate:'',toDate:'',status:this.ddLsitdata[0].name,storeId:'', searchby : '1'};    
       for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        // this.myModelDatepicker = null; 
        // this.picker.datePicker.setStartDate(new Date());
        // this.picker.datePicker.setEndDate(new Date());
        this.keyword1Array = [];
        // this.selectedOptionsnew = [];
        this.drop1changeValue = '';
  
        this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
           const descendants = this.treeControl.getDescendants(this.treeControl.dataNodes[i]);
  this.checklistSelection.deselect(...descendants)
  
      }
    }
    this.filterParam.findCase = '';
    this.filterParam.countryRegion = '';
  // this.filterParam ={findCase:'',countryRegion:'',fromDate:'',toDate:'',status:this.ddLsitdata[0].name,storeId:'',searchby : '1'};
  // this.myModelDatepicker = null;  
  // this.picker.datePicker.setStartDate(new Date());
  // this.picker.datePicker.setEndDate(new Date());
  this.keyword1Array = [];
  // this.selectedOptionsnew = [];
  if((this.selectedOptionsnew.length == 0 && this.filterParam.fromDate== '' &&  this.filterParam.toDate== '' && this.filterParam.storeId =='' && this.keyword1Array.length == 0) && (this.commontableParam == undefined)){
    
    this.ngxService.start();
       this.getIncidentList();
       this.getIncidentCount();
  }else{
     this.getFilterData();
  }
      // this.getIncidentList();
      // this.getIncidentCount();
  }
  statusSelectionChange(e:any){
     this.filterParam.fromDate= '';
      this.filterParam.toDate= '';
        this.filterParam.storeId='';
        this.filterParam.searchby = '1';
        this.drop1changeValue = '';
       this.dropdownSelect = 'filter1';
       this.myModelDatepicker = null;
       this.picker.datePicker.setStartDate(new Date());
       this.picker.datePicker.setEndDate(new Date());
       this.myModelDatepicker = '';
       this.keyword1Array = [];
       this.drop1changeValue = '';

        this.clearCuntryRegion();
    let selectedValue =e.srcElement.value;
    if((selectedValue==('all')) && (this.commontableParam == undefined)){
    
      this.ngxService.start();
      this.tableData.commonparams.allStatus = [];
         this.getIncidentList();
         this.getIncidentCount();
    }else{
       this.getFilterData();
    }
  }
  selectedOptions: string[] = [];

  selectionChange(event: any) {
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
  
     bottomReached(): boolean {
      return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
    }
    async getNextPageIncidentList(){
        let response:any=await this.requestapi.getData(this.utils.API.INCIDENT_LIST+'?userName='+this.username+'&pageNo='+this.currentPageNo+'&pageSize='+this.currentPageSize+'&sortBy=created_on');
    if(response){
     let incidentDataList = response.payLoad;
     if(incidentDataList.length>0){
             let finallist:any = this.incidentDataList.concat(incidentDataList);
           let uniqueData:any = [];
        for(let x of finallist){
          let isExist=uniqueData.filter(function(item:any){
            return item.id==x.id;
          })
          if(isExist.length==0){
            uniqueData.push(x);
          }
        }
        this.incidentDataList = uniqueData;
        this.tableData.data=this.incidentDataList;
        this.isStopScroll = false;
  
  
     }else{
       this.isStopScroll = true;
     }
  
    // this.tableData.showColumn=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE;
    // this.isShowTable = true;
    // this.ngxService.stop();
    }else{
      // this.isShowTable = true;
      // this.tableData.colums=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE.map(name=>name.indexName);
      // this.tableData.showColumn=this.utils.TABLE_HEADERS.INCIDENT_LIST_TABLE;
      // this.tableData.data = []
      // this.ngxService.stop();
    }
    }
  
   getDataByStoreIdChange(e:any){
      this.filterParam.findCase = '';
      // this.filterParam.fromDate= '';
      // this.filterParam.toDate= '';
      // this.filterParam.status= this.ddLsitdata[0].name;
      // this.filterParam.searchby = '1';
      // this.drop1changeValue = '';
      //  this.dropdownSelect = 'filter1'
      //  this.myModelDatepicker = null;
      //  this.picker.datePicker.setStartDate(new Date());
      //  this.picker.datePicker.setEndDate(new Date());
      //  this.selectedOptionsnew = [];
      //  this.keyword1Array = [];
      // this.clearCuntryRegion();
        this.getFilterData();
  
    }
    isStoreFilterShow(){
      let isShow = false;
      if(this.loginEmployeeRoleCode=='CS' || this.loginEmployeeRoleCode=='Privacy' || this.loginEmployeeRoleCode=='HR' || this.loginEmployeeRoleCode=='Insurance' || this.isIncharge){
        isShow = true;
      }
      return isShow;
    }
    async releaseIncidentLock(incidentId:any){
     //let incidentId= (this.incidentEditData && this.incidentEditData.incidentStatus!='Draft')?this.incidentEditData.id:this.incidentData.id;
  
      if(incidentId>0){
         let param = {"incidentId":incidentId,"userName":this.loginEmployeeId};
       let response: any = await this.requestapi.postData(this.utils.API.RELEASE_INCIDENT_LOCK,param);
  
      }
  
    }
    async getIncidentCount(){
      
      let response: any = await this.requestapi.getData(this.utils.API.GET_INCIDENT_COUNT+'?userName='+this.username);
        if(response){
         this.incidentCountData = response.payLoad;
        }
    }
  
    setInitialFromToDate(){
      let currentDate = new Date();
      let year = currentDate.getFullYear();
      var dd = (currentDate.getDate()).toString();
      var mm = (currentDate.getMonth() + 1).toString(); //January is 0!
      var yyyy = currentDate.getFullYear();
      if (parseInt(dd) < 10) {
      dd = '0' + dd;
      }
      if (parseInt(mm) < 10) {
      mm = '0' + mm;
      }
      let today = yyyy + '-' + mm + '-' + dd;
      this.maxDate = today;
      this.fromMinDate = (yyyy-20)+ '-' + mm + '-' + dd;
      this.toMinDate = (yyyy-20)+ '-' + mm + '-' + dd;
      this.fromMaxDate=today;
      this.toMaxDate=today;
      // this.fromMaxDate={year: yyyy, month: mm, day: dd}
      this.fromMaxDate = new Date();
      this.fromMaxDate.setDate(this.fromMaxDate.getDate());
      this.fromMinDate = new Date(this.fromMinDate);
      this.fromMinDate.setDate(this.fromMinDate.getDate());
  
      this.toMaxDate= new Date(this.toMaxDate);
      this.toMaxDate.setDate(this.toMaxDate.getDate());
  
      this.toMinDate= new Date(this.toMinDate);
      this.toMinDate.setDate(this.toMinDate.getDate());
    }
   async getIncidentSubFilterCountData(param:any){
     let response:any = await this.requestapi.postData(this.utils.API.GET_INCIDENT_SUB_FILTER_COUNT,param);
      if(response){
         this.incidentCountData = response.payLoad;
      }
   }
   incidentLockViewInfoData:any = [];
   async getIncidentViewLockInfo(){
     let response:any = await this.requestapi.getData(this.utils.API.GET_INCIDENT_VIEW_LOCK_INFO+'?userName='+this.username+'&pageNo='+this.currentPageNo+'&pageSize='+this.currentPageSize+'&sortBy=created_on');
      if(response){
         this.incidentLockViewInfoData = response.payLoad;
         for(let x of this.incidentDataList){
              let isExist=this.incidentLockViewInfoData.filter((item:any)=>{
                return item.id==x.id;
              });
              if(isExist.length>0){
                x.isViewed=isExist[0].isViewed;
                x.isIncidentLocked=isExist[0].isIncidentLocked;
                x.lockedUserName=isExist[0].lockedUserName;
                x.flagValue = isExist[0].flagValue
              }
  
         }
      }
   }
   searchByChange(e:any){
     let val = e.srcElement.value;
     if(val!='' && val!=null && (this.filterParam.fromDate!='' && this.filterParam.fromDate!=null && this.filterParam.fromDate!=undefined ) && (this.filterParam.toDate!='' && this.filterParam.toDate!=null && this.filterParam.toDate!=undefined)){
       this.getFilterData();
     }
   
   }
   searchByChangedropdown(event:any){
    // this.filterParam.findCase = '';
    // this.filterParam.countryRegion = '';
    // this.drop1changeValue = '';
    // this.clearCuntryRegion();
    this.dropdownSelect = event.srcElement.value;
   }
   mailId = "";
   Emails = [];
   getMail(e: any) {
    if (this.form.valid) {
       this.mailId = e.target.value;
  }
  }
  @ViewChildren('chkboxes') chkboxes: QueryList<any>; // Define this at the top
  
  sendMail() {
    // let param:any;
    // param = {
    //   "emailIds": this.Emails,
    //   "exportOption": this.checkedValues,
    //   "username": this.username
    // }
  
    // let Token = localStorage.getItem("authenticationToken")
    // this.http.post(this.utils.API.GET_EXPORT_INCIDENT_DOWNLOAD_STATUS, param,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
    //  if(res){
    //   if(res.payLoad.status == "Success"){
    //   this.common.openSnackBar("Generating the report. Will send to the mail shortly." , 2, '');
    //  }
    // }
    // });
    
     let singleparam:any;
     singleparam = {
      "emailIds": this.Emails,
      "exportOption": this.checkedValues,
      "username": this.username
    }
  
   let fullparam = {
    "emailIds": this.Emails,
    "exportOption": this.checkedValues,
    ... this.commontableParam,
    ...this.sendmailParam // Include properties from this.sendmailParam
  };

  if(((this.sendmailParam?.allStatus !== undefined && this.sendmailParam?.allStatus.length > 0) ||
    (this.sendmailParam?.caseId !== undefined && this.sendmailParam?.caseId !== '') ||
    (this.sendmailParam?.countryRegions !== undefined && this.sendmailParam?.countryRegions.length > 0) ||
   (this.sendmailParam?.createdFromDate !== undefined && this.sendmailParam?.createdFromDate !== '') ||
   (this.sendmailParam?.createdToDate !== undefined && this.sendmailParam?.createdToDate !== '') ||
   (this.sendmailParam?.keyword1 !== undefined && this.sendmailParam?.keyword1.length > 0) ||
   (this.sendmailParam?.storeCode !== undefined && this.sendmailParam?.storeCode !== '') ||
   (this.commontableParam?.sortType !== undefined && this.commontableParam?.sortType !== '') ||
   (this.commontableParam?.incidentType !== undefined && this.commontableParam?.incidentType.length > 0) ||
   (this.commontableParam?.priority !== undefined && this.commontableParam?.priority.length > 0) ||
   (this.commontableParam?.incidentStatus !== undefined && this.commontableParam?.incidentStatus.length > 0) ||
   (this.commontableParam?.initialList !== undefined && this.commontableParam?.initialList.length > 0) ||
   (this.commontableParam?.incidentCauseIds !== undefined && this.commontableParam?.incidentCauseIds.length > 0) ||
   (this.commontableParam?.store !== undefined && this.commontableParam?.store.length > 0) ||
   (this.commontableParam?.flagValue !== undefined && this.commontableParam?.flagValue.length > 0)
   ) ){
    let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.GET_EXPORT_INCIDENT_DOWNLOAD_STATUS_WITH_FILTER, fullparam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
      if(res){
       if(res.payLoad.status == "Success"){
       this.common.openSnackBar("Generating the report. Will send to the mail shortly." , 2, '');
      }
     }
     });
   }
   else{
   let Token = localStorage.getItem("authenticationToken")
    this.http.post(this.utils.API.GET_EXPORT_INCIDENT_DOWNLOAD_STATUS, singleparam,{headers:{Authorization: 'Bearer '+Token }}).subscribe((res: any) => {
     if(res){
      if(res.payLoad.status == "Success"){
      this.common.openSnackBar("Generating the report. Will send to the mail shortly." , 2, '');
     }
    }
    });
   }
    
    this.Emails = []; 
    this.checkedValues = []
    if(this.loginEmployeeRoleCode !== 'PC'){
    this.chkboxes.forEach(x => x.checked = false);
    }
    this.mailId = '';
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
     }
    
    }
    this.cdref.detectChanges();
  }
  
  removeEmail(m: any) {
    let temp = this.Emails.splice(m, 1);
  }
  
  cancelMail() {
    this.mailId = '';
    this.Emails = [];
    this.checkedValues = []
  }
  checkedValues: string[] = [];
    onCheckboxChange(value: string, event:any) {
      if(value == this.checkboxdata[1]){
        value = 'all'
      }
      else if(value == this.checkboxdata[0]){
        value = 'product'
      }
      value = value.toLowerCase();
       const index = this.checkedValues.indexOf(value);
      if (event.checked) {
          this.checkedValues.push(value);
      } else {
        this.checkedValues.splice(index, 1);
      }
    }
   exportpopup(){
    this.Emails = []; 
    this.checkedValues = [];
    if(this.loginEmployeeRoleCode == 'PC'){
      this.checkedValues.push('product')
    }
    else{
    this.chkboxes.forEach(x => x.checked = false);
    }
    this.mailId = '';
  
   }
   statusList:any = [];
   async exportStatus(){
    this.ngxService.start();
    let response: any = await this.api.getData(this.utils.API.GET_INCIDENT_EXPORT_STATUS + '?userName=' + this.username);
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
    filterDateOption: any = { ...this.learnutils.DateRangePickerConfigIncident }
  
    dateRangeChange(event) { 
      // this.myModelDatepicker != null;
      this.filterDateOption.autoUpdateInput = true;
      this.filterParam.fromDate = event.start.format('yyyy-MM-DD');
      this.filterParam.toDate = event.end.format('yyyy-MM-DD');
      if(this.filterParam.fromDate!=undefined && this.filterParam.fromDate!='' && this.filterParam.toDate!='' && this.filterParam.fromDate!=null && this.filterParam.toDate!=null){
        // this.filterParam.status= this.ddLsitdata[0].name;
        this.filterParam.findCase='';
        //  this.filterParam.storeId='';
        //  this.drop1changeValue = '';
      //  this.dropdownSelect = 'filter1';
      //  this.keyword1Array = [];
      //  this.drop1changeValue = '';
      //  this.selectedOptionsnew = [];
        // this.clearCuntryRegion();
        this.getFilterData();
  
       }
  
    }
    drop1changeValue:any = '';
    drop1change(event: any) {
      this.filterParam.findCase = '';
      // this.filterParam.fromDate = '';
      // this.filterParam.toDate = '';
      // this.myModelDatepicker = null;
      // this.picker.datePicker.setStartDate(new Date());
      // this.picker.datePicker.setEndDate(new Date());
      this.keyword1Array = [];
      // this.selectedOptionsnew = [];
       this.drop1changeValue = event.srcElement.value;
       this.keyword1Array.push(this.drop1changeValue);
       this.clearCuntryRegion();
       this.getFilterData();
    }
    selectedOptionsnew:any[] = [];


    toggleSelection(event: any, optionName: string): void {
      if (event.checked) {
        this.selectedOptionsnew.push(optionName);
      } else {
        const index = this.selectedOptionsnew.indexOf(optionName);
        if (index >= 0) {
          this.selectedOptionsnew.splice(index, 1);
        }
      }
      this.filterParam.findCase= '';
      // this.filterParam.fromDate= '';
      // this.filterParam.toDate= '';
        // this.filterParam.storeId='';
        // this.filterParam.searchby = '1';
        // this.drop1changeValue = '';
      //  this.dropdownSelect = 'filter1';
      //  this.myModelDatepicker = null;
      //  this.myModelDatepicker = '';
      //  this.picker.datePicker.setStartDate(new Date());
      //  this.picker.datePicker.setEndDate(new Date());
      //  this.keyword1Array = [];
      //  this.drop1changeValue = '';
  
        // this.clearCuntryRegion();

        if((this.selectedOptionsnew.length == 0 && this.filterParam.fromDate== '' &&  this.filterParam.toDate== '' && this.filterParam.storeId =='' && this.keyword1Array.length == 0 && this.filterParam.countryRegion == '' ) && (this.commontableParam == undefined)){
    
          this.ngxService.start();
             this.getIncidentList();
             this.getIncidentCount();
        }else{
           this.getFilterData();
        }
    }
    statusappliedText = "All"
    isSelectednew(optionName: string): boolean {
      return this.selectedOptionsnew.includes(optionName);
    }
   
  }
  