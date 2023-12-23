import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject, catchError, map, takeUntil, throwError } from 'rxjs';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Utils } from '../shared/utils';

import _ from 'underscore';
import * as __ from 'lodash';
import * as $ from 'jquery';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { CommonService } from '../shared/services/common.services';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-f2f-reports',
  templateUrl: './f2f-reports.component.html',
  styleUrls: ['./f2f-reports.component.scss']
})
export class F2fReportsComponent implements OnInit {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  @ViewChild('uploadFileInput', { static: false }) uploadFileInput!: ElementRef;
  @ViewChildren(NgbPopover) popovers: QueryList<NgbPopover>;

  xlsContent: any = [];

  @ViewChild('importProgress', {static: false}) importProgress!: ElementRef;
  @ViewChild('progressDone', {static: false}) progressDone!: ElementRef;

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

  constructor(
    public utils: Utils,
    public ngxService: NgxUiLoaderService,
    private apiHandler: ApiHandlerService,
    private errorHandler: ErrorHandlerService,
    private http: HttpClient,
    private emitService: CommonService
  ) { }

  ngOnInit(): void {
    this.getModuleAccess();
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.isManager = this.userDetails.manager === true; // this.userDetails.portalRole?.toLowerCase() === 'manager';
    if (this.isManager) {
      this.constructCRSJson();
    }
    console.log('isManager', this.isManager);
    this.reportsColumns = this.utils.TABLE_HEADERS.F2F_REPORTS_TABLE;
    this.reportsColumnsToDisplay = this.reportsColumns.map((col: { name: any; }) => col.name);
    this.searchLabels = this.utils.ddOptions.DD_LABELS.employeeSearch;
    this.searchDateList = this.utils.ddOptions.DD_LABELS.searchF2FDateList;
    this.getCourseTypes();
    this.getCourseName();
    this.filterRequest.employeeStatus = 'Active';
    this.getRoleGroup();
    if (!this.isManager) {
      this.getAllCountries();
    }
    this.getUserDetails();
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
  }

  /* Get user details */
  async getUserDetails() {
    /* const response: any = await this.apiHandler.getData(this.utils.API.GET_USER_DETAILS, this.userDetails.id, this.destroyed$);
    localStorage.setItem('userDetails', JSON.stringify(response.payload || {})); */
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
    const response: any = await this.apiHandler.getData(this.utils.API.GET_F2F_COURSE_NAME, null, this.destroyed$);
    this.courseTypes = response.payload;
    this.courseTypes.forEach(category => {
      this.availableFilter.courseName?.push({ name: category?.courseName, key: category?.courseName });
    });
    // this.ngxService.stop();
  }

  /* Get role group */
  async getRoleGroup() {
    // this.ngxService.start();
    this.showShimmer = true;
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, '', this.destroyed$);
    let roleGroup = _.sortBy(response?.payload || [], 'sequenceId');
    let roleLevel = [];
    roleGroup.forEach(element => {
      if (element.child) {
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
    this.countryList = this.emitService.sortRegion(response.payload);
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
    /* Bind searchBy in request */
    if (type === 'search' && this.filterRequest.searchText !== this.searchTextModal) {
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
  shimmerWidth:any;
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
    const response: any = await this.apiHandler.postData(this.utils.API.GET_F2F_REPORTS, params, this.destroyed$);
    this.nextPage = response.payload.length > 0 && response.payload[0].nextPage;
    if (this.viewType === 'reportView') {
      this.showShimmer = true;
      this.generalReportList = __.flatten(this.constructReportList(response, 0, scrollDirection));
      this.cloneGeneralReportList = [...this.generalReportList];
    } else if (this.viewType === 'outstandingView') {
      this.showShimmer = true;
      this.outstandingReportsList = __.flatten(this.constructReportList(response, 0, scrollDirection));
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
    console.log('reportList', this.reportList);
    return this.reportList;
  }

  /* Select All from drop down list */
  selectAll(event: any, list: any, type: any) {
    console.log('selectAll');
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
    this.filterRequest.fromDate = event.start.format('yyyy-MM-DD');
    this.filterRequest.toDate = event.end.format('yyyy-MM-DD');
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
    if (column.property === 'courseName') {
      this.filterRequest.courseName = items.key === 'All' ? '' : items.key;
    } else if (column.property === 'employeeStatus') {
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
    this.importProgress.nativeElement.click();
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
      formData.append('userId', this.userDetails.id);
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
    this.progress = 1;
    new Promise((resolve, reject) => {
      this.http
        .post(url, file, {
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
              this.progressDone.nativeElement.click();
            }
            reject('error');
          });
    });
  }
  /* File Upload area end */

  async import() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_F2F_STATUS, '', this.destroyed$);
    if (response.payload === false) {
      this.uploadFileInput.nativeElement.click()
    } else {
      this.errorHandler.handleAlert('Processing an earlier import file, please try again later')
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

