import { CommonService } from '../shared/services/incident-services/common.service';
import { DatePipe } from '@angular/common';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { CommonService as learnersCommonservice } from '../shared/services/common.services';
import { Utils as leranersutils } from '../shared/utils';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, OnChanges, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject, Subscription, catchError, map, takeUntil, throwError } from 'rxjs';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Utils } from '../shared/utils';
import _ from 'underscore';
import * as __ from 'lodash';
import * as $ from 'jquery';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NgbPopover, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ngxService } from '../shared/services/incident-services/ngxservice';

@Component({
  selector: 'app-f2f-summary',
  templateUrl: './f2f-summary.component.html',
  styleUrls: ['./f2f-summary.component.scss']
})
export class F2fSummaryComponent implements OnInit {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  @ViewChild('uploadFileInput', { static: false }) uploadFileInput!: ElementRef;
  @ViewChildren(NgbPopover) popovers: QueryList<NgbPopover>;

  xlsContent: any = [];

  @ViewChild('importProgress', { static: false }) importProgress!: ElementRef;
  @ViewChild('progressDone', { static: false }) progressDone!: ElementRef;
  /* Report Variables */
  weeklyReportId: any;
  reportName: any;
  frequency: any;
  reportScheduleFilter: any

  /* Hierarchy table variables */
  countryList: any = [];
  cloneCountryList: any = [];
  roleLevelList: any = [];
  cloneRoleLevelList: any = [];
  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;
  selectedStoreCount: any;
  selectedLevelCount: any;
  selectedCountryDropDown: any = [];
  selectedRoleGroupDropDown: any = [];
  storeCount: any;
  levelCount: any;

  /* filter request object */
  filterRequest: any = {
    courseName: '',
    courseType: '',
    sortBy: '',
    sortValue: ''
  };
  filter: any = []
  mailIds: any = [];

  /* date picker variables */
  searchByDatelist: any = [{ name: 'Creation Date' }];
  filterDateOption: any = { ...this.utils.DateRangePickerConfigf2f }
  selectedDateLabel: any;
  selectedPopupDateLabel: any;

  /* Filtered Reports table variables */
  generalReportList: any = [];
  cloneGeneralReportList: any = [];
  reportsColumns: any = [];
  reportsColumnsToDisplay: any = [];

  /* Outstanding reports table variables */
  outstandingReportsList: any = [];
  cloneOutstandingReportsList: any = [];
  outstandingReportsColumns: any = [];
  outstandingReportsColumnsToDisplay: any = [];

  /* Modal variables */
  frequencyList: any = [];
  mailId: any;
  disabled: boolean = true;

  /* Drop Down Variables */
  courseTypes: any = [];

  /* Weekly report DD */
  allWeeklyReportList: any = [];
  cloneAllWeeklyReportList: any = [];
  outstandingWeeklyReportList: any = [];
  cloneOutstandingWeeklyReportList: any = [];

  /* UI filter variables */
  currentFilters: any = {
    courseName: 'All',
    employeeStatus: 'Active'
  };
  availableFilter: any = {
    courseName: [{ name: 'All', key: 'All' }],
    employeeStatus: [{ name: 'All', key: 'All' }, { name: 'Active', key: 'Active' }, { name: 'InActive', key: 'InActive' }]
  };

  /* UI sort variables */
  sortBy: any = 'Sort By Asc';
  sortByField: any;

  /* Table Sort Variable */
  sortOption: any = this.utils.ddOptions.sortOption;

  /* SearchBy variables */
  searchLabels: any;
  searchBy: any = 'employeeId';
  searchTextModal: any;
  searchByTag: any;
  suggestedLabels: any;

  /* SearchBy variables */
  searchDateList: any;
  searchDateBy: any = 'trainedDate';

  /* Header filter DD variable */
  filters: any = [];

  /* Manager check variable */
  isManager: boolean = false;

  /* User detail variable */
  userDetails: any;

  /* Toggle view change variable */
  viewTypes: any = [{ name: 'All training report', key: 'reportView' }, { name: 'Outstanding report', key: 'outstandingView' }];
  viewType: any = 'reportView';

  /* Clear filter check variable */
  isFilterAvailable: boolean = false;

  /* Pagination variables */
  reportList: any = [];
  paginationIndex: any = 0;
  allowCall: boolean = true;
  nextPage: boolean = false;

  /* Data rendered check variable */
  recordFound: boolean = false;
  destroyed$: Subject<void> = new Subject<void>();
  showShimmer: boolean = false;
  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;
  
  form!: FormGroup;

  /* Values for Date Filters */
  fromDatevalue: any;
  toDatevalue: any;
  maxDate: any;
  fromMinDate: any;
  fromMaxDate: any;
  toMinDate: any;
  toMaxDate: any;
  fromMaxDatechange: any;
  courseName: any;
  trainerName: any;
  scheduleDatevalue: any;
  createBatch: boolean = false;
  filterDatevalue: any;
  expireDatevalue: any;
  filtercourseName: any;
  scheduleminDate: any;

  f2freportTableheader: any[] = [];
  f2freportTableheaderrecurring:any[] = [];
  batchData: any = []
  username: any;
  loginEmployeeId: any;
  loginEmployeeCountry: any;
  loginEmployeeRoleCode: any;
  loginMainRoleCode: any;
  isIncharge: any;
  loginEmployeeStoreId: any;
  loginEmployeeRegionId: any;
  loginEmployeeManager: any;
  loginEmployeeIstrainer: any;
  userId:any;
  viewHistory = false;
  summaryList: any[] = [];
  summaryShimmer = false;
  shimmerCount = 7; // Change this number based on how many shimmer elements you want

  // Generate an array with a length equal to shimmerCount
  shimmerArray = Array(this.shimmerCount).fill(0).map((x, i) => i);
  batchStatusList = 1
  showempComponent = false;
  addpeopleArray: any;
  upDatedEmployeeCount: any;
  receivedpeopleData: any;
  upcomingListData: any[] = [];
  draftListData: any[] = [];
  cardShimmer = false;
  cardShimmer1 = false;
  showPopUP = false
  viewDetails = false;
  updateEmployeeList: any[] = [];
  saveButtonshow = false
  historyData: any;
  historyTableview = false;
  mailIdsend = "";
  mailIdexport = "";
  Emails: any[] = [];
  activeShimmer = false;
  activeData:any[] =[];
  previousDetailsData: any; // To store previous data
  detailsData: any = { /* Your initial data here */ };
  batchCourselist: any[] = [];
  batchTrainerlist: any[] = [];
  trainerNameList: any[] = [];
  courseNameList: any[] = [];
  filterCourseNamevalues: any = [];
  filtercourseNameList: any[] = [];
  shimmerWidth: any;
  onetimeCall = false;
  selectedOptionsnew: any[] = [];
  firstclick = false;
  hideBatch: boolean = true;
  oldNumber: number = 0;
  viewPeopleinst = false;
  allboxinter = false;
  selectedIndices: any[] = [];
  isAllselect = false;
  selected_PopupData: any = [];
  scheduleParams: any;
  cloneBatchdata: any[] = [];
  ModalPopup1 = false;
  AlreadyscheduledEmployees: any[] = [];
  trainerDropdownData: any[] = [];
  inputPlaceholderValue: any;
  loginEmployeeAdmin:any;
  todayDate:any;
  private subscription: Subscription;

