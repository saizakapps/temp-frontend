import { filter } from 'rxjs/operators';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { Utils } from '../shared/utils';
import { NgForm } from '@angular/forms';
import _ from 'underscore';
import * as __ from 'lodash';
import * as $ from 'jquery';
import { CommonService } from '../shared/services/common.services';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild('form', { static: false }) public form: NgForm;
  @ViewChildren(NgbPopover) popovers: QueryList<NgbPopover>;

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  /* Report Variables */
  weeklyReportId: any;
  reportName: any;
  frequency: any;
  reportScheduleFilter: any

  /* Hierarchy table variables */
  countryList: any = [];
  cloneCountryList: any = [];
  scheduleCountryList: any = [];
  cloneScheduleCountryList: any = [];
  roleLevelList: any = [];
  cloneRoleLevelList: any = [];
  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;
  selectedStoreCount: any;
  selectedLevelCount: any;
  selectedScheduleStoreCount: any;
  selectedCountryDropDown: any = [];
  selectedScheduleCountryDropDown: any = [];
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
  filter: any = [];
  scheduleFilter: any = [];
  mailIds: any = [];

  /* date picker variables */
  searchByDatelist: any = [{ name: 'Creation Date' }];
  filterDateOption: any = { ...this.utils.DateRangePickerConfig }
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
    courseType: 'All',
    level: 'All',
    role: 'All',
    employeeStatus: 'All'
  };
  availableFilter: any = {
    courseType: [{ name: 'All', key: 'All' }],
    courseName: [{ name: 'All', key: 'All' }]
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
  searchDateBy: any = 'dateOfJoining';

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
  recordFound:boolean = false;

  statusList: any;

  mailTrigger: any;

  destroyed$: Subject<void> = new Subject<void>();
  showShimmer:boolean = false;
  shimmerWidth:any;
  constructor(
    public utils: Utils,
    public ngxService: NgxUiLoaderService,
    private apiHandler: ApiHandlerService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef,
    private emitService: CommonService
  ) { }

  ngOnInit(): void {
    this.getModuleAccess();
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.isManager = this.userDetails.manager === true; //this.userDetails.portalRole?.toLowerCase() === 'manager';
    if (this.isManager) {
      this.viewTypes = [{ name: 'Outstanding report', key: 'outstandingView' }, { name: 'All training report', key: 'reportView' }];
      this.viewType = 'outstandingView';
      this.constructCRSJson();
    }
    console.log('isManager', this.isManager);
    this.reportsColumns = this.utils.TABLE_HEADERS.REPORTS_TABLE;
    this.reportsColumnsToDisplay = this.reportsColumns.map((col: { name: any; }) => col.name);
    this.outstandingReportsColumns = this.utils.TABLE_HEADERS.OUTSTANDING_REPORTS_TABLE;
    this.outstandingReportsColumnsToDisplay = this.outstandingReportsColumns.map((col: { name: any; }) => col.name);
    this.frequencyList = this.utils.ddOptions.DD_LABELS.frequencyDD;
    this.searchLabels = this.utils.ddOptions.DD_LABELS.employeeSearch;
    this.searchDateList = this.utils.ddOptions.DD_LABELS.searchDateList;
    this.getCourseTypes();
    this.getCourseName();
    this.getRoleGroup();
    if (!this.isManager) {
      this.getAllCountries();
    }
    this.getExistingReportConfig();
    this.getUserDetails();
    // this.getFilterLists();
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-R');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }
  /* Toggle change */
  toggleView() {
    this.resetFilters();
    this.resetColumnFilter();
    this.resetReportList();
    console.log('toggleView');
    this.getReportList();
  }

  /* Get user details */
  async getUserDetails() {
    /* const response: any = await this.apiHandler.getData(this.utils.API.GET_USER_DETAILS, this.userDetails.id, this.destroyed$);
    localStorage.setItem('userDetails', JSON.stringify(response.payload || {})); */
    this.toggleView();
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
    console.log('countries>>>>>>>>>>', countries);
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
  async getCourseTypes() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_COURSE_TYPES, null, this.destroyed$);
    this.courseTypes = response.payload;
    this.courseTypes.forEach(category => {
      this.availableFilter.courseType?.push({ name: category?.courseTypeDesc, key: category?.courseTypeDesc });
    });
    // this.ngxService.stop();
  }

  /* Get course name */
  async getCourseName() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_COURSE_NAME, null, this.destroyed$);
    this.courseTypes = response.payload;
    this.courseTypes.forEach(category => {
      this.availableFilter.courseName?.push({ name: category?.courseName, key: category?.courseName });
    });
    // this.ngxService.stop();
  }

  /* Get role group */
  async getRoleGroup() {
    // this.ngxService.start();
    this.showShimmer =true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, '', this.destroyed$);
    let roleGroup = _.sortBy(response?.payload || [], 'sequenceId');
    let roleLevel = [];
    roleGroup.forEach(element => {
      if (element.child) {
        element.id === 7 ? roleLevel.push(element) : roleLevel = roleLevel.concat(_.sortBy(element.child, 'sequenceId'));
      }
    });
    this.roleLevelList = [...roleLevel];
    this.cloneRoleLevelList = $.extend(true, [], this.roleLevelList);
    this.levelCount = this.getCount(this.roleLevelList, 0);
    // this.ngxService.stop();
  }

  /* Get All Country Region Store */
  async getAllCountries() {
    // this.ngxService.start();
    this.showShimmer =true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, '', this.destroyed$);
    this.countryList = [...this.emitService.sortRegion(response?.payload || [])];
    this.cloneCountryList = $.extend(true, [], this.countryList);
    this.scheduleCountryList = [...this.emitService.sortRegion(response?.payload || [])];
    this.cloneScheduleCountryList = $.extend(true, [], this.countryList);
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

  /* Get existing report config list */
  async getExistingReportConfig() {
    this.ngxService.start();
    const response: any = await this.apiHandler.postData(this.utils.API.GET_EXISTING_REPORTS_CONFIG, {userId: this.userDetails.id}, this.destroyed$);
    const weeklyReportList: any = response.payload || [];

    this.allWeeklyReportList = weeklyReportList.filter(element => element.allTrainingReport);
    this.allWeeklyReportList.unshift(
      {
        "reportId": null,
        "reportName": "New"
      }
    )
    this.cloneAllWeeklyReportList = $.extend(true, [], this.allWeeklyReportList);

    this.outstandingWeeklyReportList = weeklyReportList.filter(element => !element.allTrainingReport);
    this.outstandingWeeklyReportList.unshift(
      {
        "reportId": null,
        "reportName": "New"
      }
    )
    this.cloneOutstandingWeeklyReportList = $.extend(true, [], this.outstandingWeeklyReportList);

    this.ngxService.stop();
  }

  /* Call API if header filter change */
  callGetFilteredList(type: any, event?: any, isPopup?: boolean) {
    console.log('callGetFilteredList');
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
    if (type === 'countries' || type === 'scheduleCountry' && event === false) {
      const tempArr = this.buildSelectedDropDownHierarchy(type === 'countries' ? this.countryList : this.scheduleCountryList);
      if ((this.filterRequest.countries || tempArr.length > 0) && !this.deepCompare(this.filterRequest.countries, tempArr)) {
        this.filterRequest.countries = tempArr;
        if (!isPopup) {
          this.resetReportList();
          this.getReportList();
        }
      }
    }
    /* Bind searchBy in request */
    if ((type === 'search' && !event || type === 'search' && event.key === "Enter") && this.filterRequest.searchText !== this.searchTextModal) {
      if (this.checkMinimumChar(3, this.searchTextModal?.length)) {
        return;
      }
      this.resetReportList();
      this.filterRequest.searchText = this.searchTextModal;
      this.filterRequest.searchBy = this.searchBy;
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
    if (doc.scrollHeight > doc.clientHeight && (doc.scrollTop + doc.clientHeight > doc.scrollHeight - 5) && this.allowCall && this.nextPage) {
      console.log(this.showShimmer)
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
    console.log('getReportList');
    // this.ngxService.start();
    if(document.getElementById("reports-container-table")){
    const doc: any = document.getElementById("reports-container-table")?.clientWidth;
    this.shimmerWidth = doc;
    }
    this.showShimmer = true;
    console.log(this.showShimmer)
    this.recordFound = false
    this.filterRequest.page = this.paginationIndex;
    this.filterRequest.allTrainingReport = this.viewType === 'reportView' ? true : false;
    this.filterRequest.admin = this.userDetails.learnerRole === 'SA';
    const params = this.filterRequest;
    console.log(this.filterRequest);
    const response: any = await this.apiHandler.postData(this.utils.API.GET_REPORTS, params, this.destroyed$);
    this.nextPage = response.payload.length > 0 && response.payload[0].nextPage;
    if (this.viewType === 'reportView') {
      this.showShimmer = true;
      this.generalReportList = [];
      const tempGeneralReportList = __.flatten(this.constructReportList(response, 0, scrollDirection));      
      this.generalReportList =  [...tempGeneralReportList];
      this.cloneGeneralReportList = [...this.generalReportList];
    } else if (this.viewType === 'outstandingView') {
      this.showShimmer = true;
      this.outstandingReportsList = [];
      const tempOutstandingReportsList = __.flatten(this.constructReportList(response, 0, scrollDirection));      
      this.outstandingReportsList = [...tempOutstandingReportsList];
      this.cloneOutstandingReportsList = [...this.outstandingReportsList];
    }
    // this.getFilterLists();
    this.recordFound = true
    this.showShimmer = false;
    console.log(this.showShimmer)
    // this.ngxService.stop();
    // this.applyListingFilter();
  }

  stopLoader() {
    const doc: any = document.querySelector("#reports-container")
    if (doc.scrollHeight > doc.clientHeight){
      // this.ngxService.stop();
      //  this.showShimmer = false;
      console.log('loader stop................');
    }
  }

  constructReportList(response: any, pageIndex: any, scrollDirection: any) {
    /* if (this.reportList.length < 3) {
      this.reportList.push([...response.payload]);
    } else {
      if (scrollDirection === 'scrollDown' && response.payload.length > 0) {
        this.reportList.splice(0, 1);
        const doc: any = document.querySelector("#reports-container");
        doc.scrollTop = doc.scrollHeight;
        this.reportList.push([...response.payload]);
      } else if (scrollDirection === 'scrollUp') {
        this.reportList.splice(2, 1);
        const doc: any = document.querySelector("#reports-container");
        doc.scrollTop = response.payload.length - 95;
        console.log('scrollTop', doc.scrollTop);
        this.reportList.unshift([...response.payload]);
      }
    } */
    if (response.payload.length > 0) {
      this.reportList.push([...response.payload]);
    }
    this.allowCall = true;
    console.log('reportList', this.reportList);
    return this.reportList;
  }

  /* Select All from drop down list */
  selectAll(event: any, list: any, type: any) {
    console.log('selectAll');
    /* list.forEach(element => {
      this.selectionToggle(event.checked, element, type);
    }); */

    this.changeObjProperty(list, 'selectStatus', event.checked ? 'checked' : 'unchecked');
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : type === 'scheduleCountry' ? this.filterUpdate(this.scheduleCountryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : type === 'scheduleCountry' ? this.calcSelectedStore('scheduleCountry') : this.calcSelectedLevel();
  }

   /* Filter update once drop down value selected */
   filterUpdate(ddList: any, type: any) {
    console.log('filterUpdate')
    let tempSelected = [];
    for (let country of ddList) {
      this.selectedDropDown(country, tempSelected, type);
    }
    type === 'country' ? this.selectedCountryDropDown = [...tempSelected] : type === 'scheduleCountry' ? this.selectedScheduleCountryDropDown = [...tempSelected] : this.selectedRoleGroupDropDown = [...tempSelected];
  }

  /* create selected drop down array */
  selectedDropDown(obj: any, tempArr: any, type: any) {
    if (obj.selectStatus === 'checked') {
      type === 'country' || type === 'scheduleCountry' ? tempArr.push(obj.countryRegionStoreId) : tempArr.push(obj.roleGroupLevelId);
    } else if (obj.selectStatus === 'mixed') {
      for (let child of obj.child) {
        this.selectedDropDown(child, tempArr, type);
      }
    } else if (obj.selectStatus === 'unchecked') {
      type === 'country' || type === 'scheduleCountry' ? tempArr.filter(temp => temp !== obj.countryRegionStoreId) : tempArr.filter(temp => temp !== obj.roleGroupLevelId);
    }
  }

  /* Select single property from drop down list */
  selectionToggleLeaf(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : type === 'scheduleCountry' ? this.filterUpdate(this.scheduleCountryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : type === 'scheduleCountry' ? this.calcSelectedStore('scheduleCountry') : this.calcSelectedLevel();
  }

  /* Select Multiple properties */
  selectionToggle(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.changeObjProperty(node.child, 'selectStatus', node.selectStatus);
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : type === 'scheduleCountry' ? this.filterUpdate(this.scheduleCountryList, type) : this.filterUpdate(this.roleLevelList, type);
    type === 'country' ? this.calcSelectedStore() : type === 'scheduleCountry' ? this.calcSelectedStore('scheduleCountry') : this.calcSelectedLevel();
  }

  /* Update selection Status in List */
  updateSelectionstatus(type) {
    let listArray = [];
    if (type === 'roleGroup') {
      listArray = this.roleLevelList;
    } else if (type === 'country') {
      listArray = this.countryList;
    } else if (type === 'scheduleCountry') {
      listArray = this.scheduleCountryList;
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

  calcSelectedStore(type?: any) {
    this.selectedStoreCount = 0;
    this.selectedScheduleStoreCount = 0;
    type === 'scheduleCountry' ? this.selectedScheduleStoreCount = this.getSelectedChildCount(this.scheduleCountryList, this.selectedStoreCount) : this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    return this.selectedScheduleStoreCount;
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

  /* date change event */
  dateRangeChange(event, isPopup) {
    console.log('dat eve', event);
    if (isPopup) {
      this.selectedPopupDateLabel = event.label === 'Custom Range' ? event.start.format('DD-MM-yyyy')
        + ' to ' + event.end.format('DD-MM-yyyy') : event.label;
    } else {
      this.selectedDateLabel = event.label === 'Custom Range' ? event.start.format('DD-MM-yyyy')
        + ' to ' + event.end.format('DD-MM-yyyy') : event.label;
    }
    this.filterRequest.fromDate = event.start.format('yyyy-MM-DD HH:mm:ss');
    this.filterRequest.toDate = event.end.format('yyyy-MM-DD HH:mm:ss');
    this.filterRequest.searchDateBy = this.searchDateBy;
    this.getReportList();
  }

  addEmail() {
    const mail = this.mailId
    this.mailIds?.push(mail);
    this.mailId = '';
  }

  removeEmail(i: any) {
    let tempArr = [];
    tempArr = this.mailIds.splice(i, 1);
  }

  clearDateField() {
    this.selectedDateLabel = '';
    this.filterRequest.fromDate = null;
    this.filterRequest.toDate = null;
    this.filterRequest.searchDateBy = null;
    this.getReportList();
  }

  clearPopupDateField() {
    this.selectedPopupDateLabel = '',
      this.filterRequest.fromDate = null;
    this.filterRequest.toDate = null;
  }

  onChangeScheduleReportFilter(event: any) {
    console.log('onChangeScheduleReportFilter');
    if (event.key === 'outstandingView') {
      /* this.filters.forEach(filter => {
        if (filter.key === 'overdue') {
          filter.checked = true;
        }
      }); */
      this.scheduleFilter.push('overdue');
    } else {
      // this.filters = $.extend(true, [], this.utils.ddOptions.DD_LABELS.filters);
      this.scheduleFilter = [];
    }
  }

  async scheduleReport() {
    // this.ngxService.start();
    this.showShimmer = true;
    let tempFilterReq = this.filterRequest;
    this.filterRequest = {};
    this.filterRequest.countries = tempFilterReq.countries;
    this.filterRequest.page = this.paginationIndex;
    /* this.filterRequest.searchDateBy = tempFilterReq.searchDateBy;
    this.filterRequest.fromDate = tempFilterReq.fromDate;
    this.filterRequest.toDate = tempFilterReq.toDate; */
    this.filterRequest.report = true;
    this.filterRequest.reportId = this.weeklyReportId;
    this.filterRequest.reportName = this.reportName;
    this.filterRequest.frequency = this.frequency;
    this.filterRequest.emailIds = this.mailIds;
    this.filterRequest.filter = this.scheduleFilter;
    this.filterRequest.allTrainingReport = this.viewType === 'reportView' ? true : false;

    console.log(this.filterRequest);

    const params = this.filterRequest;
    const response: any = await this.apiHandler.postData(this.utils.API.SCHEDULE_REPORT, params, this.destroyed$, 'Reports Successfully Scheduled');
    // this.resetReportList();
    this.resetFiltersOnPopup();
    // this.getReportList();
    this.getExistingReportConfig();
    this.disabled = true;
    this.showShimmer = false;
    // this.ngxService.stop();
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
    // this.applyListingFilter();

    if (column.property === 'courseName') {
      this.filterRequest.courseName = items.key === 'All' ? '' : items.key;
    } else if (column.property === 'courseType') {
      this.filterRequest.courseType = items.key === 'All' ? '' : items.key;
    }
    this.getReportList();

    /* if (items.key !== 'All') {
      this.filterRequest.filterBy = column.property;
      this.filterRequest.filterValue = items.key;
    } else {
      this.filterRequest.filterBy = '';
      this.filterRequest.filterValue = '';
    } */
   /*  if (items.key !== 'All') {
      const index = this.filterArray.findIndex(ele => ele.property === column.property);
      if (index === -1) {
        column.value = items.key;
        this.filterArray.push(column);
      } else {
        this.filterArray[index].value = items.key;
      }
    } else {
      const index = this.filterArray.findIndex(ele => ele.property === column.property);
      if (index > -1) {
        this.filterArray.splice(index, 1);
      }
    }
    console.log(this.filterArray); */
  }

  updateSort(sortBy?, sortObj?) {
    this.resetReportList();
    // this.statusPopover.close();
    let list: any = this.viewType === 'reportView' ? this.generalReportList : this.outstandingReportsList;
    const cloneList: any = this.viewType === 'reportView' ? this.cloneGeneralReportList : this.cloneOutstandingReportsList;
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    /* if (this.sortBy === 'Sort By Asc' || this.sortBy === 'Sort By Desc') {
      list = (__.sortBy([...list], [element => {
        if (this.sortByField === 'completionPercentage') {
          return Number(element[this.sortByField]);
        } else {
          return element[this.sortByField];
        }
      }
      ]));
    }
    if (this.sortBy === 'Sort By Desc') {
      list = list.reverse();
    } else if (this.sortBy === 'Reset') {
      list = [...cloneList];
    }
    this.viewType === 'reportView' ? this.generalReportList = [...list] : this.outstandingReportsList = [...list]; */

    if (this.sortBy !== 'Reset') {
     this.filterRequest.filterBy = this.sortByField;
     this.filterRequest.filterValue = this.sortBy === 'Sort By Asc'? 'asc' : 'desc';
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
    // this.updateSort();
  }

  /* Prepare filter list */
  getFilterLists() {
    console.log('getFilterLists');
    if (this.viewType === 'reportView') {
      /* Build level filter courseName */
      this.buildFilterList(this.generalReportList, 'courseName');
      /* Build level filter list */
      this.buildFilterList(this.generalReportList, 'level');
      /* Build role filter list */
      this.buildFilterList(this.generalReportList, 'role');
      /* Build role filter list */
      this.buildFilterList(this.generalReportList, 'employeeStatus');
    } else if (this.viewType === 'outstandingView') {
      /* Build level filter courseName */
      this.buildFilterList(this.outstandingReportsList, 'courseName');
      /* Build level filter list */
      this.buildFilterList(this.outstandingReportsList, 'level');
      /* Build role filter list */
      this.buildFilterList(this.outstandingReportsList, 'role');
      /* Build role filter list */
      this.buildFilterList(this.outstandingReportsList, 'employeeStatus');
    }
  }

  /* Build unique filter data */
  buildFilterList(data, property) {
    const uniqData = _.sortBy(_.compact(_.uniq(_.pluck(data, property))));
    this.availableFilter[property] = uniqData?.map((item) => {
      const temp: any = {};
      temp.name = item;
      temp.key = item;
      return temp;
    });
    if (uniqData.length > 0) {
      this.availableFilter[property].unshift({ name: 'All', key: 'All' });
    }
  }

  async getSuggestedLabels() {
    const params = {
      searchBy: this.searchBy,
      searchText: this.searchTextModal
    }
    const response: any = await this.apiHandler.postData(this.utils.API.GET_SUGGESTED_LABELS, params, this.destroyed$);
    // this.suggestedLabels = response.payload.searchResponse || [];
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
    console.log('masterToggle');
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
    console.log('singleToggle');
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

  updateReportName() {
    this.disabled = false;
    const reportList: any = this.viewType === 'reportView' ? this.allWeeklyReportList : this.outstandingWeeklyReportList;
    for (let ele of reportList) {
      if (ele.reportId === this.weeklyReportId) {
        this.reportName = ele.reportName;
        this.frequency = ele.frequency;
        this.mailIds = ele.emailIds || [];
        if (ele.countries) {
          this.scheduleCountryList = $.extend(true, [], this.cloneScheduleCountryList);
          this.setSelectedCountries(this.scheduleCountryList, ele.countries);
          this.filterRequest.countries = $.extend(true, [], ele.countries);
          this.selectedScheduleCountryDropDown.length = this.calcSelectedStore('scheduleCountry');
        } else {
          this.scheduleCountryList = $.extend(true, [], this.cloneScheduleCountryList);
          this.selectedScheduleCountryDropDown.length = 0;
          this.calcSelectedStore('scheduleCountry');
        }

        if (ele.reportId) {
          ele.filter.forEach(element => {
            const index = this.filters.findIndex(ele => ele.key === element);
            this.filters[index].checked = true;
            this.updateFilterArray();
            if (element === 'overdue') this.reportScheduleFilter = 'outstandingView';
          });
          if (ele.filter.length === 0) this.reportScheduleFilter = 'reportView';
        }
        break;
      }
    }
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

  /* Delete report */
  async deleteReport() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response = await this.apiHandler.deleteData(this.utils.API.DELETE_REPORT, this.weeklyReportId, this.destroyed$);
    if (this.viewType === 'reportView') {
      this.allWeeklyReportList = this.allWeeklyReportList.filter(ele => ele.reportId !== this.weeklyReportId);
    } else if (this.viewType === 'outstandingView') {
      this.outstandingWeeklyReportList = this.outstandingWeeklyReportList.filter(ele => ele.reportId !== this.weeklyReportId);
    }
    this.resetFiltersOnPopup();
    this.showShimmer = false;
    // this.ngxService.stop();
  }

  cancelSchedule() {
    this.disabled = true;
    this.filter = [];
    this.resetFiltersOnPopup();
    this.scheduleCountryList = $.extend(true, [], this.cloneScheduleCountryList);
    this.selectedScheduleCountryDropDown = [];
    if (this.viewType === 'reportView') {
      this.allWeeklyReportList = $.extend(true, [], this.allWeeklyReportList);
    } else if (this.viewType = 'outstandingView') {
      this.outstandingWeeklyReportList = $.extend(true, [], this.outstandingWeeklyReportList);
    }
    this.selectedRoleGroupDropDown = [];
    this.viewType === 'reportView' ? this.allWeeklyReportList = $.extend(true, [], this.cloneAllWeeklyReportList) : this.outstandingWeeklyReportList = $.extend(true, [], this.cloneOutstandingWeeklyReportList);
    this.calcSelectedStore('scheduleCountry');
  }

  async getMailStatus() {
    this.statusList = [];
    this.ngxService.start();
    const response: any = await this.apiHandler.postData(this.utils.API.GET_MAIL_STATUS, {userId: this.userDetails.id}, this.destroyed$);
    this.statusList = response.payload;
    this.ngxService.stop();
  }

  refreshReport() {
    this.resetFilters();
    this.getReportList();
  }

  clearFilters() {
    this.isFilterAvailable = this.selectedRoleGroupDropDown.length === 0 && this.selectedCountryDropDown.length === 0 && !this.selectedDateLabel && this.filter.length === 0 && !this.searchTextModal
    if (this.isFilterAvailable) {
      return;
    }
    this.resetFilters();
    this.resetReportList();
    this.getReportList();
    this.calcSelectedStore();
    this.calcSelectedLevel();
  }

  resetFilters() {
    console.log('resetFilters');
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
    this.searchBy = 'employeeId';
    // this.showShimmer = false;
  }

  resetFiltersOnPopup() {
    this.scheduleCountryList = $.extend(true, [], this.cloneScheduleCountryList);
    this.calcSelectedStore('scheduleCountry')
    this.selectedScheduleCountryDropDown = [];
    this.weeklyReportId = undefined;
    this.filterRequest.report = false;
    this.reportName = '';
    this.frequency = '';
    this.mailIds = [];
    this.mailId = '';
    this.form.reset();
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

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyed$.unsubscribe();
  }
}