  @ViewChildren(MatAutocompleteTrigger) autoCompleteTriggers: any;
  @HostListener('window:keydown.esc', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showempComponent == true) {
      setTimeout(() => {
        this.showempComponent = false;
      }, 500);
    }
    if(this.historyTableview == true){
      setTimeout(() => {
        this.historyTableview = false;
      }, 500);
    }
    if(this.ModalPopup1 == true){
      setTimeout(() => {
        this.ModalPopup1 = false;
      }, 500);
    }
    if(this.validePopup == true){
      this.validePopup = false
    }
  }

  dateValues = [
    {
      name: "Trained date"
    },
    {
      name: "Expired Date"
    }
  ]

  upcomingFilterlist = [
    {
      name: "Scheduled",
      filterId: 1
    },
    {
      name: "Cancelled",
      filterId: 0
    },
    {
      name: "Assigned",
      filterId: 3
    },
    {
      name: "Closed",
      filterId: 4
    },
  ]

  actionList = [
    {
      name: "Schedule",
      type: "Scheduled"
    },
    {
      name: "Draft",
      type: "Draft"
    }
  ]

  constructor(private modalService: NgbModal,public learnutils: leranersutils, public emitservice: learnersCommonservice, public common: CommonService, private datepipe: DatePipe, public utils: Utils,
    private apiHandler: ApiHandlerService, private http: HttpClient, private ngxservice:ngxService,
    private cdr: ChangeDetectorRef, private formBuilder: FormBuilder, private errorHandler: ErrorHandlerService, public ngxloaderService: NgxUiLoaderService) {
      this.subscription = this.emitservice.data$.subscribe((data) => {
        if(this.createBatch == true){
          this.gotoSummarypage();
        }
      });
  }
  
  ngOnInit(): void {
    this.getModuleAccess();
    this.setInitialFromToDate();
    this.searchLabels = this.utils.ddOptions.DD_LABELS.employeeTraineeSearch;
    this.searchDateList = this.utils.ddOptions.DD_LABELS.searchF2FDateList;
    this.f2freportTableheader = this.utils.TABLE_HEADERS.F2F_REPORTS_TABLE_SUMMARY;
    this.f2freportTableheaderrecurring = this.utils.TABLE_HEADERS.F2F_RECURRING_TABLE_SUMMARY;
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.username = localStorage.getItem('username');
    this.userId = userDetails.id;
    this.loginEmployeeId = userDetails.employeeId;
    this.loginEmployeeCountry = userDetails.country;
    this.loginEmployeeRoleCode = userDetails.learnerRole;
    this.loginMainRoleCode = userDetails.roleCode;
    this.isIncharge = userDetails.incharge;
    this.loginEmployeeRegionId = userDetails.regionId;
    this.loginEmployeeStoreId = userDetails.storeId;
    this.loginEmployeeManager = userDetails.manager;
    this.loginEmployeeIstrainer = userDetails.isTrainer;
    this.loginEmployeeAdmin = userDetails.learnerRole;
    this.filterRequest.employeeStatus = 'Active';
    // if(this.loginEmployeeManager){
    //   this.getActivecount();
    // }
    // this.setsummaryDateValues();
    this.getSummarylist();
    this.setsummaryDateValues();
    this.getUpcominglist();
    this.getDraftlist();
    this.getBatchCourseList();
    this.getBatchTrainerlist();
    this.getCourseName();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9A-Z._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });
    const todaydate = new Date();
    this.todayDate = this.datepipe.transform(todaydate, 'yyyy-MM-dd')

  }
  get f() { return this.form.controls; }

  scrolling(e: any) {
    this.closebsValue()
    let autoClickButton: any
    autoClickButton = document.getElementById('MainContent');
    const event1 = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    autoClickButton.dispatchEvent(event1);

  }
  closebsValue() {
    var nodes = document.getElementsByTagName('bs-datepicker-container');
    for (var i = 0, len = nodes.length; i != len; ++i) {
      nodes[0]?.parentNode?.removeChild(nodes[0]);
    }
  }
  // https://stackblitz.com/edit/angular-pvmarv-brpjsp?file=src%2Fapp%2Fautocomplete-overview-example.ts
  public closeAllPanels() {
    this.autoCompleteTriggers.forEach((trigger: any) => {
      if (trigger.panelOpen) {
        trigger.closePanel();
      }
    });
  }

  //  async getAllTableFilterData(){
  //     this.showShimmer = true;
  //     const response: any = await this.apiHandler.getData(this.utils.API.GET_F2f_FILTER_DATA_LIST, null, this.destroyed$);
  //     const allFilterdata = response.payload;
  //     if(response.payload){
  //     this.filterTrainerNamevalues = allFilterdata.trainers;
  //     this.filterStoreCodevalues = allFilterdata.storeCodes;
  //     this.filterStoreNamevalues = allFilterdata.storeNames;
  //     this.filterEmployeeRolevalues = allFilterdata.roles;
  //     this.filterTrainerNamevalues = this.filterTrainerNamevalues.map(trainer => ({ name:trainer, checked: false }));
  //     this.filterStoreCodevalues = this.filterStoreCodevalues.map(storecode => ({ name:storecode, checked: false }));
  //     this.filterStoreNamevalues = this.filterStoreNamevalues.map(storename => ({ name:storename, checked: false }));
  //     this.filterEmployeeRolevalues = this.filterEmployeeRolevalues.map(role => ({ name:role, checked: false }));
  //   }
  // }

  gotocreateBatch() {
    this.createBatch = true;
    this.ngxloaderService.start();
    this.getUserDetails();
    if(!this.loginEmployeeManager && this.loginEmployeeAdmin !== 'SA' && this.loginEmployeeAdmin !== 'HR'){
      this.hideBatch = false;
      this.firstclick = true;
    }
  }

  async getBatchCourseList() {
    const params = {
      "country": this.loginEmployeeCountry,
      "isManager": this.loginEmployeeManager,
      "roleCode": this.loginEmployeeRoleCode,
      "regionId": this.loginEmployeeRegionId,
      "storeId": this.loginEmployeeStoreId
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_CREATE_BATCH_COURSE_LIST, params, this.destroyed$);
    this.courseNameList = response.payload;
    for (let x of this.courseNameList) {
      x.checked = false;
    }
  }

  async getBatchTrainerlist() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_CREATE_BATCH_TRAINER_LIST, null, this.destroyed$);
    this.trainerNameList = response.payload;
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-F2FR');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
    console.log(this.view, "VIEW");
    console.log(this.create, "CREATE")
    console.log(this.update, "UPDATE")

  }

  /* Get user details */
  async getUserDetails() {
    /* const response: any = await this.apiHandler.getData(this.utils.API.GET_USER_DETAILS, this.userDetails.id, this.destroyed$);
    localStorage.setItem('userDetails', JSON.stringify(response.payload || {})); */
    this.resetReportList();
    this.getReportList();
  }

  /* Construct country region store json if user login as manager */
  constructCRSJson() {
    const userDetails = this.userDetails;
    const periodUsers: any = userDetails.periodUsers;
    let countries: any = [];
    countries = [this.pushChild(userDetails, 'country')];
    periodUsers?.forEach(element => {
      let country = countries?.find(country => country.id === element.countryId);
      if (country) {
        let region = country.child?.find(region => region.id === element.regionId);
        if (region) {
          let store = region.child?.find(store => store.id === element.storeId);
          if (!store) {
            element.regionId && region.child?.push(this.pushChild(element, 'store'));
          }
        } else {
          element.storeId && country.child?.push(this.pushChild(element, 'region'));
        }
      } else {
        element.countryId && countries?.push(this.pushChild(element, 'country'));
      }
    });

    this.filterRequest.countries = [...countries];
    this.countryList = [...countries];
    this.cloneCountryList = $.extend(true, [], this.countryList);
  }

  pushChild(obj: any, type: string) {
    // let value: any;
    let tempObj: any = {
      id: obj.storeId,
      desc: obj.store
    };
    if (['region', 'country'].includes(type)) {
      tempObj = {
        id: obj.regionId,
        desc: obj.region,
        child: obj.storeId ? [
          tempObj
        ] : undefined
      };
      tempObj = { ...tempObj };
    }
    if (type === 'country') {
      tempObj = {
        id: obj.countryId,
        desc: obj.country,
        child: obj.regionId ? [tempObj] : undefined
      };
      tempObj = { ...tempObj };
    }
    return tempObj;
  }

  /* Get Course Types */
  // async getCourseTypes() {
  //   // this.ngxService.start();
  //   this.showShimmer = true;
  //   const response: any = await this.apiHandler.getData(this.utils.API.GET_COURSE_TYPES, null, this.destroyed$);
  //   this.courseTypes = response.payload;
  //   this.courseTypes.forEach(category => {
  //     this.availableFilter.courseType?.push({ name: category?.courseTypeDesc, key: category?.courseTypeDesc });
  //   });
  //   // this.ngxService.stop();
  // }

  // /* Get course name */
  
  async getCourseName() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_F2F_COURSE_NAME, null, this.destroyed$);
    this.filtercourseNameList = response.payload;
    this.filtercourseNameList = this.filtercourseNameList.map(course => ({ ...course, checked: false }));
  }

  /* Get role group */
  async getRoleGroup() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, '', this.destroyed$);
    let roleGroup = _.sortBy(response?.payload || [], 'sequenceId');
    let roleLevel = [];
    
    roleGroup.forEach(element => {
      if (element.child && element.id !== 7) {
        roleLevel = roleLevel.concat(_.sortBy(element.child, 'sequenceId'));
      }
    });
   
    const res: any = roleLevel.map((ele: any) => {
      return {
        id: ele.id,
        desc: ele.desc
      }
    });
    this.roleLevelList = [...res];
    this.cloneRoleLevelList = $.extend(true, [], this.roleLevelList);
    this.levelCount = this.getCount(this.roleLevelList, 0);
    // this.ngxService.stop();
  }

  /* Get All Country Region Store */
  async getAllCountries() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, '', this.destroyed$);
    this.countryList = this.emitservice.sortRegion(response.payload);
    this.cloneCountryList = $.extend(true, [], this.countryList);
    this.storeCount = this.getCount(this.countryList, 0);
    // this.ngxService.stop();
  }

  getCount(list: any, count: any) {
    list.forEach(element => {
      if (element.child && element.child.length > 0) {
        count = this.getCount(element.child, count);
      } else {
        count++;
      }
    });
    return count;
  }

  /* Call API if header filter change */
  callGetFilteredList(type: any, event?: boolean, isPopup?: boolean) {
    /* Bind roleLevel in request */
    if (type === 'rolelevel' && event === false) {
      const tempArr = this.buildSelectedDropDownHierarchy(this.roleLevelList);
      if ((this.filterRequest.roles || tempArr.length > 0) && !this.deepCompare(this.filterRequest.roles, tempArr)) {
        this.resetReportList();
        this.filterRequest.roles = tempArr;
        this.getReportList();
      }
    }
    /* Bind Countries in request */
    if (type === 'countries' && event === false) {
      const tempArr = this.buildSelectedDropDownHierarchy(this.countryList);
      if ((this.filterRequest.countries || tempArr.length > 0) && !this.deepCompare(this.filterRequest.countries, tempArr)) {
        this.filterRequest.countries = tempArr;
        if (!isPopup) {
          this.resetReportList();
          this.getReportList();
        }
      }
    }

    /* Bind Courses in request */
    if (type === 'courses' && event === false) {
      if ((this.filterRequest.coursenameArray || this.selectedOptionsnew.length > 0) && !this.deepCompareArrays(this.filterRequest.coursenameArray, this.selectedOptionsnew)) {
        this.filterRequest.coursenameArray = this.selectedOptionsnew;
        if (!isPopup) {
          this.resetReportList();
          this.getReportList();
        }
      }
    }

    /* Bind searchBy in request */
    if (type === 'search' && this.filterRequest.searchText !== this.searchTextModal) {
      if (this.checkMinimumChar(3, this.searchTextModal?.length)) {
        return;
      }
      this.resetReportList();
      this.filterRequest.searchText = this.searchTextModal;
      this.filterRequest.searchBy = this.searchBy;
      this.cleardisable = false;
      this.getReportList();
    }
    /* Call API after filter closed */
    if (type === 'filters' && event === false && (this.filterRequest.filter || this.filter.length > 0)
      && this.filterRequest.filter?.toString() !== this.filter?.toString()) {
      this.resetReportList();
      this.filterRequest.filter = this.filter;
      this.getReportList();
    }
  }

  deepCompareArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const frequencyCounter1 = {};
    const frequencyCounter2 = {};

    for (let val of arr1) {
      frequencyCounter1[val] = (frequencyCounter1[val] || 0) + 1;
    }

    for (let val of arr2) {
      frequencyCounter2[val] = (frequencyCounter2[val] || 0) + 1;
    }

    for (let key in frequencyCounter1) {
      if (!(key in frequencyCounter2)) {
        return false;
      }
      if (frequencyCounter2[key] !== frequencyCounter1[key]) {
        return false;
      }
    }

    return true;
  }

  /* Compare filter data with previous filter data */
  deepCompare(arg1, arg2) {
    const that = this;
    if (Object.prototype.toString.call(arg1) === Object.prototype.toString.call(arg2)) {
      if (Object.prototype.toString.call(arg1) === '[object Object]' || Object.prototype.toString.call(arg1) === '[object Array]') {
        if (Object.keys(arg1).length !== Object.keys(arg2).length) {
          return false;
        }
        return (Object.keys(arg1).every(function (key) {
          return that.deepCompare(arg1[key], arg2[key]);
        }));
      }
      return (arg1 === arg2);
    }
    return false;
  }

  @HostListener('scroll', ['$event'])
  containerScrollCheck(event: any) {
    const doc: any = document.querySelector("#reports-container")
    if (doc.scrollHeight > doc.clientHeight && (doc.scrollTop + doc.clientHeight > doc.scrollHeight - 35) && this.allowCall && this.nextPage) {
      this.allowCall = false;
      this.paginationIndex++;
      this.getReportList('scrollDown');
    }

    /*  if (doc.scrollTop === 0 && this.paginationIndex >= 3) {
       this.paginationIndex = this.paginationIndex - 2;
       this.viewType === 'outstandingView' ? this.getOutstandingReport('scrollUp') : this.getGeneralReport('scrollUp');
     } */
  }

  /* Get filtered list */
  async getReportList(scrollDirection?: any) {
    // this.ngxService.start();
    if (document.getElementById("reports-container-table")) {
      const doc: any = document.getElementById("reports-container-table")?.clientWidth;
      this.shimmerWidth = doc;
    }
    this.showShimmer = true;
    this.recordFound = false
    this.filterRequest.page = this.paginationIndex;
    this.filterRequest.allTrainingReport = this.viewType === 'reportView' ? true : false;
    this.filterRequest.admin = this.loginEmployeeAdmin === 'SA';
    this.filterRequest.coursenameArray = this.selectedOptionsnew;
    this.filterRequest.courseName = this.filterRequest.coursenameArray;
    this.filterRequest.fromDate = this.reportFromdate;
    this.filterRequest.toDate = this.reportTodate;
    this.filterRequest.report = false;
    if(this.filterRequest.fromDate == '' || this.filterRequest.toDate == ''){
    delete this.filterRequest.searchDateBy;
    delete this.filterRequest.fromDate;
    delete this.filterRequest.toDate;
    }
    // this.filterRequest.trainers = this.filtertrainerList;
    // this.filterRequest.storeIds = this.filterstorecodeList;
    // this.filterRequest.storeNames = this.filterstorenameList;
    // this.filterRequest.filterRoles = this.filteremployeeroleList;

    const params = this.filterRequest;
    this.selectedIndices = [];
    this.isAllselect = false;
    this.allboxinter = false;
    const response: any = await this.apiHandler.postData(this.utils.API.GET_F2F_REPORTS, params, this.destroyed$);
    this.nextPage = response.payload.length > 0 && response.payload[0].nextPage;
    if (this.viewType === 'reportView') {
      this.showShimmer = true;
      this.generalReportList = __.flatten(this.constructReportList(response, 0, scrollDirection));
      this.cloneGeneralReportList = [...this.generalReportList];
      for (let x of this.generalReportList) {
        x.checked = false;
        x.isDragged = false
      }
      for (let x of this.cloneGeneralReportList) {
        x.checked = false;
        x.isDragged = false
      }

    } else if (this.viewType === 'outstandingView') {
      this.showShimmer = true;
      this.outstandingReportsList = __.flatten(this.constructReportList(response, 0, scrollDirection));
      this.cloneOutstandingReportsList = [...this.outstandingReportsList];
    }

    if (response.payload && this.onetimeCall == false) {
      this.getRoleGroup();
      this.getAllCountries();      
      this.onetimeCall = true;
    }
    // this.getFilterLists();
    this.recordFound = true
    this.showShimmer = false;
    this.ngxloaderService.stop();
    // this.applyListingFilter();
  }

  stopLoader() {
    const doc: any = document.querySelector("#reports-container")
    if (doc.scrollHeight > doc.clientHeight) {
      // this.ngxService.stop();
      //  this.showShimmer = false;
      console.log('loader stop................');
    }
  }

  constructReportList(response: any, pageIndex: any, scrollDirection: any) {
    if (response.payload.length > 0) {
      this.reportList.push([...response.payload]);
    }
    this.allowCall = true;
    return this.reportList;
  }

  /* Select All from drop down list */
  selectAll(event: any, list: any, type: any) {
    this.changeObjProperty(list, 'selectStatus', event.checked ? 'checked' : 'unchecked');
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Filter update once drop down value selected */
  filterUpdate(ddList: any, type: any) {
    let tempSelected = [];
    for (let country of ddList) {
      this.selectedDropDown(country, tempSelected, type);
    }
    type === 'country' ? this.selectedCountryDropDown = [...tempSelected] : this.selectedRoleGroupDropDown = [...tempSelected];
  }

  /* create selected drop down array */
  selectedDropDown(obj: any, tempArr: any, type: any) {
    if (obj.selectStatus === 'checked') {
      type === 'country' ? tempArr.push(obj.countryRegionStoreId) : tempArr.push(obj.roleGroupLevelId);
    } else if (obj.selectStatus === 'mixed') {
      for (let child of obj.child) {
        this.selectedDropDown(child, tempArr, type);
      }
    } else if (obj.selectStatus === 'unchecked') {
      type === 'country' ? tempArr.filter(temp => temp !== obj.countryRegionStoreId) : tempArr.filter(temp => temp !== obj.roleGroupLevelId);
    }
  }

  /* Select single property from drop down list */
  selectionToggleLeaf(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Select Multiple properties */
  selectionToggle(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.changeObjProperty(node.child, 'selectStatus', node.selectStatus);
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Update selection Status in List */
  updateSelectionstatus(type) {
    let listArray = [];
    if (type === 'roleGroup') {
      listArray = this.roleLevelList;
    } else if (type === 'country') {
      listArray = this.countryList;
    }
    for (let child of listArray) {
      this.setSelectionStatus(child);
    }
  }

  /* Set Drop Down list status as checked or unchecked or mixed */
  setSelectionStatus(node) {
    if (node.child && node.child.length) {
      for (let child of node.child) {
        this.setSelectionStatus(child);
      }
      let checkedChild = 0;
      let checkedMixedChild = 0;
      node.child.forEach((obj) => {
        if (obj.selectStatus === 'checked') {
          checkedChild++;
        }
        if (obj.selectStatus === 'checked' || obj.selectStatus === 'mixed') {
          checkedMixedChild++;
        }
      });
      node.selectStatus = node.child.length === checkedChild ? 'checked' : checkedMixedChild === 0 ? 'unchecked' : 'mixed';
    }
  }

  calcSelectedStore() {
    this.selectedStoreCount = 0;
    this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    return this.selectedStoreCount;
  }

  calcSelectedLevel() {
    this.selectedLevelCount = 0;
    this.selectedLevelCount = this.getSelectedChildCount(this.roleLevelList, this.selectedLevelCount);
    return this.selectedLevelCount;
  }

  getSelectedChildCount(list: any, count: number) {
    list.forEach(element => {
      if (element.selectStatus === 'mixed' || element.selectStatus === 'checked') {
        if (element.child && element.child.length > 0) {
          count = this.getSelectedChildCount(element.child, count);
        } else {
          if (element.selectStatus === 'checked') {
            count++;
          }
        }
      }
    });
    return count;
  }
  reportFromdate:any = '';
  reportTodate:any = '';
  /* date change event */
  dateRangeChange(event, isPopup) {
    if (isPopup) {
      this.selectedPopupDateLabel = event.label === 'Custom Range' ? event.start.format('DD/MM/yyyy')
        + ' to ' + event.end.format('DD/MM/yyyy') : event.label;
    } else {
      this.selectedDateLabel = event.label === 'Custom Range' ? event.start.format('DD/MM/yyyy')
        + ' - ' + event.end.format('DD/MM/yyyy') : event.label;
    }
    this.reportFromdate = event.start.format('yyyy-MM-DD');
    this.reportTodate = event.end.format('yyyy-MM-DD');
    this.filterRequest.searchDateBy = this.searchDateBy;
    this.resetReportList();
    this.getReportList();
  }

  clearDateField() {
    this.selectedDateLabel = '';
    this.filterRequest.fromDate = null;
    this.filterRequest.toDate = null;
    this.filterRequest.searchDateBy = null;
    this.resetReportList();
    this.getReportList();
  }

  buildSelectedDropDownHierarchy(list: any) {
    let tempArr = [];
    list.forEach(element => {
      if (element.selectStatus === 'checked') {
        tempArr.push({
          id: element.id,
          desc: element.desc
        });
      } else if (element.selectStatus === 'mixed') {
        tempArr.push({
          id: element.id,
          desc: element.desc,
          child: element.child ? this.buildSelectedDropDownHierarchy(element.child) : undefined
        });
      }
    });
    return tempArr;
  }

  /* UI Table filter portion */
  /* Table filter apply */
  updateFilter(items, column) {
    this.resetReportList();
    this.currentFilters[column.property] = items.key;
    // if (column.property === 'courseName') {
    //   this.filterRequest.courseName = items.key === 'All' ? '' : items.key;
    // }  
    if (column.property === 'employeeStatus') {
      this.filterRequest.employeeStatus = items.key === 'All' ? '' : items.key;
    }
    this.getReportList();
  }

  updateSort(sortBy?, sortObj?) {
    this.resetReportList();
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    if (this.sortBy !== 'Reset') {
      this.filterRequest.filterBy = this.sortByField;
      this.filterRequest.filterValue = this.sortBy === 'Sort By Asc' ? 'asc' : 'desc';
    } else {
      this.filterRequest.filterBy = '';
      this.filterRequest.filterValue = '';
    }
    this.getReportList();
  }

  /* Apply UI filter for table listing */
  applyListingFilter() {
    const filterFields = Object.keys(this.currentFilters);
    const resetAll = filterFields.find((key) => this.currentFilters[key] !== 'All');
    let list: any = this.viewType === 'reportView' ? this.generalReportList : this.outstandingReportsList;
    const cloneList: any = this.viewType === 'reportView' ? this.cloneGeneralReportList : this.cloneOutstandingReportsList;
    if (!resetAll) {
      list = [...cloneList];
    } else {
      list = cloneList.filter((obj) => {
        let hasValue = false;
        for (const key of filterFields) {
          if (this.currentFilters[key] !== 'All') {
            if (obj[key] === this.currentFilters[key]) {
              hasValue = true;
            } else {
              hasValue = false;
              break;
            }
          }
        }
        return hasValue;
      });
    }
    this.viewType === 'reportView' ? this.generalReportList = [...list] : this.outstandingReportsList = [...list]
  }

  /* check given input has required character */
  checkMinimumChar(minChar, inputLength) {
    if (!minChar || !inputLength || inputLength >= minChar) {
      return false;
    } else {
      this.errorHandler.handleAlert(`Please enter minimum ${minChar} character for auto suggesstion.`);
      return true;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(event: any) {
    let checked = event.checked;
    this.filters.forEach(element => {
      element.checked = checked;
    });
    this.filter = checked ? this.filters.map(filter => filter.key) : [];
  }

  filterCheckedAll() {
    const isAllSelected = this.filters.every(element => element.checked);
    return isAllSelected;
  }

  /* Single select */
  singleToggle(evt, filter) {
    this.filters.forEach(element => {
      if (element.key === filter.key) {
        element.checked = evt.checked;
      }
    });
    this.updateFilterArray();
  }

  updateFilterArray() {
    this.filter = [];
    this.filters.forEach(element => {
      if (element.checked) {
        this.filter.push(element.key);
      }
    });
  }

  setSelectedCountries(list: any, selectedList: any) {
    selectedList?.forEach(selected => {
      let selectedObj = list.find(obj => obj.id === selected.id);
      if (selectedObj) {
        if (selected.child && selected.child.length > 0) {
          selectedObj.selectStatus = 'mixed';
          this.setSelectedCountries(selectedObj.child, selected.child);
        } else {
          selectedObj.selectStatus = 'checked';
          if (selectedObj.child) {
            this.changeObjProperty(selectedObj.child, 'selectStatus', 'checked');
          }
        }
      }
    });
  }

  changeObjProperty(array: any, property: any, assignValue: any) {
    array.forEach((obj) => {
      obj[property] = assignValue;
      if (obj.child && obj.child.length > 0) {
        this.changeObjProperty(obj.child, property, assignValue);
      }
    });
    return array;
  }

  openEmployee(element: any) {
    const searchObj = {
      searchBy: 'employeeId',
      searchTextValue: element.employeeId
    };
    localStorage.setItem('nav-employee', JSON.stringify(searchObj));
    window.open(`${window.origin}/#/employees`, '')
  }

  /* File Upload Area start*/
  onFileBrowse(event: any, uploadedMedia: any) {
    this.importProgress?.nativeElement.click();
    var pattern = /(xls)/;
    let checkFileType = false;
    let ext = '';
    let fileListAsArray: any = [];

    const getTarget: DataTransfer = <DataTransfer>(event.target);
    ext = getTarget.files[0]?.name.split('.').pop();
    const target = event.target as HTMLInputElement;
    fileListAsArray = target.files;
    checkFileType = (ext.match(pattern)) ? true : false;

    if (checkFileType) {
      this.xlsContent = [];
      uploadedMedia = this.xlsContent;
      if (fileListAsArray.length > 1) {
        this.errorHandler.handleAlert('Multiupload not allowed');
        return;
      }
      this.processFiles(fileListAsArray, uploadedMedia);
    }
    else {
      this.uploadFileInput.nativeElement.value = '';
      this.errorHandler.handleAlert('Invalid file format');
    }
  }

  async processFiles(files: any, uploadedMedia: any) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('request', file);
      formData.append('userId', this.userId);
    }
    const apiUrl = this.utils.API.UPLOAD_EXCEL;
    this.upload(apiUrl, formData);
    // const res: any = await this.apiHandler.fileUpload(apiUrl, formData, this.destroyed$);
    // for (const file of res.payload) {
    //   uploadedMedia?.push(file);
    // }
  }

  progress: any;
  upload(url, file) {
    let Token = localStorage.getItem("authenticationToken")
    this.progress = 1;
    new Promise((resolve, reject) => {
      this.http
        .post(url, file, {
          headers:{Authorization: 'Bearer '+Token },
          reportProgress: true,
          observe: "events"
        })
        .pipe(takeUntil(this.destroyed$),
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.progress = Math.round((100 / event.total) * event.loaded);
            } else if (event.type == HttpEventType.Response) {
              // this.progress = null;
            }
          }),
          catchError((err: any) => {
            return throwError(err.message);
          })
        ).subscribe(
          (response: any) => {
            resolve(response);
          }, error => {

            if (typeof error !== 'string') {
              this.errorHandler.handleAlert(error?.error?.errors?.message || 'Internal Server Error !!!');
              const doc: any = document.getElementById('file')
              doc.value = '';
              this.progressDone?.nativeElement.click();
            }
            reject('error');
          });
    });
  }
  /* File Upload area end */

  async import() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_F2F_STATUS, '', this.destroyed$);
    if (response.payload === false) {
      this.uploadFileInput?.nativeElement?.click()
    } else {
      this.errorHandler.handleAlert('server is busy, please try again later')
    }
  }

  progressDoneClick() {
    const doc: any = document.getElementById('file')
    doc.value = '';
    this.progress = null;
    this.resetReportList();
    this.getReportList();
  }

  refreshReport() {
    this.resetFilters();
    this.getReportList();
  }

  clearFilters() {
    // this.isFilterAvailable = this.selectedRoleGroupDropDown.length === 0 && this.selectedCountryDropDown.length === 0 && !this.selectedDateLabel && this.filter.length === 0 && !this.searchTextModal
    // if (this.isFilterAvailable) {
    //   return;
    // }
    this.resetFilters();
    this.resetReportList();
    this.getReportList();
    this.calcSelectedStore();
    this.calcSelectedLevel();
  }

  resetFilters() {
    // this.showShimmer = true;
    this.countryList = $.extend(true, [], this.cloneCountryList);
    this.selectedCountryDropDown = [];
    this.roleLevelList = $.extend(true, [], this.cloneRoleLevelList);
    this.selectedRoleGroupDropDown = [];
    this.selectedDateLabel = '';
    this.filter = [];
    this.filters = this.viewType === 'reportView' ? $.extend(true, [], this.utils.ddOptions.DD_LABELS.filters) : $.extend(true, [], this.utils.ddOptions.DD_LABELS.filters).filter(ele => ele.key === 'inactive');
    this.filterRequest = {};
    this.searchTextModal = null;
    this.cleardisable = true;
    this.searchBy = 'employeeId';
    this.searchDateBy = 'trainedDate';
    this.selectedOptionsnew = [];
    this.picker.datePicker.setStartDate(new Date());
    this.picker.datePicker.setEndDate(new Date());  
    this.reportTodate = '';
    this.reportFromdate = '';
    // this.clearDateField();
    for (let x of this.filtercourseNameList) {
      x.checked = false;
    }
    // this.showShimmer = false;
  }

  resetColumnFilter() {
    this.showShimmer = true;
    for (let filter in this.currentFilters) {
      this.currentFilters[filter] = 'All';
    }
    this.showShimmer = false;
  }

  resetReportList() {
    this.showShimmer = true;
    this.reportList = [];
    this.paginationIndex = 0;
    this.reportList = [];
    this.generalReportList = [];
    this.outstandingReportsList = [];
  }

  // Method to close the popover
  closePopover(index: number) {
    if (this.popovers && this.popovers.length > index) {
      this.popovers.toArray()[index].close();
    }
  }

  fromDateChange(event: any) {
    this.fromDatevalue = event;
    this.toMinDate = this.datepipe.transform(this.fromDatevalue, 'yyyy-MM-dd');
    //  if(this.filterParam.toDate!='' && this.filterParam.fromDate>this.filterParam.toDate){
    //   this.filterParam.toDate="";
    //  }
    this.toMinDate = new Date(this.toMinDate);
    this.toMinDate.setDate(this.toMinDate.getDate());

    if(this.datepipe.transform(this.fromDatevalue, 'yyyy-MM-dd') !== this.datepipe.transform(this.DefaultfromDate, 'yyyy-MM-dd')){
      this.datefilterActive = true
    }
    else{
      this.datefilterActive = false
    }
    this.cdr.detectChanges();
    
    if (this.fromDatevalue !== undefined && this.toDatevalue !== undefined && this.fromDatevalue !== '' && this.toDatevalue !== '') {
      this.filterwithDate();
    }
  }

  toDateChange(event: any) {
    this.toDatevalue = event;
    this.fromMaxDate = this.datepipe.transform(this.toDatevalue, 'yyyy-MM-dd');
    this.fromMaxDate = new Date(this.fromMaxDate);
    this.fromMaxDate.setDate(this.fromMaxDate.getDate());
    if(this.datepipe.transform(this.toDatevalue, 'yyyy-MM-dd') !== this.datepipe.transform(this.DefaulttoDate, 'yyyy-MM-dd')){
      this.datefilterActive1 = true
    }
    else{
      this.datefilterActive1 = false
    }
    this.cdr.detectChanges();
    if (this.fromDatevalue !== undefined && this.toDatevalue !== undefined && this.fromDatevalue !== '' && this.toDatevalue !== '') {
      this.filterwithDate();
    }
  }

  async filterwithDate() {
    this.summaryShimmer = true;
    this.summaryList = [];
    const convertfromdate = this.datepipe.transform(this.fromDatevalue, 'yyyy-MM-dd');
    const converttodate = this.datepipe.transform(this.toDatevalue, 'yyyy-MM-dd')

    const param = {
      "country": this.loginEmployeeCountry,
      "isManager": this.loginEmployeeManager,
      "roleCode": this.loginEmployeeRoleCode,
      "regionId": this.loginEmployeeRegionId,
      "storeId": this.loginEmployeeStoreId,
      "fromDate": convertfromdate,
      "toDate": converttodate
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_SUMMARY_LIST_FILTER, param, this.destroyed$);
    if(response.payload){
      this.summaryList = response.payload;
      this.summaryShimmer = false;
    }
  }

  setInitialFromToDate() {
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
    // this.fromMinDate = (yyyy - 20) + '-' + mm + '-' + dd;
    this.toMinDate = (yyyy - 20) + '-' + mm + '-' + dd;
    this.fromMaxDate = today;
    this.toMaxDate = today;
    // this.fromMaxDate={year: yyyy, month: mm, day: dd}
    this.fromMaxDate = new Date();
    this.fromMaxDate.setDate(this.fromMaxDate.getDate());
    let currentDate1 = new Date();
    currentDate1.setFullYear(currentDate1.getFullYear() - 1);
    this.fromMinDate = currentDate1;
    // this.fromMinDate = new Date(this.fromMinDate);
    
    // this.fromMinDate.setDate(this.fromMinDate.getDate() - 365);
    this.toMaxDate = new Date(this.toMaxDate);
    this.toMaxDate.setDate(this.toMaxDate.getDate());

    this.toMinDate = new Date(this.toMinDate);
    this.toMinDate.setDate(this.toMinDate.getDate());

    this.scheduleminDate = today;
    this.scheduleminDate = new Date();
    this.scheduleminDate.setDate(this.scheduleminDate.getDate());
    // this.scheduleminDate.setDate(this.scheduleminDate.getDate() + 1);
  }

  toggleSelectionForCourse(event: any, optionName: any) {
    optionName.checked = event.checked;
    this.selectedOptionsnew = this.filtercourseNameList.filter((item: any) => {
      return item.checked == true;
    }).map(item => item.courseName);
  }

  addBatch() {
    this.getWidth();
    if (this.batchData.length <= 2) {
      this.batchData.unshift({
        courseId: "",
        courseName: "",
        batchName: "",
        trainerId: "",
        trainerName: "",
        // trainerId: [],
        // trainerName: [],
        batchEmployeesCount: "",
        scheduledDate: '',
        batchStatus: "Scheduled",
        employeesList: [],
        batchCreatedBy: this.loginEmployeeId
      })

      const element = document.getElementById('targetElement');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
    else {
      this.common.openSnackBar("Already 3 batches there please complete this.", 2, "")
    }
    this.cdr.detectChanges();
  }

  hidecreate() {
    this.firstclick = true;
    this.hideBatch = this.hideBatch ? false : true
  }

  dragStarted: boolean = false;
  indicatorPositionX: number = 0;
  indicatorPositionY: number = 0;

  onDragStart(event: DragEvent, data: any) {
    this.oldNumber = 0;
    setTimeout(() => {
      this.dragStarted = true;

    }, 300);
    this.setIndicatorPosition(event);

    if (this.selectedIndices.length > 0) {
      event.dataTransfer?.setData('text/plain', JSON.stringify(this.selectedIndices));
    }
    else {
      event.dataTransfer?.setData('text/plain', JSON.stringify(data)); // Store the dragged data
    }
  }
  onMouseEnter(event: MouseEvent) {
    this.setIndicatorPosition(event);
  }
  onMouseLeave() {
    this.dragStarted = false; // Hide the "Drag started" text when mouse leaves
  }
  onMouseMove(event: MouseEvent) {
    if (this.dragStarted) {
      this.setIndicatorPosition(event);
    }
  }
  setIndicatorPosition(event: MouseEvent) {
    // Set the position of the indicator based on the mouse coordinates
    this.indicatorPositionX = event.pageX;
    this.indicatorPositionY = event.pageY + 20; // Add an offset to position below the mouse
  }
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default to allow drop
  }

  onDrop(event: DragEvent, item: any) {
    this.dragStarted = false;
    this.oldNumber = 0;
    event.preventDefault();
    if (this.selectedIndices.length > 0) {
      const transferredData = JSON.parse(event.dataTransfer?.getData('text/plain') || '[]');
      transferredData.forEach((data: any) => {
        // Perform actions for each dropped row data
        if (data) {
          const droppedData = data;
          let oldEployee = item.employeesList.filter((name: any) => {
            return name.employeeId == droppedData.employeeId
          })
          if (oldEployee.length > 0) {
            this.oldNumber = this.oldNumber + 1;
            this.common.openSnackBar(`${this.oldNumber} Employee(s) already in this batch list`, 2, "")
          }
          else {
            item.employeesList.unshift(droppedData); // Push the dropped data to the destinationArray
          }

        }
      });
      this.selectedIndices = [];
      for (let x of this.generalReportList) {
        x.checked = false
      }
      this.isAllselect = false;
      this.allboxinter = false;

    }
    else {
      const dataString = event.dataTransfer?.getData('text/plain');
      if (dataString) {
        const droppedData = JSON.parse(dataString);
        let oldEployee = item.employeesList.filter((name: any) => {
          return name.employeeId == droppedData.employeeId
        })

        if (oldEployee.length > 0) {
          this.common.openSnackBar("Employee already in this batch list", 2, "")
        }
        else {
          item.employeesList.unshift(droppedData); // Push the dropped data to the destinationArray
        }
      }
    }
  }

  addEmployee(item: any) {
    this.oldNumber = 0;
    for (let i = 0; i < this.selectedIndices.length; i++) {
      let oldEployee = item.employeesList.filter((name: any) => {
        return name.employeeId == this.selectedIndices[i].employeeId
      })

      if (oldEployee.length > 0) {
        this.oldNumber = this.oldNumber + 1;
        this.common.openSnackBar(`${this.oldNumber} Employee(s) already in this batch list`, 2, "")
      }
      else {
        item.employeesList.unshift(this.selectedIndices[i]); // Push the dropped data to the destinationArray
      }
    }

    this.selectedIndices = [];
    for (let x of this.generalReportList) {
      x.checked = false
    }
    this.isAllselect = false;
    this.allboxinter = false;
  }

  shouldEnableDragCondition1(data: any) {
    return this.selectedIndices.length > 0 && data.checked 
  }
  shouldEnableDragCondition2(data: any) {
    return this.selectedIndices.length == 0
  }
  deleteAllemp(item) {
    item.employeesList = []
  }

  deleteEmployee(item: any, emp: any) {
    const deleteIndex = item.indexOf(emp);
    if (deleteIndex !== -1) {
      item.splice(deleteIndex, 1)
    }
  }

  copyBatch(list: any) {
    if (this.batchData.length <= 2) {
      this.batchData.unshift({
        courseId: "",
        courseName: "",
        batchName: "",
        trainerId: "",
        trainerName: "",
        // trainerId: [],
        // trainerName: [],
        batchEmployeesCount: "",
        scheduledDate: '',
        batchStatus: "Scheduled",
        employeesList: [...list],
        batchCreatedBy: this.loginEmployeeId
      })
      this.cdr.detectChanges();
      const element = document.getElementById('targetElement');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
    else {
      this.common.openSnackBar("Already 3 batches there please complete this.", 2, "")
    }
  }

  checkboxallSelect(event: any) {
    this.selectedIndices = [];
    for (let x of this.generalReportList) {
      x.checked = event.checked;

      if (x.checked) {
        this.selectedIndices.push(x);
      } else {
        const selectedIndex = this.selectedIndices.indexOf(x);
        if (selectedIndex !== -1) {
          this.selectedIndices.splice(selectedIndex, 1);
        }
      }
    }
    if (event.checked == false) {
      this.selectedIndices = []
    }
    this.allboxinter = false;
    this.isAllselect = !this.isAllselect;
  }
 
  onCheckboxChange(event: any, index: any) {
    index.checked = event.checked;
    if (event.checked) {
      this.selectedIndices.push(index);
    } else {
      const selectedIndex = this.selectedIndices.indexOf(index);
      if (selectedIndex !== -1) {
        this.selectedIndices.splice(selectedIndex, 1);
      }
    }
    if (this.generalReportList.every((x: any) => x.checked !== true)) {
      this.allboxinter = false;
    }
    else {
      this.allboxinter = true;
    }

    if (this.generalReportList.every((x: any) => x.checked == true)) {
      this.allboxinter = false;
      this.isAllselect = true;
    }
    if (this.generalReportList.every((x: any) => x.checked == false)) {
      this.allboxinter = false;
      this.isAllselect = false;
    }

  }

  cleardateFilter() {
    // this.fromDatevalue = '';
    // this.toDatevalue = '';
    this.setsummaryDateValues();
    this.datefilterActive = false
    this.datefilterActive1 = false
    this.setInitialFromToDate();
    this.getSummarylist();
  }

  batchCoursename(event: any, item: any) {
    item.courseName = event.courseName;
    item.courseId = event.courseId;
  }
  batchName(event: any, item: any) {
    item.batchName = event.target.value
  }
  batchTrainername(event: any, item: any) {
    item.trainerName = event?.username;
    item.trainerId = event?.employeeId;
  }
  scheduleDateselect(event: any, item: any) {
    const eventscheduledDate = event;
    item.scheduledDate = this.formatDate(eventscheduledDate);
  }
  scheduleDateselect1(event: any, item: any) {
    const originalDate = new Date(event);
    item.scheduledDate = this.datepipe.transform(originalDate, 'dd-MM-yyyy');
  }

  formatDate(inputDate: string): string {
    if (!inputDate || isNaN(new Date(inputDate).getTime())) {
      return ''; // Return an empty string when scheduledDate is empty or invalid
    }
    const date = new Date(inputDate);
    // Extract day, month, and year
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // January is 0
    const year = date.getFullYear().toString();

    // Construct the formatted date string (dd-mm-yyyy)
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  showBatchpopup(item: any, ivalue: any) {
    this.ModalPopup1 = true;
    this.selected_PopupData = item;
    this.batchItem = ivalue;
  }

  getWidth() {
    const container: any = document.getElementById("selectContainer")?.clientWidth - 202 + 'px';
    if (container) {
      return container;
    }
  }
  changeTypeAction(type: any, item: any) {
    item.batchStatus = type.type;
  }
  validePopup = false
  async scheduleBatch(item: any, b: any, type: string) {
    this.scheduleParams = JSON.parse(JSON.stringify(item));
    this.scheduleParams.employeesList = this.scheduleParams.employeesList.map(employee => ({ employeeId: employee.employeeId, isDeleted: false, isNewEmployee:true }));
    this.scheduleParams.scheduledDate = this.datepipe.transform(this.scheduleParams.scheduledDate, 'yyyy-MM-dd') || '';;
    // this.scheduleParams.trainerId = this.scheduleParams.trainerId.map(name => `${name}`).join(', ');
    // this.scheduleParams.trainerName = this.scheduleParams.trainerName.map(name => `${name}`).join(', ');
    this.scheduleParams.batchEmployeesCount = this.scheduleParams.employeesList.length;
    this.scheduleParams.courseId = `"${this.scheduleParams.courseId.toString()}"`;
    this.scheduleParams.courseId = this.scheduleParams.courseId.replace(/\"/g, '');
    // if (this.scheduleParams.hasOwnProperty('courseName')) {
    //   delete this.scheduleParams.courseName;
    // }

    // if (this.scheduleParams.hasOwnProperty('batchname')) {
    //   delete this.scheduleParams.batchname;
    // }

    const modifiedParam = this.scheduleParams;
    if (type == 'Scheduled') {
      modifiedParam.batchStatus = 'Scheduled'
    }
    else if (type == 'Draft') {
      modifiedParam.batchStatus = 'Draft'
    }
    //  
    // 
    this.cloneBatchdata = [...this.batchData];
    this.cloneBatchdata.splice(b, 1);
    // Compare objects in the array
    if (this.cloneBatchdata.length == 0) {
      this.ngxloaderService.start();
      const response: any = await this.apiHandler.postData(this.utils.API.POST_VALIDATE_BATCH_EMPLOYEES, modifiedParam, this.destroyed$);
      if (response.payload.length == 0) {
        const response1: any = await this.apiHandler.postData(this.utils.API.POST_CREATE_NEW_BATCH, modifiedParam, this.destroyed$);
        if (response1.payload) {
          this.batchData.splice(b, 1);
          this.ngxloaderService.stop();
          let paylLoad: any = response1.payload
          if (paylLoad.batchStatus == "Draft") {
            this.common.openSnackBar("Batch drafted successfully", 2, "Success")
          }
          else {
            this.common.openSnackBar("Batch created successfully", 2, "Success")
          }
        }
      }
      else {
        this.ngxloaderService.stop();
        this.validePopup = true;
        this.AlreadyscheduledEmployees = response.payload;
        const emp_names = this.AlreadyscheduledEmployees.map(name => `${name.employeeName}`).join(', ');
        // this.common.openSnackBar(`${emp_names} Already scheduled`, 2, "Invalid")
      }

    }
    else {
      for (let i = 0; i < this.cloneBatchdata.length; i++) {
        if (this.compareObjects(this.cloneBatchdata[i], item)) {
          this.common.openSnackBar("This batch data already in the batchlist", 2, 'Invalid')
        }
        else {
          this.ngxloaderService.start();
          const response: any = await this.apiHandler.postData(this.utils.API.POST_VALIDATE_BATCH_EMPLOYEES, modifiedParam, this.destroyed$);
          if (response.payload.length == 0) {
            const response1: any = await this.apiHandler.postData(this.utils.API.POST_CREATE_NEW_BATCH, modifiedParam, this.destroyed$);
            if (response1.payload) {
              this.batchData.splice(b, 1);
              this.ngxloaderService.stop();

              let paylLoad: any = response1.payload
              if (paylLoad.batchStatus == "Draft") {
                this.common.openSnackBar("Batch drafted successfully", 2, "Success")
              }
              else {
                this.common.openSnackBar("Batch created successfully", 2, "Success")

              }
            }

          }
          else {
            this.ngxloaderService.stop();
            this.validePopup = true;
            this.AlreadyscheduledEmployees = response.payload;
            const emp_names = this.AlreadyscheduledEmployees.map(name => `${name.employeeName}`).join(', ');
      
            // const uniqueData = this.removeDuplicates(this.AlreadyscheduledEmployees);
            // this.common.openSnackBar(`${emp_names} already scheduled`, 2, "Invalid")
          }
        }
      }
    }
  }

  compareObjects(obj1: any, obj2: any): boolean {
    // Check the specified properties for equality
    const scheduledDate1 = this.formatDate(obj1.scheduledDate);
    const scheduledDate2 = this.formatDate(obj2.scheduledDate);
    // obj1.trainerId.sort((a: any, b: any) => (a > b) ? 1 : -1);
    // obj2.trainerId.sort((a: any, b: any) => (a > b) ? 1 : -1);

    // const formatTrainer1 = obj1.trainerId.map(name => `'${name}'`).join(',')
    // const formatTrainer2 = obj2.trainerId.map(name => `'${name}'`).join(',')

    const propertiesEqual =
      obj1.courseName === obj2.courseName &&
      scheduledDate1 === scheduledDate2 &&
      obj1.trainerId === obj2.trainerId
      // formatTrainer1 === formatTrainer2;
    if (!propertiesEqual) {
      return false; // If properties don't match, return false
    }


    // Compare the employeesList arrays
    const employeesList1 = JSON.parse(JSON.stringify(obj1.employeesList)) || [];
    const employeesList2 = JSON.parse(JSON.stringify(obj2.employeesList)) || [];

    if (employeesList1.length !== employeesList2.length) {
      return false; // If the employeesList lengths are different, return false
    }
    // Sort and stringify the employeesList arrays for comparison
    const sortedEmployeesList1 = JSON.stringify(employeesList1.sort((a: any, b: any) => (a.employeeId > b.employeeId) ? 1 : -1));
    const sortedEmployeesList2 = JSON.stringify(employeesList2.sort((a: any, b: any) => (a.employeeId > b.employeeId) ? 1 : -1));
    return sortedEmployeesList1 === sortedEmployeesList2;
  }

  addPeopleData(item: any) {
    this.addpeopleArray = item;
    this.showempComponent = true;
  }

  receiveDataFromEmp(data: any) {
    this.receivedpeopleData = data;
    this.oldNumber = 0;
    setTimeout(() => {
      this.showempComponent = false;
    }, 500);
    const transferredData: any = this.receivedpeopleData
    transferredData.forEach((data: any) => {
      // Perform actions for each dropped row data
      if (data) {
        const droppedData = data;
        const existingEmployee = this.addpeopleArray.employeesList.find(
          (employee: any) => employee.employeeId === droppedData.employeeId
        );
        // const istrainerAdd = this.addpeopleArray.employeesList.filter(
        //   (employee: any) => {
        //   return employee.role === 'External Trainer'
        //   }
        // );
        if (existingEmployee) {
          if (existingEmployee.isDeleted === true) {
            existingEmployee.isDeleted = false;
            existingEmployee.employeeName = droppedData.employeeName;

            const updatedCount = this.addpeopleArray.employeesList.filter(
              (employee: any) => employee.isDeleted === false
            );
            this.upDatedEmployeeCount = updatedCount.length;
            this.updateEmployeeList = updatedCount;
          } else {
            this.oldNumber = this.oldNumber + 1;
            this.common.openSnackBar(`${this.oldNumber} Employee(s) already in this batch list`, 2, "");
          }
        }
        // else if(istrainerAdd){
        //   this.trainerNumber = this.trainerNumber + 1;
        //   console.log(this.trainerNumber)
        //   this.common.openSnackBar(`You added Trainer`, 2, "");
        // }
        else {
          this.addpeopleArray.employeesList.unshift(droppedData);
          const updatedCount = this.addpeopleArray.employeesList.filter(
            (employee: any) => employee.isDeleted === false
          );
          this.upDatedEmployeeCount = updatedCount.length;
          this.updateEmployeeList = updatedCount;
        }

        if (this.showPopUP) {
          this.compareDataforUpdate();
        }
     
      }
    });
  }

  batchItem: any;
  deleteBatch(deleteitem: any) {
    this.batchItem = deleteitem
  }

  confirmDelete() {
    if(this.ModalPopup1 == true){
    setTimeout(() => {
      this.ModalPopup1 = false;
      this.batchData.splice(this.batchItem, 1)
    }, 500);
  }
  else{
    this.batchData.splice(this.batchItem, 1)
  }
  }

  // filtercourseList: any[] = [];
  // filterTrainerNamevalues: any[] = [];
  // filtertrainerList: any[] = [];

  // filterStoreCodevalues: any[] = [];
  // filterstorecodeList: any[] = [];

  // filterStoreNamevalues: any[] = [];
  // filterstorenameList: any[] = [];

  // filterEmployeeRolevalues: any[] = [];
  // filteremployeeroleList: any[] = [];

  // courseChange(event: any, filteritem: any) {
  //   filteritem.checked = !filteritem.checked;
  //   this.filtercourseList = this.filterCourseNamevalues.filter((filter: any) => {
  //     return filter.checked == true
  //   }).map((item: any) => {
  //     return item.courseName
  //   })
  // }

  // trainerChange(event: any, filteritem: any) {
  //   filteritem.checked = !filteritem.checked;
  //   this.filtertrainerList = this.filterTrainerNamevalues.filter((filter: any) => {
  //     return filter.checked == true
  //   }).map((item: any) => {
  //     return item.name
  //   })
  // }

  // storecodeChange(event: any, filteritem: any) {
  //   filteritem.checked = !filteritem.checked;
  //   this.filterstorecodeList = this.filterStoreCodevalues.filter((filter: any) => {
  //     return filter.checked == true
  //   }).map((item: any) => {
  //     return item.name
  //   })
  // }

  // storenameChange(event: any, filteritem: any) {
  //   filteritem.checked = !filteritem.checked;
  //   this.filterstorenameList = this.filterStoreNamevalues.filter((filter: any) => {
  //     return filter.checked == true
  //   }).map((item: any) => {
  //     return item.name
  //   })
  // }

  // employeeroleChange(event: any, filteritem: any) {
  //   filteritem.checked = !filteritem.checked;
  //   this.filteremployeeroleList = this.filterEmployeeRolevalues.filter((filter: any) => {
  //     return filter.checked == true
  //   }).map((item: any) => {
  //     return item.name
  //   })
  // }

  onPopoverClose(property: any) {
    // if (property == 'trainerName') {
    //   if ((this.filterRequest.trainers || this.filtertrainerList.length > 0) && !this.deepCompareArrays(this.filterRequest.trainers, this.filtertrainerList)) {
    //     this.resetReportList();
    //     this.filterRequest.trainers = this.filtertrainerList;
    //     this.getReportList();
    //   }
    // }
    // else if (property == 'storeCode') {
    //   if ((this.filterRequest.storeIds || this.filterstorecodeList.length > 0) && !this.deepCompareArrays(this.filterRequest.storeIds, this.filterstorecodeList)) {
    //     this.resetReportList();
    //     this.filterRequest.storeIds = this.filterstorecodeList;
    //     this.getReportList();
    //   }
    // }
    // else if (property == 'store') {
    //   if ((this.filterRequest.storeNames || this.filterstorenameList.length > 0) && !this.deepCompareArrays(this.filterRequest.storeNames, this.filterstorenameList)) {
    //     this.resetReportList();
    //     this.filterRequest.storeNames = this.filterstorenameList;
    //     this.getReportList();
    //   }
    // }
    // else if (property == 'role') {
    //   if ((this.filterRequest.filterRoles || this.filteremployeeroleList.length > 0) && !this.deepCompareArrays(this.filterRequest.filterRoles, this.filteremployeeroleList)) {
    //     this.resetReportList();
    //     this.filterRequest.filterRoles = this.filteremployeeroleList;
    //     this.getReportList();
    //   }
    // }
  }

  assignDDvalue(e: any, item: any) {
    if (e.srcElement.value == '') {
      item.trainerDropdownData = JSON.parse(JSON.stringify(this.trainerNameList))
      this.getAssigneesGenericList(item);
    }

  }
  assignChange(e: any, item: any) {
    const dummyArray = JSON.parse(JSON.stringify(this.trainerNameList))
    if (e.srcElement.value !== '') {
      e.srcElement.value.toLowerCase();
      item.trainerDropdownData = dummyArray.filter((item: any) => {
        return item.username.toLowerCase().includes(e.srcElement.value) || item.employeeId.toLowerCase().includes(e.srcElement.value);
      });

      for (let x of item.trainerDropdownData) {
        let isAlreadySelect = item.trainerName.filter((item: any) => {
          return item == x.username;
        })
        x.checked = (isAlreadySelect.length > 0) ? true : false;
      }
    }
    else {
      this.getAssigneesGenericList(item);
    }
  }

  async getAssigneesGenericList(item: any) {
    item.trainerDropdownData = JSON.parse(JSON.stringify(this.trainerNameList))
    for (let x of item.trainerDropdownData) {
      let isAlreadySelect = item.trainerName.filter((item: any) => {
        return item == x.username;
      })
      x.checked = (isAlreadySelect.length > 0) ? true : false;
    }
    item.trainerDropdownData = item.trainerDropdownData;
  }
  
  optionClicked(event: Event, user: any, item: any) {
    event.stopPropagation();
    this.toggleSelection(event, user, item);
  }

  toggleSelection(e: any, user: any, item: any) {
    user.checked = !user.checked;
    item.trainerName = item.trainerDropdownData.filter((item: any) => {
      return item.checked == true
    }).map((name: any) => {
      return name.username
    })
    item.trainerId = item.trainerDropdownData.filter((item: any) => {
      return item.checked == true
    }).map((name: any) => {
      return name.employeeId;
    })
  }

  getinputPlaceholderValue(item: any) {
    this.inputPlaceholderValue = item.trainerName?.map(name => `${name}`).join(', ');
    return this.inputPlaceholderValue;
  }

  removeParams(obj: any, paramsToRemove: string[]): any {
    const newObj = { ...obj }; // Clone the object to avoid modifying the original
    paramsToRemove.forEach(param => {
      if (newObj.hasOwnProperty(param)) {
        delete newObj[param]; // Remove the parameter from the object
      }
    });
    return newObj;
  }

  async batchUpdate(param: any) {
    const response: any = await this.apiHandler.postData(this.utils.API.POST_UPDATE_BATCH, param, this.destroyed$);
    if (response.payload) {
      this.ngxloaderService.stop();
      this.showPopUP = false;
      this.selectedTab = 1;
      this.scrollevent = true;
      this.currentpageNumber = 0;
      this.scrolleventDraft = true;
      this.currentpageNumberDraft = 0
      this.getSummarylist();
      this.getUpcominglist();
      this.getDraftlist();
      if (response.payload.batchStatus == 'Cancelled') {
        this.common.openSnackBar("Batch cancelled successfully", 2, "Success")
      }
      else if (response.payload.batchStatus == 'Scheduled') {
        this.common.openSnackBar("Batch updated successfully", 2, "Success")
      }

    }
  }

  async validateupdateBatch(param: any) {
    param.batchEmployeesCount = this.upDatedEmployeeCount;
    const paramsToRemove = ['batchHistoryLists'];
    param = this.removeParams(param, paramsToRemove);
    const newParam = JSON.parse(JSON.stringify(param));
    newParam.employeesList = param.employeesList.map((employee: any) => ({ employeeId: employee.employeeId, isDeleted: employee.isDeleted, isNewEmployee:employee.isNewEmployee }));
    this.ngxloaderService.start();
    const response: any = await this.apiHandler.postData(this.utils.API.POST_VALIDATE_BATCH_EMPLOYEES, newParam, this.destroyed$);
    if (response.payload.length == 0) {
      const updateParam = JSON.parse(JSON.stringify(param));
      updateParam.employeesList = param.employeesList.map(employee => ({ employeeId: employee.employeeId, isDeleted: employee.isDeleted, isNewEmployee:employee.isNewEmployee }));
      this.batchUpdate(updateParam)
    }
    else {
      this.ngxloaderService.stop();
      this.validePopup = true;
      this.AlreadyscheduledEmployees = response.payload;
      const emp_names = this.AlreadyscheduledEmployees.map(name => `${name.employeeName}`).join(', ');
      // this.common.openSnackBar(`${emp_names} already in another schedule`, 2, "Invalid")
    }
  }

  async getSummarylist() {
    this.summaryList = [];
    this.summaryShimmer = true;
    const param = {
      "country": this.loginEmployeeCountry,
      "isManager": this.loginEmployeeManager,
      "roleCode": this.loginEmployeeRoleCode,
      "regionId": this.loginEmployeeRegionId,
      "storeId": this.loginEmployeeStoreId,
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_GET_SUMMARY_LIST, param, this.destroyed$);
    if (response.payload) {
      this.summaryList = response.payload;
    }
    this.summaryShimmer = false
  }

  filterbyListstatus(event: any) {
    this.currentpageNumber = 0;
    this.scrollevent = true;
    this.batchStatusList = event.filterId;
    this.cardShimmer = true;
    this.getUpcominglist();
  }
  currentpageNumber = 0;
  currentpageNumberDraft = 0
  async getUpcominglist() {
    this.upcomingListData = [];
    this.cardShimmer = true;
    const param = {
      batchStatusList: [this.batchStatusList],
      isTrainer: this.loginEmployeeIstrainer,
      userRoleCode:this.loginEmployeeRoleCode,
      userEmployeeId: this.loginEmployeeId,
      pageNo: 0,
      pageSize: 7
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_EVENT_UPCOMING_BATCH_LIST, param, this.destroyed$);
    if (response.payload) {
      this.upcomingListData = response.payload;
      this.cardShimmer = false;
    }
  }

  async getDraftlist() {
    this.draftListData = [];
    this.cardShimmer1 = true;
    const param = {
      batchStatusList: [2],
      isTrainer: this.loginEmployeeIstrainer,
      userEmployeeId: this.loginEmployeeId,
      userRoleCode:this.loginEmployeeRoleCode,
      pageNo: 0,
      pageSize: 7
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_EVENT_DRAFT_BATCH_LIST, param, this.destroyed$);
    if (response.payload) {
      this.draftListData = response.payload;
      this.cardShimmer1 = false;
    }
  }

  updateReadonly = false
  async getscheduledDetails(item: any) {
    this.ngxloaderService.start();
    this.updateReadonly = false;
    this.saveButtonshow = false;
    this.viewDetails = false;
    this.showPopUP = true;
    this.viewHistory = false;
    this.inactiveChanged = false;
    const currentDate: Date = new Date();
    const currentFormatDate = this.datepipe.transform(currentDate,'yyyy-MM-dd')

    if(item.batchStatus == 'Assigned' && (currentFormatDate !== item.scheduledDate)){
      this.updateReadonly = true
    }

    const param = {
      "courseId": item.courseId,
      "batchId": item.batchId,
      "isManager": this.loginEmployeeManager,
      "userEmployeeId": this.loginEmployeeId
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_GET_BATCH_INFO, param, this.destroyed$);
    let sampleJson: any = response.payload;
    if (response.payload) {
      this.viewDetails = true;
      // sampleJson.trainerId = sampleJson.trainerId.split(',').map(item => item.trim());
      // sampleJson.trainerName = sampleJson.trainerName.split(',').map(item => item.trim());

      this.upDatedEmployeeCount = sampleJson.employeesList?.length;
      sampleJson.employeesList = sampleJson.employeesList?.map((list: any) => {
        return { ...list, isNewEmployee: false };
      })
      this.detailsData = sampleJson;
      this.detailsData.scheduledDate = this.datepipe.transform(this.detailsData.scheduledDate, 'dd-MM-yyyy'); // Apply DatePipe to format
      this.updateEmployeeList = JSON.parse(JSON.stringify(this.detailsData.employeesList));
      // this.detailsData.trainerDropdownData = JSON.parse(JSON.stringify(this.trainerNameList))
      // for (let x of this.detailsData.trainerDropdownData) {
      //   let isAlreadySelect = this.detailsData.trainerName.filter((item: any) => {
      //     return item == x.username;
      //   })
      //   x.checked = (isAlreadySelect.length > 0) ? true : false;
      // }
      this.previousDetailsData = JSON.parse(JSON.stringify(this.detailsData));
      this.ngxloaderService.stop()
    }

  }

  updateBatch(value: any, type: string) {
    const updateParams = JSON.parse(JSON.stringify(value));

    if (type == "Cancelled") {
      updateParams.batchStatus = 'Cancelled'
    }
    else if (type == "Scheduled") {
      updateParams.batchStatus = 'Scheduled'

    }
    // updateParams.trainerId = updateParams.trainerId.map(name => `${name}`).join(',');
    // updateParams.trainerName = updateParams.trainerName.map(name => `${name}`).join(',');
    updateParams.batchEmployeesCount = updateParams.employeesList.length;
    updateParams.courseId = `"${updateParams.courseId.toString()}"`;
    updateParams.courseId = updateParams.courseId.replace(/\"/g, '');
    // if (updateParams.hasOwnProperty('courseName')) {
    //   delete updateParams.courseName;
    // }

    // if (updateParams.hasOwnProperty('batchname')) {
    //   delete updateParams.batchname;
    // }

    // const paramsToRemove = ['trainerDropdownData'];
    // const modifiedParam = this.removeParams(updateParams, paramsToRemove);
    const modifiedParam = updateParams;
    let dateParts = modifiedParam.scheduledDate.split('-');
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    dateParts = modifiedParam.scheduledDate;
    modifiedParam.scheduledDate = formattedDate;
    this.validateupdateBatch(modifiedParam);
  }

  deleteEmployeefromUpdate(item: any, emp: any) {
    if (emp.isNewEmployee == false) {
      emp.isDeleted = true
    }
    else {
      const deleteIndex = item.indexOf(emp);
      if (deleteIndex !== -1) {
        item.splice(deleteIndex, 1)
      }
    }

    const Count = item.filter((count: any) => {
      return count.isDeleted == false
    })
    this.upDatedEmployeeCount = Count.length;
    this.updateEmployeeList = Count;
    // let noRemove = this.fixedEmployeeData.filter((item:any)=>{
    //   return item.employeeId == emp.employeeId
    // })
    // if(noRemove.length > 0){
    //   emp.isDeleted = 1
    // }
    // else{
    //   const deleteIndex = item.indexOf(emp);
    //   if (deleteIndex !== -1) {
    //     item.splice(deleteIndex, 1)
    //   }
    // }

  }

  gotoSummarypage() {
    this.createBatch = false;
    this.selectedTab = 1;
    this.currentpageNumber = 0;
    this.scrollevent = true;
    this.scrolleventDraft = true;
    this.currentpageNumberDraft = 0
    this.getSummarylist();
    this.getDraftlist();
    this.getUpcominglist();
    this.setsummaryDateValues();
    this.datefilterActive = false;
    this.datefilterActive1 = false;
    this.batchData = [];
    for (let x of this.generalReportList) {
      x.checked = false;
    }
    for (let x of this.cloneGeneralReportList) {
      x.checked = false;
    }
    this.resetFilters();
  }

  isDetailsDataUpdated(oldData: any, newData: any): boolean {
    return JSON.stringify(oldData) !== JSON.stringify(newData);
  }

  compareObjectsFieldsonly(obj1: any, obj2: any): boolean {
    // Check the specified properties for equality
    // const scheduledDate1 = this.formatDate(obj1.scheduledDate);
    // const scheduledDate2 = this.formatDate(obj2.scheduledDate);
    // obj1.trainerId.sort((a: any, b: any) => (a > b) ? 1 : -1);
    // obj2.trainerId.sort((a: any, b: any) => (a > b) ? 1 : -1);

    // const formatTrainer1 = obj1.trainerId.map(name => `'${name}'`).join(',')
    // const formatTrainer2 = obj2.trainerId.map(name => `'${name}'`).join(',')

    const propertiesEqual =
      obj1.courseName === obj2.courseName &&
      obj1.batchName === obj2.batchName &&
      obj1.scheduledDate === obj2.scheduledDate &&
      obj1.trainerId === obj2.trainerId;
      // formatTrainer1 === formatTrainer2;
    if (!propertiesEqual) {
      return false; // If properties don't match, return false
    }
    else {
      return true
    }
  }

  compareEmployeeArrays(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }
  
    const employeeIdsArray1 = array1.map(employee => employee.employeeId);
    const employeeIdsArray2 = array2.map(employee => employee.employeeId);
  
    // Sort the arrays
    employeeIdsArray1.sort();
    employeeIdsArray2.sort();
  
    // Compare the sorted arrays
    return JSON.stringify(employeeIdsArray1) === JSON.stringify(employeeIdsArray2);

  }

  compareDataforUpdate() {
    if (this.compareObjectsFieldsonly(this.previousDetailsData, this.detailsData) && this.compareEmployeeArrays(this.previousDetailsData.employeesList, this.updateEmployeeList)) {
      this.saveButtonshow = false;
    }
    else {
      this.saveButtonshow = true;
    }
  }

  async deleteDraft(item: any) {
    let param = {
      batchId: item.batchId,
      courseId: item.courseId
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_DELETE_DRAFT_BATCH, param, this.destroyed$);
    if (response.payload) {
      this.getDraftlist();
      this.showPopUP = false;
      this.common.openSnackBar("Draft deleted successfully", 2, "Success");
    }
  }

  async viewHistorydata(history: any) {
    this.ngxloaderService.start()
    const param = {
      batchId: history.batchId,
      revisionId: history.revision
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_GET_BATCH_HISTORY, param, this.destroyed$);
    if (response.payload) {
      this.historyData = response.payload;
      this.viewHistory = true;
      setTimeout(() => {
        this.historyTableview = false
      }, 500);
      this.ngxloaderService.stop()
    }
  }

  getMail(e: any) {
    if (this.form.valid) {
      this.mailIdsend = e.target.value;
    }
  }

  // getMailexport(e: any) {
  //   if (this.form.valid) {
  //     this.mailIdexport = e.target.value;
  //   }
  // }

  addMailId() {
    if (this.form.valid) {
      let existing = this.Emails.filter((item: any) => {
        return item == this.mailIdsend
      })

      if (existing.length > 0) {
        this.common.openSnackBar("Mail id already exists", 2, "Invalid")
      }
      else {
        this.Emails.push(this.mailIdsend);
        this.mailIdsend = "";
        this.cdr.detectChanges();
      }
    }
  }

  // addMailIdexport() {
  //   if (this.form.valid) {
  //     let existing = this.Emails.filter((item: any) => {
  //       return item == this.mailIdexport
  //     })

  //     if (existing.length > 0) {
  //       this.common.openSnackBar("Mail id already exists", 2, "Invalid")
  //     }
  //     else {
  //       this.Emails.push(this.mailIdexport);
  //       this.mailIdexport = "";
  //       this.cdr.detectChanges();
  //     }
  //   }
  // }

  removeEmail(m: any) {
    let temp = this.Emails.splice(m, 1);
  }

  cancelMail() {
    this.mailIdsend = '';
    this.mailIdexport = '';
    this.Emails = [];
    this.cdr.detectChanges();
  }

  async sendMail() {
    this.common.openSnackBar('Generating the report. Will send to the mail shortly.', 2, "");
    this.filterRequest.emailIds = this.Emails;
    this.filterRequest.report = true;
    delete this.filterRequest.page;
    const params = this.filterRequest;
    this.Emails = [];
    this.mailIdsend = '';
    const response: any = await this.apiHandler.postData(this.utils.API.POST_EXPORT_MAIL_F2F, params, this.destroyed$);
    if (response.payload) {
      this.filterRequest.emailIds = [];
    }
  }

  async sendMailbatchExport() {
    // this.common.openSnackBar('Generating the report. Will send to the mail shortly.', 2, "");
    // this.filterRequest.emailIds = this.Emails;
    // this.filterRequest.report = true;
    // delete this.filterRequest.page;
    const params = {
      batchId : this.exportId
    };
    // this.Emails = [];
    // this.mailIdexport = '';
    const response: any = await this.apiHandler.postData(this.utils.API.POST_BATCH_EXPORT, params, this.destroyed$);
    if (response.payload) {
      if(response.payload == true){
        this.common.openSnackBar("Batch details mail sent successfully",2,"Success")
      }
    }
  }

  closeEmppopup() {
    setTimeout(() => {
      this.showempComponent = false;
    }, 500);
  }

  async getActivecount() {
    this.summaryShimmer = true;
    const intId = this.userId;
    const numberValue = parseInt(intId, 10);
    const param = {
      "userId": numberValue,
      "isManager": this.loginEmployeeManager
    }
    const response: any = await this.apiHandler.postData(this.utils.API.POST_GET_ACTIVE_COUNT, param, this.destroyed$);
    if (response.payload) {
      this.activeData = response.payload;
      this.summaryShimmer = false
    }
  }
  recurringcourseData:any[] = [];
  recurring = false;
  recurringEmpId:any;
  recurringEmpName:any
  async getcourseVersion(rowData:any){
    this.recurringcourseData = [];
    this.ngxloaderService.start();
    this.recurring = true;
    this.recurringEmpId = rowData.employeeId;
    this.recurringEmpName = rowData.userName;
    const params = {
      "userId" : rowData.userId,
      "courseId" : rowData.courseId
    }

    const response: any = await this.apiHandler.postData(this.utils.API.POST_GET_RECURRING_COURSE, params, this.destroyed$);
    if (response.payload) {
      this.recurringcourseData = response.payload;
      this.ngxloaderService.stop();
    }

  }

  empHistoryData = [
    {
      courseName:"New Course 1"
    },
    {
      courseName:"New Course 2"
    },
    {
      courseName:"New Course 3"
    },
    
  ]
  closeRecurring(){
    setTimeout(() => {
      this.recurring = false
    }, 500);
  }
  closeAlert(){
    this.validePopup = false;
    this.AlreadyscheduledEmployees = [];
  }
   selectedTab = 1
   changeTable1(){
    if(this.selectedTab !== 1){
    this.selectedTab = 1;
    this.getSummarylist();
    }
  }
  changeTable2(){
    if(this.selectedTab !== 2){
    this.selectedTab = 2;
    this.getActivecount();
    }
  }
  scrollevent = true;
  async onScroll(event:any){
    if(this.scrollevent){
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.currentpageNumber = this.currentpageNumber + 7;
      const param = {
        batchStatusList: [this.batchStatusList],
        isTrainer: this.loginEmployeeIstrainer,
        userRoleCode:this.loginEmployeeRoleCode,
        userEmployeeId: this.loginEmployeeId,
        pageNo: this.currentpageNumber,
        pageSize: 7
      }
      const response: any = await this.apiHandler.postData(this.utils.API.POST_EVENT_UPCOMING_BATCH_LIST, param, this.destroyed$);
      if (response.payload.length > 0) {
        const scrollData = response.payload;
        for(let x of scrollData){
          this.upcomingListData.push(x)
        }
      }
      else{
        this.scrollevent = false

      }
    }
    }
    // console.log("Scroll Going on")
  }

  scrolleventDraft = true;
  async onScrollDraft(event:any){
    if(this.scrolleventDraft){
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.currentpageNumberDraft = this.currentpageNumberDraft + 7;
      const param = {
        batchStatusList: [2],
        isTrainer: this.loginEmployeeIstrainer,
        userEmployeeId: this.loginEmployeeId,
        userRoleCode:this.loginEmployeeRoleCode,
        pageNo: this.currentpageNumberDraft,
        pageSize: 7
      }
      const response: any = await this.apiHandler.postData(this.utils.API.POST_EVENT_DRAFT_BATCH_LIST, param, this.destroyed$);
      if (response.payload.length > 0) {
        const scrollDataDraft = response.payload;
        for(let x of scrollDataDraft){
          this.draftListData.push(x)
        }
      }
      else{
        this.scrolleventDraft = false
      }
    }
    }
    // console.log("Scroll Going on")
  }
  filterdateValue(event){
    this.filterRequest.searchDateBy = event.key
      if((this.reportFromdate!='' && this.reportFromdate!=null && this.reportFromdate!=undefined ) && (this.reportTodate!='' && this.reportTodate!=null && this.reportTodate!=undefined)){
        this.resetReportList();
        this.getReportList();
      }
  }
  cleardisable = true;
  inactiveChanged = false;
  valueChanged(){
    this.inactiveChanged = true
  }
  datefilterActive= false;
  datefilterActive1= false;

  DefaultfromDate:any;
  DefaulttoDate:any
  setsummaryDateValues(){
    const currentDatebefore = new Date();
    currentDatebefore.setDate(currentDatebefore.getDate() - 30);

    const currentDateafter = new Date();
    currentDateafter.setDate(currentDateafter.getDate() + 30);
     this.DefaultfromDate = currentDatebefore;
     this.DefaulttoDate = currentDateafter;
     this.fromDatevalue = currentDatebefore;
     this.toDatevalue = currentDateafter;
    //  this.filterwithDate();
    // this.filterwithDate();
  }

  gotof2fReports(summaryData:any){
    // this.reportFromdate = this.fromDatevalue;
    // this.reportTodate = this.toDatevalue;
    this.ngxloaderService.start();
    this.searchDateBy = 'expiredDate';
    this.filterRequest.searchDateBy = 'expiredDate';
    this.reportFromdate = this.datepipe.transform(this.fromDatevalue, 'yyyy-MM-dd');
    this.reportTodate = this.datepipe.transform(this.toDatevalue, 'yyyy-MM-dd')
    this.filtercourseNameList = this.filtercourseNameList.map((item:any)=>
    item.courseName.toLowerCase() == summaryData.courseName.toLowerCase() ? { ...item,checked:true }:item
    )  
 

  this.selectedOptionsnew = this.filtercourseNameList.filter((item: any) => {
    return item.checked == true;
  }).map(item => item.courseName);

  this.createBatch = true;
  this.resetReportList();
  this.getReportList();
  setTimeout(() => {
    this.picker.datePicker.setStartDate(this.fromDatevalue);
    this.picker.datePicker.setEndDate(this.toDatevalue); 

    this.selectedDateLabel = this.datepipe.transform(this.fromDatevalue, 'dd/MM/yyyy')
    + ' - ' + this.datepipe.transform(this.toDatevalue, 'dd/MM/yyyy');
  }, 500);

  }
  
  exportId:any;
  batchExport(id:any){
  this.exportId = id;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyed$.unsubscribe();
    this.subscription.unsubscribe();
  }
}
