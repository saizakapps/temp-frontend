import { Component,AfterViewInit, OnInit, ViewChild, ElementRef, HostListener, Output, EventEmitter  } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Utils } from '../../shared/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import _ from 'underscore';
import * as __ from 'lodash';
import { CommonService } from '../../shared/services/common.services';
import { Router } from '@angular/router';
import { CdkDragStart, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { ApiHandlerService } from '../../shared/services/api-handler.service';
import { Subject } from 'rxjs';
import { NgForm, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Console, count } from 'console';
import { ErrorHandlerService } from '../../shared/services/error-handler.service';
import { RequestApiService } from '../../shared/services/incident-services/request-api.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit,AfterViewInit  {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  /* search variables */
  searchEmployee: any = [{ name: 'Employee ID', key: 'employeeId' }, { name: 'Employee Name', key: 'username' }];
  searchBy: any = 'employeeId';
  searchTextValue: any = '';
  roleGroupList: any = [];
  roleList: any = [];
  allRoleList: any = [];

  statusList: any = [{ name: 'Make active' }, { name: 'Temporarily disable' }];
  countryList: any = [];
  regionList: any = [];
  periodRegionList: any = [];
  regionEnable: boolean = true;
  storeEnable: boolean = true;
  storeList: any = [];
  periodStoreList: any = [];
  selectedRoleGroup: any;
  selectedRole: any;
  selectedStatus: any;
  selectedCountry: any;
  selectedRegion: any;
  countryName: any;
  selectedStore: any;
  roleselection = 'All';
  managerList: any = [];
  selectedRowData: any = [];
  employeeStatusId: any = [];
  selectedCountryDropDown: any = [];
  selectedRoleGroupDropDown: any = [];
  selectedCount: any = [];
  /*create user detail */
  userDetail: any = {};
  cloneUserDetail: any = {};
  userDetailValue: any = {};

  // username: "", mobile: "", email: "", dateOfJoining: "", role: "", roleId: "",
  //  country: "", countryId: "", region: "", regionId: "", store: "", storeId: "", reportingManager: ""
  /*Linking Employee Details */
  employeeDetailLink: any = { employeeId: "", username: "", mobile: "", email: "", role: "", reportingManager: "", country: "", region: "", store: "" };
  proEmployeeDetailLink: any = {};
  proEmpDetail: any = [];
  employeedIdandName: any = [];
  allUserData: any = [];
  /* date picker variables */
  searchByDatelist: any = [{ name: 'Date of Joining', key: 'dateOfJoining' }];
  filterDateOption: any = { ...this.utils.DateRangePickerConfig }
  dateBy: any = 'dateOfJoining';
  filteredDate: any = {
    fromDate: '',
    toDate: '',
  };
  selectedDateLabel: any = 'Last 1 Month';

  employeeColumns: any = [];
  employeeList: any = [];
  cloneEmployeeList: any = [];

  employeeDateFilterList: any = [];
  selection = new SelectionModel(true, []);

  suggestedColumns: any = [];
  suggestedColumnsToDisplay: any = [];
  roleCourseDetails: any = [];
  suggestedPayloadObj: any = {};
  suggestedUserIdObj: any = {};
  confirmationPayloadObj: any = {};
  confirmationCourseList: any = [];
  suggestDeletePayloadObj: any = {};
  suggestSelectedValues: any = [];
  managerConfirmPayloadObj: any = {};
  suggestButtonEnabled: any = true;

  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;

  roleGroup: any = {};
  suggestRole: any = {};
  countryRegionStore: any = {};
  managerListData: any = {};
  date = new FormControl(moment());

  /* status */
  currentFilters: any = {
    role: [],
    /* country: [],
    region: [],
    store: [], */
    employeeStatus: 'All',
    // sfEmployee: 'All',
    active: 'Active',
    appStatus: 'All',

  };

  availableFilter: any = {
    'active': [{ name: 'All', key: 'All' }, { name: 'Active', key: 'Active' }, { name: 'Temporarily disabled', key: 'Inactive' }],
    'employeeStatus': [{ name: 'All', key: 'All' }, { name: 'Active', key: 'Active' }, { name: 'Retired', key: 'Retired' }, { name: 'Terminated', key: "Terminated" }],
    'appStatus': [{ name: 'All', key: 'All' }, { name: 'Invited', key: 'Invited' }, { name: 'Blank', key: 'Blank' }],
    'sfEmployee': [{ name: 'All', key: 'All' }, { name: 'SF', key: true }, { name: '360', key: false }]
  };

  /* sort by filter variables */
  sortBy: any = 'Sort By Asc';
  sortByField: any;

  /* Table Sort Variable */
  sortOption: any = this.utils.ddOptions.sortOption;

  periodObj: any = {};
  userPeriodDetail: any = {};
  periodCountry: any = [];
  periodRegion: any = [];
  periodStore: any = [];
  periodFromDate: any = [];
  periodToDate: any = [];
  multipleUserData: any = [];
  deleteId: any = {};
  periodId: any = {};
  periodContainer: any = [1];
  counter = 1;

  previousIndex: number;
  @ViewChild('table', { static: true }) table: MatTable<string[]>;
  @ViewChild('createForm', { static: false }) public createForm: NgForm;
  @ViewChild('closeUserCreateModal', { static: false }) public closeUserCreateModal: ElementRef;
  @ViewChild('closeEmpLinkModal', { static: false }) public closeEmpLinkModal: ElementRef;
  @ViewChild('closeInvite360Modal', { static: false }) public closeInvite360Modal: ElementRef;
  @ViewChild('closeStatusModal', { static: false }) public closeStatusModal: ElementRef;
  @ViewChild('closeMagConfirmationModal', { static: false }) public closeMagConfirmationModal: ElementRef;

  @ViewChild('suggestModal', { static: false }) public suggestModal: ElementRef;

  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;
  
  destroyed$: Subject<void> = new Subject<void>();
  formSuggestCourseObj: any = {};
  headerSuggestCourseObj: any = {};

  selectedRowDetail: any = {};
  suggestCourseRoleList: any = [];
  selectedsuggestCourseRole: any;
  selectedsuggestCourseLevel: any;
  showEmpStatusDialog = 'none';
  showEmpLinkDialog = 'none';
  showEmpCreateDialog = 'none';
  inactiveCount: any = [];
  activeCount: any = [];
  statusAction: any = [];
  currentDate: any = moment(new Date());
  form: FormGroup;

  /* height variables */
  pageContainerHeight: any = 0;
  tableRowHeight = 40;
  filterBarHeight = 60;

  /* pagination count variables */
  employeeTable = 1;
  employeeTableItemCount: any = 1;
  noOfPageInPagination: any = 5;

  /* Emp Save and update button status */
  isButtonCreate = true;
  isButtonUpdate = false;
  empValueStatus = true;
  empVal = 'Create';
  empEditStatus = false;
  empEditStatusMultiEdit: any = [];

  inviteEmpData: any = [];

  getCourseCallCount: number = 0;
  empSuggestDetail: any = {};
  empCourseList: any = []
  displayedColumns: string[] = ['id', 'role', 'levels', 'externalName', 'courseType', 'completionDate'];
  suggestColumns: string[] = ['id', 'SuggestedCourse', 'suggestedDate', 'Action'];
  managerConfirmColumns: string[] = ['id', 'courseName', 'completionDate', 'Action'];
  empSuggestedLevels: any = [];
  empSuggestedCourseDetails: any = [];
  linkEmployeeColumns: any = [];
  linkEmployeeData: any = [
    {
      label: 'ID',
      currentProperty: 'employeeId',
      promotedProperty: 'promotedEmployeeId'
    },
    {
      label: 'Name',
      currentProperty: 'username',
      promotedProperty: 'promotedEmployeeName'
    },
    {
      label: 'Role',
      currentProperty: 'role',
      promotedProperty: 'promotedEmpRole'
    },
    {
      label: 'Manager',
      currentProperty: 'reportingManager',
      promotedProperty: 'promotedEmpReportingManager'
    },
    {
      label: 'Email',
      currentProperty: 'email',
      promotedProperty: 'promotedEmpEmail'
    },
    {
      label: 'Country',
      currentProperty: 'country',
      promotedProperty: 'promotedEmpCountry'
    },
    {
      label: 'Region',
      currentProperty: 'region',
      promotedProperty: 'promotedEmpRegion'
    },
    {
      label: 'Store',
      currentProperty: 'store',
      promotedProperty: 'promotedEmpStore'
    }
  ]

  /* Data rendered check variable */
  recordFound: boolean = false;
  showShimmer: boolean = true;
  showShimmer1: boolean = true;
  showShimmer2: boolean = true;

  currentModule: any;

  inviteType: any;
  employeeColumnsToDisplay: any[] = [
    {
      name: "Employee ID"
    },
    {
      name: "Employee name"
    },
    {
      name: "Role"
    },
    {
      name: "Status"
    },
    {
      name: "Date of joining"
    },
  ]

  indeterminateAll= false;
  checkedAll = false;
  @Output() sendDatatof2f: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeEmppopup: EventEmitter<any> = new EventEmitter<any>();

  constructor(public utils: Utils, public ngxService: NgxUiLoaderService,
    private modalService: NgbModal, private emitService: CommonService, private router: Router,
    private apiHandler: ApiHandlerService, private errorHandler: ErrorHandlerService, private incidentApiHandler: RequestApiService) {
    /* get page height */
    setTimeout(() => {
      this.pageContainerHeight = document.getElementsByClassName('page-container')[0].clientHeight;
      /* set height of table container */
      this.setHeightOfContainer();
    });
  }

  ngOnInit(): void {
    this.currentModule = this.router.url.replace('/', '');
    console.log('current module', this.currentModule);
    this.currentModule === 'employees' ? this.employeeColumns = this.utils.TABLE_HEADERS.EMPLOYEE_MANAGEMENT_TABLE : this.employeeColumns = this.utils.TABLE_HEADERS.USER_ROLE_TABLE;
    this.linkEmployeeColumns = this.utils.TABLE_HEADERS.LINK_EMPLOYEE_TABLE;
    // this.employeeColumnsToDisplay = this.employeeColumns.map((col: { name: any; }) => col.name);
    console.log(this.employeeColumnsToDisplay, "employeeColumnsToDisplay employeeColumnsToDisplay")
    this.userDetailValue = JSON.parse(localStorage.getItem("userDetails") || '{}');

    this.getSelectedCheckbox();
    this.getUserDetails();
    this.getRoleGroup();
    this.getAllCountries();
  }
  ngAfterViewInit(): void {
   
  }
  selectedEmployeesData:any[] = [];
  selectAllheader(event:any){
    this.selectedEmployeesData = [];
    for (let x of this.employeeList) {
      x.checked = event.checked;

      if (x.checked) {
        this.selectedEmployeesData.push(x);
      } 
  }
   if (event.checked == false) {
      this.selectedEmployeesData = []
    }
    this.selectedEmployeesData = this.selectedEmployeesData.map((list:any)=> {
      return {...list, isNewEmployee:true, isDeleted : false};
     })
   
    this.indeterminateAll = false;
    this.checkedAll = !this.checkedAll;
  }
  onSelectcheckbox(event: any, index: any) {

    index.checked = event.checked;
    const ind = this.selectedEmployeesData.findIndex(item => item.id === index.id);

    if (index.checked && ind === -1) {
      this.selectedEmployeesData.push(index);
    } else if (!index.checked && ind !== -1) {
      this.selectedEmployeesData = this.selectedEmployeesData.filter(item => item.id !== index.id);
    }
    // if (index.checked) {
    //   this.selectedEmployeesData.push(index);
    // } else {
    //   const selectedIndex = this.selectedEmployeesData.indexOf(index);
    //   if (selectedIndex !== -1) {
    //     this.selectedEmployeesData.splice(selectedIndex, 1);
    //   }
    // }
    console.log(this.selectedEmployeesData, "selectedEmployeesData")
    this.selectedEmployeesData = this.selectedEmployeesData.map((list:any)=> {
      return {...list, isNewEmployee:true, isDeleted : false};
     })
    if (this.employeeList.every((x: any) => x.checked !== true)) {
      this.checkedAll = false;
    }
    else {
      this.indeterminateAll = true;
    }

    if (this.employeeList.every((x: any) => x.checked == true)) {
      this.indeterminateAll = false;
      this.checkedAll = true;
    }
    if (this.employeeList.every((x: any) => x.checked == false)) {
      this.indeterminateAll = false;
      this.checkedAll = false;
    }

  }

  async getUserDetails() {
    /* const response: any = await this.apiHandler.getData(this.utils.API.GET_USER_DETAILS, this.userDetailValue.id, this.destroyed$);
    localStorage.setItem('userDetails', JSON.stringify(response.payload || {})); */
    this.resetEmployeeList();
    this.getEmployeeList();
  }

  /* page height calculation */
  /* while resize page */
  onResize() {
    this.setHeightOfContainer();
    this.employeeTable = 1;
  }
  /* set init height for containers */
  setHeightOfContainer() {
    /* 60 - footer height */
    this.pageContainerHeight = document.getElementsByClassName('page-container')[0].clientHeight;// - this.filterBarHeight - 60;
    this.setPageCount(this.pageContainerHeight);
  }
  /* set item per page based on height
      T1Height - Employee table
  */
  setPageCount(T1Height) {
    /* change item per page count based on height of the table */
    /* 80 - is the height of table header, margin and paddings */
    this.employeeTableItemCount = Math.floor(((T1Height - 80) / this.tableRowHeight)) > 0 ?
      Math.floor(((T1Height - 80) / this.tableRowHeight)) : 1;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.employeeList);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employeeList.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /* get subscribe selected checkbox list */
  getSelectedCheckbox() {
    this.selection.changed.subscribe(item => {
      this.getSelectedTableRow();
    });

  }
  /* Get selected table row check/uncheck item */
  getSelectedTableRow() {
    this.selectedRowDetail = this.selection.selected.map(item => item);
    this.headerSuggestCourseObj = this.selectedRowDetail[0];
    return this.selection.selected.map(item => item);
  }

  /* Get role group */
  async getRoleGroup() {
    const roleGroupList = [];
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, '', this.destroyed$);
    this.roleGroup = this.sortRoleGroup(response?.payload || []);
    this.roleGroup.forEach((role: any) => {
      if (role.active === true) {
        roleGroupList.push(role);
      }
    });
    this.roleGroupList = [...roleGroupList];
    this.getAllRoleList();
  }

  sortRoleGroup(list) {
    list = __.sortBy(list, 'sequenceId');
    list.forEach(element => {
      element.child = _.sortBy(element.child, 'sequenceId');
    });
    return list;
  }

  /* Get All Country Region Store */
  storeCount: number = 0;
  async getAllCountries() {
    const countryList = [];
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, '', this.destroyed$);
    this.countryRegionStore = this.emitService.sortRegion(response.payload);
    this.countryRegionStore.forEach((country: any) => {
      if (country.active === true) {
        countryList.push(country);
      }
    });

    this.countryList = [...countryList];

    this.storeCount = this.getCount(this.countryList, 0);

    this.constructSelectedIds(this.countryList, '', 'country');

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

  country = [];
  region = [];
  store = [];
  getCountryRegionStore() {
    let countryList = [];
    let regionList = [];
    let storeList = [];
    countryList = [...this.countryList.map(country => country.desc)];
    this.countryList.forEach(country => {
      regionList = regionList + country.child.map(region => region.desc);
      country.child.forEach(region => {
        storeList = storeList + region.child.map(store => store.desc);
      });
    });

    this.country = [...countryList];
    this.region = [...regionList];
    this.store = [...storeList];
  }

  /* Construct selected Ids from drop down data list */
  constructSelectedIds(list, parent, type) {
    list.forEach(element => {
      type === 'country' ? element.countryRegionStoreId = (parent ? parent + "|" : parent) + element.id : element.roleGroupLevelId = (parent ? parent + "|" : parent) + element.id;
      if (element.child) {
        this.constructSelectedIds(element.child, type === 'country' ? element.countryRegionStoreId : element.roleGroupLevelId, type);
      }
    });
  }

  paginationIndex: number = 0;
  allowCall: boolean = false;
  nextPage: boolean = false;
  @HostListener('scroll', ['$event'])
  containerScrollCheck(event: any) {
    const doc: any = document.querySelector("#employee-container")
    if (doc.scrollHeight > doc.clientHeight && (doc.scrollTop + doc.clientHeight > doc.scrollHeight - 5) && this.allowCall && this.nextPage) {
      console.log(this.showShimmer)
      this.allowCall = false;
      this.paginationIndex++;
      this.getEmployeeList()
    }
  }

  searchFilterOnChange() {
    if (this.checkMinimumChar(3, this.searchTextValue?.length)) {
      return;
    }
    this.resetEmployeeList();
    this.getEmployeeList();
  }

  /* check given input has required character */
  checkMinimumChar(minChar, inputLength) {
    if (!minChar || !inputLength || inputLength >= minChar) {
      return false;
    } else {
      this.errorHandler.handleAlert(`Please enter minimum ${minChar} characters for auto suggestion.`);
      return true;
    }
  }
  shimmerWidth: any;
  async getEmployeeList() {
    // this.ngxService.start();
    // if (document.getElementById("employee-container")) {
    //   const doc: any = document.getElementById("employee-container")?.clientWidth;
    //   this.shimmerWidth = doc;
    //   console.log(this.shimmerWidth)
    // }
    this.showShimmer = true;
    this.recordFound = false
    // this.employeeList = [];
    const portalRole = this.utils.portalRole;
    const countryIds = [];
    const regionIds = [];
    const storeIds = [];
    countryIds.push(this.userDetailValue.countryId);
    regionIds.push(this.userDetailValue.regionId);
    storeIds.push(this.userDetailValue.storeId);
    this.selectedEmployeesData = [];
   this.checkedAll = false;
   this.indeterminateAll = false;

    if (this.userDetailValue.periodUsers && this.userDetailValue.periodUsers.length > 0) {
      this.userDetailValue.periodUsers.forEach(data => {
        if (!data.fromDate || !data.toDate || moment().isBetween(data.fromDate, data.toDate)) {
          countryIds.push(data.countryId);
          regionIds.push(data.regionId);
          storeIds.push(data.storeId);
        }
      })
    }

    let payload = {
      country: countryIds,
      region: regionIds,
      store: storeIds,
      userId: this.userDetailValue?.id,
      admin: (this.userDetailValue.learnerRole === 'SA' || this.userDetailValue.learnerRole === 'HR'), // !this.userDetailValue.manager, [portalRole.superAdmin, portalRole.hr].includes(this.userDetailValue.portalRole),
      page: this.paginationIndex,
      filter: {
        countries: this.buildSelectedDropDownHierarchy(this.countryList),
        tableFilters: { ...this.currentFilters },
        searchBy: this.searchTextValue !== '' ? this.searchBy : '',
        searchText: this.searchTextValue,
        searchDateBy: this.filteredDate.fromDate !== '' && this.filteredDate.toDate !== '' ? this.dateBy : '',
        fromDate: this.filteredDate.fromDate,
        toDate: this.filteredDate.toDate,
        filterBy: this.sortByField !== undefined ? this.sortByField : '',
        filterValue: this.sortByField !== undefined ? this.sortBy === 'Sort By Asc' ? 'asc' : this.sortBy === 'Sort By Desc' ? 'desc' : '' : ''
      }
    };
    console.log('Request', payload);
    const response: any = await this.apiHandler.postData(this.utils.API.GET_EMPLOYEE_LIST, payload, this.destroyed$);
    this.employeeList = __.flatten(this.constructEmployeeList(response.payload.users));
    this.employeeList = this.employeeList.filter((employeeData:any)=>{
    return employeeData.employeeStatus === "Active"
    })
    this.nextPage = response.payload.users.length > 0 && response.payload.nextPage;
    for(let x of this.employeeList){
      x.checked = false
    }
    /* hide the current employee from user list */
    // this.employeeList = response.payload.filter(element => element.id !== this.userDetailValue.id);

    const employeeArray = [];

    this.employeeList.forEach(employee => {
      let employeeObj: any = {};
      employeeObj.employeeId = employee.employeeId;
      employeeObj.username = employee.username;
      if (employee.sfEmployee == false) {
        // employee.employeeStatus = "-";
      }
      // if(employee.lastName == null) {
      //   employee.lastName = " ";
      // }
      employeeArray.push(employeeObj);
    });

    this.cloneEmployeeList = [...this.employeeList];
    this.employeedIdandName = [...employeeArray];
    console.log(this.employeeList, 'employeeList');

    // this.getFilterLists();
    // this.dateFilter();
    const navFilter: any = JSON.parse(localStorage.getItem('nav-employee'));
    if (navFilter) {
      this.searchBy = navFilter.searchBy;
      this.searchTextValue = navFilter.searchTextValue;
      this.dateFilter();
      localStorage.removeItem('nav-employee');
    }
    this.recordFound = true;
    // this.ngxService.stop();
    this.showShimmer = false;
    console.log(this.employeeList, "employeeList employeeList")
  }

  resetEmployeeList() {
    this.employeeList = [];
    this.showShimmer = true;
    this.tempEmpList = [];
    this.paginationIndex = 0;
  }

  tempEmpList: any = [];
  constructEmployeeList(response: any) {
    if (response.length > 0) {
      this.tempEmpList.push([...response]);
    }
    this.allowCall = true;
    console.log('employeeList', this.tempEmpList);
    return this.tempEmpList;
  }

  /* date change event */
  dateRangeChange(event) {
    const dateFormat = this.utils.FORMAT.DATE;
    if (event.start.format(dateFormat) === event.end.format(dateFormat)) {
      if (event.start.format(dateFormat) === moment().format(dateFormat)) {
        this.selectedDateLabel = 'Today';
      } else {
        this.selectedDateLabel = event.start.format(dateFormat);
      }
    } else {
      this.selectedDateLabel = event.label === 'Custom Range' ?
        event.start.format(dateFormat) + ' to ' + event.end.format(dateFormat)
        : event.label;
    }
    this.filteredDate.fromDate = event.start.format('yyyy-MM-DD');
    this.filteredDate.toDate = event.end.format('yyyy-MM-DD');
    // this.dateFilter(true);
    console.log(this.filteredDate, 'this.filteredDate');
    this.resetEmployeeList();
    this.getEmployeeList()
  }

  onTableFilterPopupClose(multi) {
    if (multi) {
      this.resetEmployeeList();
      this.getEmployeeList();
    }
  }

  /* Table filter apply */
  updateFilter(items, column, multi?: boolean) {
    if (multi) {
      if (items.key === 'All') {
        this.currentFilters[column.property] = [];
        this.availableFilter[column.property].forEach(element => {
          if (items.checked && element.key !== 'All') {
            this.currentFilters[column.property].push(element.key);
          }
          element.checked = items.checked;
        });
      } else {
        if (items.checked) {
          this.currentFilters[column.property].push(items.key);
        } else {
          this.currentFilters[column.property] = this.currentFilters[column.property].filter(temp => temp !== items.key)
        }
      }
    } else {
      this.currentFilters[column.property] = items.key;
      this.resetEmployeeList();
      this.getEmployeeList();
    }
    // this.dateFilter();
  }

  updateSort(sortBy?, sortObj?) {
    // this.statusPopover.close();
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    /* if (this.sortBy === 'Sort By Asc') {
      this.employeeList = (__.sortBy([...this.employeeList], [element => element[this.sortByField].toLowerCase()]));
    } else if (this.sortBy === 'Sort By Desc') {
      this.employeeList = (__.sortBy([...this.employeeList], [element => element[this.sortByField].toLowerCase()])).reverse();
    } else if (this.sortBy === 'Reset') {
      this.employeeList = [...this.cloneEmployeeList];
      this.dateFilter();
    } */
    this.resetEmployeeList();
    this.getEmployeeList();
  }

  loadRegionList(data, event, index) {
    console.log(index, event, data, 'country index data');
    const regions = [];
    const stores = [];
    if (event === undefined && index === null) {
      this.regionList = [];
      this.storeList = [];
      this.userDetail = {};
      this.regionEnable = true;
      this.storeEnable = true;
      return;
    }
    if (event === undefined && index !== null) {
      this.periodRegionList = [];
      this.periodStoreList = [];
      this.periodRegion[index] = null;
      this.periodStore[index] = null;
      return;
    }
    if (data == 'singleRegion') {

      if (index === null) {

        this.countryList.forEach(country => {

          if (this.userDetail.country === country.desc) {
            this.userDetail.countryId = country.id;
            country.child?.forEach((region: any) => {
              if (region.active === true) {
                regions.push(region);
                region.child?.forEach(store => {
                  stores.push(store);
                });
              }
            });

            this.storeEnable = stores.length > 0 ? false : true;
            this.userDetail.store = null;
            console.log(this.userDetail, 'this.userDetail');
            /* country.child?.forEach((region: any) => {
              if (region.active === true) {
                regions.push(region);
              }
            });

            this.regionEnable = regions.length > 0 ? false : true;
            this.userDetail.region = null;
            console.log(this.userDetail, 'this.userDetail'); */
          }
        });
        this.regionList = [...regions];
        this.storeList = [...stores];

      } else {

        this.countryList.forEach(country => {

          if (event.desc == country.desc) {
            this.userPeriodDetail.countryId = country.id;
            country.child?.forEach((region: any) => {
              if (region.active === true) {
                regions.push(region);
                region.child?.forEach(store => {
                  stores.push(store);
                });
              }
            });
          }
          //this.regionEnable[index] = regions.length > 0 ? false : true;
          this.periodRegion[index] = null;
          this.periodStore[index] = null;
          this.periodRegionList[index] = null;
        });
        this.periodRegionList[index] = [...regions];
        this.periodStoreList[index] = [...stores];

      }

    } else {
      this.selectedCountry.forEach(selectedCountry => {
        this.countryList.forEach(country => {
          if (Number(selectedCountry) === Number(country.id)) {

            country.child?.forEach((region: any) => {
              if (region.active === true) {
                regions.push(region);
              }
            });
          }
        })
      });
    }

    console.log('periodStoreList', this.periodStoreList[index]);

    // this.loadStoreList('singleStore', null, index);
  }

  getStoresRegion(index) {
    if (index !== null) {
      const selectedRegion = this.periodRegionList[index].find(region => {
        return region?.child.find(store => store.desc === this.periodStore[index]);
      });
      this.periodRegion[index] = selectedRegion?.desc;
    } else {
      if (this.userDetail.store) {
        this.storeList.forEach(store => {
          if (store.desc === this.userDetail.store) {
            this.userDetail.storeId = store.id;
          }
        });
        const selectedRegion = this.regionList.find(region => {
          return region?.child.find(store => store.desc === this.userDetail.store);
        });
        this.userDetail.region = selectedRegion?.desc;
        this.userDetail.regionId = selectedRegion?.id;
      } else {
        this.userDetail.storeId = null;
      }
    }
  }

  /* loadStoreList(data, event, index) {
    console.log(index, event, data, 'country index data');

    if (event === undefined && index !== null) {
      this.periodStoreList = [];
      this.periodStore[index] = null;
      return;
    }

    const stores = [];
    if (data == 'singleStore') {

      if (index === null) {

        this.regionList.forEach(regionData => {

          if (this.userDetail.region === regionData.desc) {
            this.userDetail.regionId = regionData.id;
            regionData.child.forEach(store => {
              if (store.active === true) {
                stores.push(store);
              }
            })
          }
          this.storeEnable = stores.length > 0 ? false : true;
          this.userDetail.store = null;
        });

      } else {

        this.periodRegionList[index].forEach(regionData => {
          if (event !== null) {
            if (event.desc == regionData.desc) {
              //this.userPeriodDetail.countryId = country.id;
              regionData.child?.forEach((store: any) => {
                if (store.active === true) {
                  stores.push(store);
                }
              });
            }
          }
          //this.storeEnable[index] = stores.length > 0 ? false : true;
          this.periodStore[index] = null;
          this.periodStoreList[index] = null;
        });

      }


    } else {
      this.selectedRegion.forEach((selectedRegion) => {
        this.regionList.forEach(region => {
          if (Number(selectedRegion) === Number(region.id)) {
            region.stores.forEach(store => {
              if (store.active === true) {
                stores.push(store);
              }
            })
          }
        })
      })
    }

    if (index == null) {
      this.storeList = [...stores];
    } else {
      this.periodStoreList[index] = [...stores];
    }

  } */

  setRoleValue() {
    this.allRoleList.forEach(roleList => {
      if (this.userDetail.role === roleList.desc) {
        this.userDetail.roleId = roleList.id;
      }
    })
  }


  getAllRoleList() {
    const allRoles = [];
    this.roleGroupList.forEach(roleGroup => {
      roleGroup.child.forEach(role => {
        if (role.active === true) {
          allRoles.push(role);
        }
      })
    })
    this.allRoleList = [...allRoles];
    this.suggestCourseRoleList = [...allRoles];
    this.availableFilter.role = this.allRoleList.map(role => {
      let obj = {
        name: role.desc,
        key: role.desc
      }
      return obj;
    });
    this.availableFilter.role.unshift({ name: 'All', key: 'All' });
  }

  async loadManagerList() {
    const managerList = [];
    this.storeList.forEach(store => {
      if (store.desc === this.userDetail.store) {
        this.userDetail.storeId = store.id;
      }
    });
    const crs = { "country": this.userDetail.country, "region": this.userDetail.region, "store": this.userDetail.store }
    const response: any = await this.apiHandler.postData(this.utils.API.GET_MANAGER_LIST, crs, this.destroyed$);
    this.managerListData = response.payload;
    this.managerListData.forEach((manager: any) => {
      managerList.push(manager);
    });
    this.managerList = [...managerList];
  }

  /* Select All from drop down list
  selectAll(event: any, list: any, type: any) {
    list.forEach(element => {
      this.selectionToggle(event.checked, element, type);
    });
  }

  Select single property from drop down list
  selectionToggleLeaf(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleGroupList, type);
  }

  Select Multiple properties
  selectionToggle(isChecked, node, type) {
    this.selectionToggleAction(isChecked, node, type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleGroupList, type);
  }

  selectionToggleAction(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    if (node.child) {
      node.child.forEach(child => {
        this.selectionToggleAction(isChecked, child, type);
      });
    }
    this.updateSelectionstatus(type);
  }

  Update selection Status in List
  updateSelectionstatus(type) {
    let listArray = [];
    if (type === 'roleGroup') {
      listArray = this.roleGroupList;
    } else if (type === 'country') {
      listArray = this.countryList;
    }
    for (let child of listArray) {
      this.setSelectionStatus(child);
    }
  }

  Set Drop Down list status as checked or unchecked or mixed
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

  Filter update once drop down value selected
  filterUpdate(ddList: any, type: any) {
    let tempSelected = [];
    for (let country of ddList) {
      this.selectedDropDown(country, tempSelected, type);
    }
    type === 'country' ? this.selectedCountryDropDown = [...tempSelected] : this.selectedRoleGroupDropDown = [...tempSelected];
    this.applyfilter();
  }

  create selected drop down array
  selectedDropDown(obj: any, tempArr: any, type: any) {
    if (obj.selectStatus === 'checked') {
      type === 'country' ? tempArr.push(obj.countryRegionStoreId) : tempArr.push(obj.roleGroupLevelId);
      if (obj.child && obj.child.length) {
        for (let child of obj.child) {
          this.selectedDropDown(child, tempArr, type);
        }
      }
    } else if (obj.selectStatus === 'mixed') {
      for (let child of obj.child) {
        this.selectedDropDown(child, tempArr, type);
      }
    } else if (obj.selectStatus === 'unchecked') {
      type === 'country' ? tempArr.filter(temp => temp !== obj.roleGroupLevelId) : tempArr.filter(temp => temp !== obj.roleGroupLevelId);
      if (obj.child && obj.child.length) {
        for (let child of obj.child) {
          this.selectedDropDown(child, tempArr, type);
        }
      }
    }
  } */

  /* Select All from drop down list */
  selectAll(event: any, list: any, type: any) {
    console.log('selectAll');
    /* list.forEach(element => {
      this.selectionToggle(event.checked, element, type);
    }); */

    this.changeObjProperty(list, 'selectStatus', event.checked ? 'checked' : 'unchecked');
    this.updateSelectionstatus(type);
    this.filterUpdate(this.countryList, type);
    this.calcSelectedStore();
    console.log('selectAll', this.countryList);
    console.log('selected', this.buildSelectedDropDownHierarchy(this.countryList));
  }

  /* Filter update once drop down value selected */
  filterUpdate(ddList: any, type: any) {
    console.log('filterUpdate')
    let tempSelected = [];
    for (let country of ddList) {
      this.selectedDropDown(country, tempSelected, type);
    }
    this.selectedCountryDropDown = [...tempSelected];
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
    this.filterUpdate(this.countryList, type);
    this.calcSelectedStore();
  }

  /* Select Multiple properties */
  selectionToggle(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.changeObjProperty(node.child, 'selectStatus', node.selectStatus);
    this.updateSelectionstatus(type);
    this.filterUpdate(this.countryList, type);
    this.calcSelectedStore();
  }

  /* Update selection Status in List */
  updateSelectionstatus(type) {
    let listArray = [];
    if (type === 'country') {
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

  selectedStoreCount: number = 0;
  calcSelectedStore() {
    this.selectedStoreCount = 0;
    this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    return this.selectedStoreCount;
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

  preCountryList: any = [];
  callGetEmployeeList(event) {
    if (event === true) {
      this.preCountryList = this.buildSelectedDropDownHierarchy(this.countryList);
    }
    if (event === false && !this.deepCompare(this.preCountryList, this.buildSelectedDropDownHierarchy(this.countryList))) {
      this.resetEmployeeList();
      this.getEmployeeList();
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

  /* Apply drop down filter logic */
  applyfilter() {
    if (this.selectedCountryDropDown.length > 0 || this.selectedRoleGroupDropDown.length > 0 || this.searchTextValue.length > 0) {
      // this.employeeList = [];
      this.employeeList = this.cloneEmployeeList.filter(row => {
        let hasValue = false;
        let isCrsHasValue = false;
        let isRoleHasValue = false;
        let isSearchByHasValue = false;
        if (this.selectedCountryDropDown.length === 0) {
          isCrsHasValue = true;
        } else {
          for (const selected of this.selectedCountryDropDown) {
            for (const country of row.crsIds) {
              let isSelected = this.stringCompare(selected, country);
              if (isSelected) {
                isCrsHasValue = true;
                break;
              }
            }
          }
        }
        if (this.selectedRoleGroupDropDown.length === 0) {
          isRoleHasValue = true;
        } else {
          for (const key of this.selectedRoleGroupDropDown) {
            let isSelected = this.stringCompare(row.roleGrpLevelIds, key);
            if (isSelected) {
              isRoleHasValue = true;
            }
          }
        }
        if (this.searchTextValue === 0) {
          isSearchByHasValue = true;
        } else if (row.courseName.toLowerCase().includes(this.searchTextValue.toLowerCase())) {
          isSearchByHasValue = true
        }
        if (isCrsHasValue && isRoleHasValue && isSearchByHasValue) {
          hasValue = true
        }
        return hasValue;
      })
    } else {
      this.employeeList = [...this.cloneEmployeeList];
    }
    this.getFilterLists();
    this.dateFilter();
  }

  /* Compare string and return boolean */
  stringCompare(row: any, key: any) {
    if (row === key.slice(0, row.length)) {
      return true;
    } else {
      return false;
    }
  }

  /* Prepare filter list */
  getFilterLists() {
    this.buildFilterList(this.employeeList, 'role');
    this.buildFilterList(this.employeeList, 'country');
    this.buildFilterList(this.employeeList, 'region');
    this.buildFilterList(this.employeeList, 'store');
    this.buildFilterList(this.employeeList, 'appstatus');
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

  /* Apply UI filter for table listing */
  applyListingFilter(dateFilteredData) {

    const filterFields = Object.keys(this.currentFilters);
    const resetAll = filterFields.find((key) => typeof (this.currentFilters[key]) === 'object' ? this.currentFilters[key].length > 0 : this.currentFilters[key] !== 'All');
    if (!resetAll) {
      this.employeeList = [...dateFilteredData];
    } else {
      this.employeeList = dateFilteredData.filter((obj) => {
        let hasValue = false;
        for (const key of filterFields) {
          if (typeof (this.currentFilters[key]) === 'object' ? this.currentFilters[key].length > 0 : this.currentFilters[key] !== 'All') {
            if (typeof (this.currentFilters[key]) === 'object'
              ? this.currentFilters[key].includes(obj[key])
              : obj[key] === this.currentFilters[key]) {
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
  }

  /* Here 'isDateFilter' parameter added to detect that the method called from dateChange method otherwise date filter won't work */
  dateFilter(isDateFilter?: boolean) {
    this.employeeTable = 1;
    const datechangeFrom = moment(this.filteredDate.fromDate);
    const dateFormatFrom = 'YYYY-MM-DD HH:mm:ss';
    const dateOnFrom = (datechangeFrom?.format(dateFormatFrom));

    const datechangeTo = moment(this.filteredDate.toDate);
    const dateFormatTo = 'YYYY-MM-DD HH:mm:ss';
    const dateOnTo = (datechangeTo?.format(dateFormatTo));

    let dateFilterEmpArray = [...this.cloneEmployeeList];
    this.employeeList = [];
    if (isDateFilter) {
      dateFilterEmpArray = [];
      this.cloneEmployeeList.forEach(employee => {
        let employeeObj: any = {};
        if (dateOnFrom <= employee.dateOfJoining && dateOnTo >= employee.dateOfJoining) {
          dateFilterEmpArray.push(employee);
        }
      });
    }
    dateFilterEmpArray = this.searchApplied(dateFilterEmpArray)
    this.applyListingFilter(dateFilterEmpArray);
  }

  searchApplied(dataArray) {
    this.selection.clear();

    let filteredData = [];
    if (this.searchTextValue) {
      filteredData = this.cloneEmployeeList.filter(element => {
        return element[this.searchBy]?.toLowerCase().includes(this.searchTextValue.toLowerCase());
      });
    } else {
      filteredData = dataArray;
    }
    return filteredData;
  }

  clearSearchText() {
    if (this.searchTextValue !== '') {
      this.searchTextValue = '';
      this.resetEmployeeList();
      this.getEmployeeList();
    }
    // this.dateFilter();
  }

  dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.employeeColumnsToDisplay, event.previousIndex + 1, event.currentIndex + 1);
    this.table.renderRows();
  }

  /* Save/ update user details */
  async saveUserDetail(val) {

    console.log(this.periodContainer);
    console.log(this.periodContainer.length);

    this.userDetail.period = [];
    var p = 0;
    this.periodContainer.forEach(count => {
      console.log(count, 'periodContainer');
      this.periodObj = {};
      if (count.id) {
        this.periodObj.id = count.id;
      }

      this.periodObj.country = this.periodCountry[p];
      const regions = [];
      this.countryList.forEach(country => {
        if (country.desc == this.periodCountry[p]) {
          this.periodObj.countryId = country.id;
          country.child?.forEach((region: any) => {
            if (region.active === true) {
              regions.push(region);
            }
          });
        }
      });

      this.regionList = [...regions];

      this.periodObj.region = this.periodRegion[p];
      const stores = [];
      this.regionList.forEach(region => {
        if (region.desc == this.periodRegion[p]) {
          this.periodObj.regionId = region.id;
          region.child?.forEach((store: any) => {
            if (store.active === true) {
              stores.push(store);
            }
          });

        }
      });

      this.storeList = [...stores];

      this.periodObj.store = this.periodStore[p];
      this.storeList.forEach(store => {
        if (store.desc == this.periodStore[p]) {
          this.periodObj.storeId = store.id;
        }
      });

      const dateFormat = 'YYYY-MM-DD HH:mm:ss';

      if (this.periodFromDate[p] !== undefined && this.periodFromDate[p] !== null) {
        const periodFromDatechange = moment(this.periodFromDate[p]);
        this.periodObj.fromDate = (periodFromDatechange?.format(dateFormat));
      } else {
        this.periodObj.fromDate = null;
      }

      if (this.periodToDate[p] !== undefined && this.periodToDate[p] !== null) {
        const periodToDatechange = moment(this.periodToDate[p]);
        this.periodObj.toDate = (periodToDatechange?.format(dateFormat));
      } else {
        this.periodObj.toDate = null;
      }


      this.userDetail.period.push(this.periodObj);
      p++;
    });

    console.log(this.userDetail, "Save this.userDetail");

    const cloneUserDetails = { ...this.userDetail };

    const datechange = moment(cloneUserDetails.dateOfJoining);
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    cloneUserDetails.dateOfJoining = (datechange?.format(dateFormat));
    if (val == "create" || val == "createInvaite") {
      delete cloneUserDetails.id;
    }
    const mailSend = val == "createInvaite" ? true : false;
    const successMsg = val == "update" ? "Updated" : "Created";

    cloneUserDetails.mail = mailSend;
    if (this.userDetail.lastName == null || this.userDetail.lastName == "" || this.userDetail.lastName == undefined) {
      cloneUserDetails.username = this.userDetail.firstName;
    } else {
      cloneUserDetails.username = this.userDetail.firstName + ' ' + this.userDetail.lastName;
    }

    if (this.createForm.valid) {
      const res: any = await this.apiHandler.postData(this.utils.API.POST_EMPLOYEE_CREATE, cloneUserDetails, this.destroyed$,
        `Employee ${successMsg}  successfully`);
      this.closeUserCreateModal.nativeElement.click();
      this.closeEmpCreatePopup();
      this.resetEmployeeList();
      this.getEmployeeList();
    }
  }

  closeEmpCreatePopup() {
    this.createForm.reset();
  }

  changeStatusAction(event) {
    this.statusAction = event;
    this.activeCount = _.filter(this.selectedRowDetail, (item) => item.active === true).length;
    this.inactiveCount = _.filter(this.selectedRowDetail, (item) => item.active === false).length;
    this.selectedCount = this.selectedRowDetail.length;
    this.employeeStatusId = [];
    this.selectedRowDetail.forEach(empList => {
      this.proEmpDetail = empList;
      if (this.statusAction === 'Make active' || this.statusAction === 'Temporarily disable' || (this.statusAction === 'Delete' && empList.sfEmployee === false)) { //To avoid deleting the sf employee
        this.employeeStatusId.push(empList.id)
      }
    });
  }

  /* close the Modal */
  closeStatusPopup() {
    this.closeStatusModal.nativeElement.click();
    this.selectedStatus = null;
    this.selection.clear();
  }

  /* Employee Link */
  employeeLink() {
    this.openEmplinkPopup();
    const selectedRowData = this.getSelectedTableRow();
    this.employeeDetailLink.employeeId = selectedRowData[0].employeeId;
    this.employeeDetailLink.promotedEmployeeId = selectedRowData[0].promotedEmployeeId;
    this.employeeDetailLink.userId = selectedRowData[0].id;
    this.employeeDetailLink.mobile = selectedRowData[0].mobile;
    this.employeeDetailLink.role = selectedRowData[0].role;
    this.employeeDetailLink.country = selectedRowData[0].country;
    this.employeeDetailLink.username = selectedRowData[0].username;
    this.employeeDetailLink.email = selectedRowData[0].email;
    this.employeeDetailLink.reportingManager = selectedRowData[0].reportingManager;
    this.employeeDetailLink.region = selectedRowData[0].region;
    this.employeeDetailLink.store = selectedRowData[0].store;
    if (selectedRowData[0].promotedEmployeeId !== null) {
      const proEmpId = selectedRowData[0].promotedEmployeeId;
      this.getPromotedEmployeeId(proEmpId);
    }
  }

  openEmplinkPopup() {
    this.showEmpLinkDialog = "block";
  }

  closeEmplinkPopup() {
    this.closeEmpLinkModal.nativeElement.click();
    this.proEmployeeDetailLink = {};
    this.selection.clear();
  }

  /*Promoted Employee Link set by id change*/
  getPromotedEmployeeId(proEmpId) {
    if (proEmpId !== null) {
      this.employeeList.forEach(empList => {
        if (Number(proEmpId) === Number(empList.id)) {
          this.proEmpDetail = empList;
          this.setProEmployeeDetail();
        }
      })
    } else {
      this.employeeList.forEach(empList => {
        if (Number(this.proEmployeeDetailLink.promotedEmployeeId) === Number(empList.employeeId)) {
          this.proEmpDetail = empList;
          this.setProEmployeeDetail();
        } else if (this.proEmployeeDetailLink.promotedEmployeeId == null) {
          this.proEmployeeDetailLink = {};
        }
      })
    }
  }

  /*Promoted Employee Link set by Name change*/
  getPromotedEmployeeName() {
    this.employeeList.forEach(empList => {
      if (this.proEmployeeDetailLink.promotedEmployeeName === empList.username) {
        this.proEmpDetail = empList;
        this.setProEmployeeDetail();
      } else if (this.proEmployeeDetailLink.promotedEmployeeName === null) {
        this.proEmployeeDetailLink = {};
      }
    })
  }

  /*Promoted Employee Link Data binding*/
  setProEmployeeDetail() {
    this.proEmployeeDetailLink.promotedEmployeeId = this.proEmpDetail.employeeId;
    this.proEmployeeDetailLink.userId = this.proEmpDetail.id;
    this.proEmployeeDetailLink.promotedEmployeeName = this.proEmpDetail.username;
    this.proEmployeeDetailLink.promotedEmpMobile = this.proEmpDetail.mobile;
    this.proEmployeeDetailLink.promotedEmpRole = this.proEmpDetail.role;
    this.proEmployeeDetailLink.promotedEmpCountry = this.proEmpDetail.country;
    this.proEmployeeDetailLink.promotedEmpEmail = this.proEmpDetail.email;
    this.proEmployeeDetailLink.promotedEmpReportingManager = this.proEmpDetail.reportingManager;
    this.proEmployeeDetailLink.promotedEmpRegion = this.proEmpDetail.region;
    this.proEmployeeDetailLink.promotedEmpStore = this.proEmpDetail.store;
  }

  resetPromotedEmployee(event) {
    if (!event) {
      this.proEmployeeDetailLink = {};
    }
  }

  /* Save and update Eployee Link details */
  async saveEmployeeLink() {
    const employeeLink = { "employeeId": this.employeeDetailLink.userId, "promotedEmployeeId": this.proEmployeeDetailLink.promotedEmployeeId }
    const res: any = await this.apiHandler.postData(this.utils.API.POST_EMPLOYEE_LINK, employeeLink, this.destroyed$,
      'Employee Linked Successfully');

    this.closeEmplinkPopup();
    this.resetEmployeeList();
    this.getEmployeeList();
    this.selection.clear();
  }

  async saveEmployeeStatus() {
    const action = this.statusAction == "Make active" ? true : false;
    const employeeStatus = { "id": this.employeeStatusId, "status": action, 'delete': this.statusAction === "Delete" };
    const res: any = await this.apiHandler.postData(this.utils.API.POST_EMPLOYESS_STATUS, employeeStatus, this.destroyed$,
      this.statusAction === 'Delete' ? 'Employee deleted Successfully' : 'Employee Status Changes Successfully');
    this.closeStatusPopup();
    this.resetEmployeeList();
    this.getEmployeeList();

  }

  empCreate() {
    this.periodContainer = [];
    this.empValueStatus = true;
    this.empVal = 'Create';
    this.isButtonCreate = true;
    this.isButtonUpdate = false;
    this.empEditStatus = false;
    //this.empEditStatusMultiEdit: [] = true;
  }

  updateEmployee(data) {

    this.periodContainer = [];
    this.getEmployeePeriodData(data.id);

    this.empVal = 'Update';
    this.empEditStatus = true;
    this.empValueStatus = false;
    this.isButtonCreate = false;
    this.isButtonUpdate = true;
    this.regionEnable = false;
    this.storeEnable = false;
    this.userDetail.username = data.firstName + ' ' + data.lastName;
    this.userDetail.promotedEmployeeId = data.promotedEmployeeId;
    this.userDetail.firstName = data.firstName;
    this.userDetail.lastName = data.lastName;
    this.userDetail.mobile = data.mobile;
    this.userDetail.email = data.email;
    this.userDetail.country = data.country;
    this.loadRegionList("singleRegion", null, null);
    this.userDetail.region = data.region;
    this.userDetail.store = data.store;
    this.getStoresRegion(null);
    this.loadManagerList();
    this.userDetail.dateOfJoining = new Date(data.dateOfJoining);
    this.userDetail.role = data.role;
    this.userDetail.roleId = data.roleId;
    this.userDetail.reportingManager = data.reportingManager;
    this.userDetail.id = data.id;

  }

  async getEmployeePeriodData(userId) {
    console.log(userId);
    const res: any = await this.apiHandler.getData(this.utils.API.GET_MULTIPLE_USER, userId, this.destroyed$);
    this.multipleUserData = res.payload;
    console.log(this.multipleUserData, 'multipleUserData');
    var i = 0;

    this.multipleUserData.forEach(count => {
      this.periodId[i] = count.id;
      console.log(this.periodId[i]);
      this.empEditStatusMultiEdit[i] = true;


      this.periodContainer.push(count);

      this.countryList.forEach(country => {
        if (country.id == count.countryId) {
          this.periodCountry[i] = country.desc;

          const regions = [];
          country.child?.forEach((region: any) => {
            if (region.active === true) {
              regions.push(region);
            }
          });
          this.periodRegionList[i] = [...regions];

        }
      });

      this.periodRegionList[i].forEach(region => {

        if (region.id == count.regionId) {
          this.periodRegion[i] = region.desc;

          const stores = [];
          region.child?.forEach(store => {
            if (store.active === true) {
              stores.push(store);
            }
          });
          this.periodStoreList[i] = [...stores];

        }

      });

      this.periodStoreList[i].forEach(store => {
        if (store.id == count.storeId) {
          this.periodStore[i] = store.desc;
        }
      });

      if (count.fromDate !== null) {
        this.periodFromDate[i] = new Date(count.fromDate);
      } else {
        this.periodFromDate[i] = count.fromDate;
      }

      if (count.toDate !== null) {
        this.periodToDate[i] = new Date(count.toDate);
      } else {
        this.periodToDate[i] = count.toDate;
      }


      i++;

    });

    //this.periodContainer.push(periodContainterDataLength);
  }

  updateUserDetail() {
    this.saveUserDetail('update');
  }


  async invite360Mobile() {

    this.inviteEmpData = [];
    this.selection.selected.forEach((select: any) => {
      const inviteEmpObj: any = {};
      inviteEmpObj.employeeId = select.employeeId;
      inviteEmpObj.email = select.email;
      inviteEmpObj.type = this.inviteType;
      this.inviteEmpData.push(inviteEmpObj);
    });

    if (this.inviteEmpData.length > 0) {
      this.closeInviteMail();
      const res: any = await this.apiHandler.postData(this.utils.API.POST_INVITE_MAIL, this.inviteEmpData, this.destroyed$,
        `360 ${this.inviteType} Invite Sent`);
    }

  }

  rowSelected(row: any) {
    return this.selection.selected.find(select => select.employeeId === row.employeeId);
  }

  closeInviteMail() {
    this.closeInvite360Modal.nativeElement.click();
    this.selection.clear();
  }

  openSuggestCourse(data) {
    // this.ngxService.start();
    this.getCourseCallCount = 0;
    this.empCourseList = [];

    this.formSuggestCourseObj = {};
    this.formSuggestCourseObj = data;

    this.getCourses({ ...data });
  }

  async getCourses(data) {
    this.showShimmer1 = true;

    let level1Courses: any;
    let level2Courses: any;
    let level3Courses: any;
    let suggestedCourses: any;
    let checkListCourses: any;
    let policies: any;
    let faceToFace: any;

    const param1: any = {
      userId: data.id,
      countryId: data.countryId,
      regionId: data.regionId,
      storeId: data.storeId,
      levelId: data.currentLevel,
      roleId: data.roleId,
      type: 'Course',
      suggested: true
    }

    const param2: any = {
      userId: data.id,
      countryId: data.countryId,
      regionId: data.regionId,
      storeId: data.storeId,
      levelId: data.currentLevel,
      roleId: data.roleId,
      type: 'Policies',
      suggested: true
    }

    const [api1Response, api2Response, api3Response]: any = await Promise.all([
      this.apiHandler.postData(this.utils.API.POST_USER_COURSE, param1, this.destroyed$),
      this.apiHandler.postData(this.utils.API.POST_USER_COURSE, param2, this.destroyed$),
      this.apiHandler.postData(this.utils.API.GET_FF_COURSES, { userId: data.id }, this.destroyed$)
    ]);

    api1Response.payload.data?.forEach((userCourse) => {
      userCourse.isSuggested = false;
      this.empCourseList.push(userCourse);
    });
    api1Response.payload.suggestedCourses?.forEach((suggest) => {
      suggest.isSuggested = true;
      this.empCourseList.push(suggest);
    });
    api2Response.payload.data?.forEach((policy) => {
      policy.isSuggested = true;
      this.empCourseList.push(policy);
    });

    this.empCourseList = this.empCourseList.concat(api3Response.payload);

    level1Courses = this.sortCourses('Level1');
    level2Courses = this.sortCourses('Level2');
    level3Courses = this.sortCourses('Level3');
    checkListCourses = this.sortCourses('checkList');
    suggestedCourses = this.sortCourses('suggested');
    policies = this.sortCourses('policy');
    faceToFace = this.sortCourses('Face to Face');

    this.empCourseList = level1Courses.concat(level2Courses, level3Courses, checkListCourses, suggestedCourses, policies, faceToFace);

    this.empCourseList = [...this.empCourseList];
    this.showShimmer1 = false;

  }

  sortCourses(filterBy: any) {
    let filteredValues: any;
    if (filterBy === 'Level1' || filterBy === 'Level2' || filterBy === 'Level3') {
      filteredValues = this.empCourseList.filter((ele: any) => ele.levelName === filterBy);
    } else if (filterBy === 'checkList') {
      filteredValues = this.empCourseList.filter((ele: any) => ele.courseTypeCode === 'LA005');
    } else if (filterBy === 'suggested') {
      filteredValues = this.empCourseList.filter((ele: any) => ele.isSuggested && ele.courseTypeCode !== 'LA004' && ele.courseTypeCode !== 'LA005');
    } else if (filterBy === 'policy') {
      filteredValues = this.empCourseList.filter((ele: any) => ele.courseTypeCode === 'LA004');
    } else if (filterBy === 'Face to Face') {
      filteredValues = this.empCourseList.filter((ele: any) => ele.courseType === filterBy);
    }
    return filteredValues.sort((a: any, b: any) => (a.completionDate > b.completionDate) ? 1 : -1);
  }

  async changeSuggestRoleList(event) {
    const roleId = event.id;
    this.suggestedPayloadObj.roleName = event.desc;
    this.suggestedPayloadObj.roleId = event.id;
    const res: any = await this.apiHandler.getData(this.utils.API.GET_LEVELS, roleId, this.destroyed$);
    this.empSuggestedLevels = res.payload;
  }

  setSuggestedCourse(event, items) {
    if (this.selectedRoleGroup.length > 0) {
      this.suggestButtonEnabled = false;
    } else {
      this.suggestButtonEnabled = true;
    }
    this.suggestSelectedValues.push(items.value);
    // this.suggestedPayloadObj.userId = this.selection.selected[0].id;
  }

  /* Post Suggested Course Data */
  checkSuggestedCourse() {
    if (this.selectedRoleGroup.length > 0) {
      this.suggestButtonEnabled = false;
    } else {
      this.suggestButtonEnabled = true;
    }
  }

  /* Post Suggested Course Data */
  async postSuggestedCourseData() {
    if (this.getSelectedTableRow().length > 1) this.ngxService.start();
    this.showShimmer2 = true;
    this.suggestedPayloadObj.levels = [];
    this.suggestedPayloadObj.courseId = [];
    this.roleCourseDetails.forEach((lev) => {
      this.selectedRoleGroup.forEach((selectedId) => {
        if (selectedId == lev.courseId) {
          let levels: any = {};
          let courses: any = {};
          courses.id = lev.courseId;
          courses.name = lev.courseName;
          courses.levelId = lev.levelId;
          courses.levelName = lev.levelName;
          this.suggestedPayloadObj.courseId.push(courses);
        }
      });
    });
    this.suggestedPayloadObj.assigningUserId = this.userDetailValue.id;
    this.suggestedPayloadObj.assigningUserRoleId = this.userDetailValue.roleId;
    this.suggestedPayloadObj.users = this.selectedRowDetail.map(ele => ({ userId: ele.id, roleId: ele.roleId, roleName: ele.role }));
    this.suggestedPayloadObj.managerName = this.userDetailValue.username;

    const res: any = await this.apiHandler.postData(this.utils.API.POST_SUGGEST_LEVEL, this.suggestedPayloadObj, this.destroyed$);
    if (this.getSelectedTableRow().length > 1) {
      this.suggestModal.nativeElement.click();
      this.ngxService.stop();
    }
    this.showShimmer2 = true;
    this.getSuggestedCourseData();
    this.selectedRoleGroup = "";
  }

  /* Getting Suggested Course Data List*/
  async getSuggestedCourseData() {
    this.showShimmer2 = true;
    this.suggestedUserIdObj.userId = this.selection.selected[0].id;
    const resRoleCourse: any = await this.apiHandler.postData(this.utils.API.GET_ROLE_COURSES, this.suggestedUserIdObj, this.destroyed$);
    this.roleCourseDetails = resRoleCourse.payload;
    if (this.getSelectedTableRow().length === 1) {
      const sugUserId = this.selection.selected[0].id;
      const res: any = await this.apiHandler.getData(this.utils.API.GET_SUGGESTED_COURSES, sugUserId, this.destroyed$);
      this.empSuggestedCourseDetails = res.payload;
      const datechange = moment(this.empSuggestedCourseDetails.created);
      const dateFormat = 'YYYY-MM-DD HH:mm:ss';
      this.empSuggestedCourseDetails.created = (datechange?.format(dateFormat));
    }
    // this.ngxService.stop();
    this.showShimmer1 = false;
    this.showShimmer2 = false;
  }

  /* Getting Manager Confirmation Data List*/
  async getManagerConfirmation(data) {
    this.showShimmer1 = true;
    this.formSuggestCourseObj = {};
    this.formSuggestCourseObj = data;

    this.confirmationPayloadObj.userId = data.id;
    this.confirmationPayloadObj.countryId = this.userDetailValue.countryId;
    this.confirmationPayloadObj.regionId = this.userDetailValue.regionId;
    this.confirmationPayloadObj.storeId = this.userDetailValue.storeId;
    const response: any = await this.apiHandler.postData(this.utils.API.GET_MANAGER_CONFIRMATION, this.confirmationPayloadObj, this.destroyed$);
    this.confirmationCourseList = response.payload;
    const datechange = moment(this.confirmationCourseList.completedDate);
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    this.confirmationCourseList.completedDate = (datechange?.format(dateFormat));
    this.showShimmer1 = false;
  }

  /* Removed Suggested Course*/
  async deleteSuggestedCourse(event) {
    // this.ngxService.start();
    this.showShimmer2 = true;
    console.log(event, 'deleteEvent');
    this.suggestDeletePayloadObj.userId = event.userId;
    this.suggestDeletePayloadObj.courseId = [];
    this.suggestDeletePayloadObj.levels = event.levelId;
    this.suggestDeletePayloadObj.courseId.push(event.courseId);
    const response: any = await this.apiHandler.postData(this.utils.API.DELETE_SUGGEST_COURSE, this.suggestDeletePayloadObj, this.destroyed$);
    this.getSuggestedCourseData();
  }

  /* Manager Confirmation API Trigger and recall the Employee List API*/
  async managerConfirm(event) {
    this.managerConfirmPayloadObj.userId = this.confirmationPayloadObj.userId;
    this.managerConfirmPayloadObj.courseId = event.courseId;
    this.managerConfirmPayloadObj.managerId = this.userDetailValue.id;
    this.managerConfirmPayloadObj.chapterId = event.chapterId;
    const response: any = await this.apiHandler.postData(this.utils.API.MANAGER_CONFIRM_COURSE, this.managerConfirmPayloadObj, this.destroyed$,
      'Confirmed Successfully');
    this.emitService.emitCommonSubject({});
    this.getManagerConfirmation(this.formSuggestCourseObj);
    if (this.confirmationCourseList.length == 1) {
      this.closeMagConfirmationModal.nativeElement.click();
      this.resetEmployeeList();
      this.getEmployeeList();
    }
  }

  addPrieod() {
    this.periodContainer.push(++this.counter);

    //this.periodContainer.push(this.periodContainer.length);
    console.log(this.periodCountry, 'this.periodCountry');
    console.log(this.multipleUserData, this.multipleUserData.length, this.periodContainer);
    var j = 0;
    this.periodContainer.forEach(period => {
      if (period.id) {
        this.empEditStatusMultiEdit[j] = true;
      } else {
        this.empEditStatusMultiEdit[j] = false;
      }
      j++;
    })
  }


  async deletePrieod(index: number, event) {

    console.log(this.periodCountry, index, 'delete index');
    //const deleteId = {};
    //this.deleteId = this.periodContainer[index].id;

    if (this.periodContainer[index].id) {

      const crs = { "id": this.periodContainer[index].id }
      const response: any = await this.apiHandler.postData(this.utils.API.POST_DELETE_MULTILE, crs, this.destroyed$);
      if (response) {
        this.removePeriodContainer(index)
      }
    } else {
      this.removePeriodContainer(index)
    }

  }

  removePeriodContainer(index) {
    this.periodContainer.splice(index, 1);
    //this.periodCountry.splice(index, 1);
    delete this.periodCountry[index];
    delete this.periodRegion[index];
    delete this.periodStore[index];
    delete this.periodFromDate[index];
    delete this.periodToDate[index];

    this.reIndex();

  }

  reIndex() {
    const pc = [];
    const pr = [];
    const ps = [];
    const pf = [];
    const pt = [];

    this.periodCountry.forEach(data => {
      pc.push(data);
    });
    this.periodRegion.forEach(data => {
      pr.push(data);
    });
    this.periodStore.forEach(data => {
      ps.push(data);
    });
    this.periodFromDate.forEach(data => {
      pf.push(data);
    });
    this.periodToDate.forEach(data => {
      pt.push(data);
    });
    console.log(pc, 'pc');

    this.periodCountry = [...pc];
    this.periodRegion = [...pr];
    this.periodStore = [...ps];
    this.periodFromDate = [...pf];
    this.periodToDate = [...pt];
    console.log(this.periodCountry), 'periodCountry';
  }
  cleanoldSuggest() {
    this.empSuggestedCourseDetails = []
  }

  deleteSelectedUser(element: any) {
    this.selection.deselect(element);
    if (this.selectedRowDetail.length === 1) {
      this.getSuggestedCourseData();
    }
  }


  assignUserList: any = [];

  masterRoleList: any = [];
  learnerRoleList: any = [];
  learnerRoleId: any;
  incidentRoleList: any = [];
  incidentRoleId: any;
  auditRoleList: any = [];
  auditRoleId: any;
  authRoleList: any = [];
  authRoleId: any;

  roleIds: any = [];

  openAssignUserPopup() {
    this.assignUserList = [];
    this.selection.selected.forEach(employee => {
      let employeeObj: any = {};
      employeeObj.id = employee.id;
      employeeObj.empName = employee.username;
      this.assignUserList.push(employeeObj);
    });
    this.getAssignRoleList();
  }

  async getAssignRoleList() {
    /* const response: any = [
      {
        "id": 5,
        "roleName": "LA super admin",
        "active": true,
        "createdAt": 1693386432000,
        "updatedAt": null,
        "access": "{\"roleName\":\"LA super admin\",\"app\":{\"id\":1,\"name\":\"Learners App\",\"groupName\":\"Learn\",\"access\":true,\"modules\":[{\"name\":\"Employees\",\"id\":1,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"Courses\",\"id\":4,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"Useraccess\",\"id\":5,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"f2freports\",\"id\":6,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"messages\",\"id\":7,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"Reports\",\"id\":8,\"view\":true,\"create\":true,\"update\":true,\"access\":true}]},\"id\":0}",
        "roleId": null
      },
      {
        "id": 6,
        "roleName": "IT store manager",
        "active": true,
        "createdAt": 1693386491000,
        "updatedAt": null,
        "access": "{\"roleName\":\"IT store manager\",\"app\":{\"id\":2,\"name\":\"Incident Tracker\",\"groupName\":\"Health \\u0026 Safety\",\"access\":true,\"modules\":[{\"name\":\"Incident Tracker\",\"id\":2,\"view\":true,\"create\":true,\"update\":true,\"access\":true}]},\"id\":0}",
        "roleId": null
      },
      {
        "id": 7,
        "roleName": "AT store manager",
        "active": true,
        "createdAt": 1693386491000,
        "updatedAt": null,
        "access": "{\"roleName\":\"AT store manager\",\"app\":{\"id\":3,\"name\":\"Audit Tracker\",\"groupName\":\"Health \\u0026 Safety\",\"access\":true,\"modules\":[{\"name\":\"Audit Tracker\",\"id\":3,\"view\":true,\"create\":true,\"update\":true,\"access\":true}]},\"id\":0}",
        "roleId": null
      },
      {
        "id": 8,
        "roleName": "App auth",
        "active": true,
        "createdAt": 1693386491000,
        "updatedAt": null,
        "access": "{\"roleName\":\"App auth\",\"app\":{\"id\":4,\"name\":\"App Auth\",\"groupName\":\"APP AUTH\",\"access\":true,\"modules\":[{\"name\":\"Roles\",\"id\":9,\"view\":true,\"create\":true,\"update\":true,\"access\":true},{\"name\":\"User role mapping\",\"id\":10,\"view\":true,\"create\":true,\"update\":true,\"access\":true}]},\"id\":0}",
        "roleId": null
      }
    ]; */
    const response: any = await this.incidentApiHandler.getData(this.utils.API.GET_AUTH_ROLES);
    const roleList = response.map(role => JSON.parse(role.access));
    roleList.forEach((element, index) => {
      element.id = response[index].id;
    });
    this.masterRoleList = [...roleList];
    this.constructRoleList();

    const roleTypeList = [{ name: 'laRole', list: this.learnerRoleList }, { name: 'itRole', list: this.incidentRoleList }, { name: 'atRole', list: this.auditRoleList }];
    roleTypeList.forEach(ele => {
      this.setAvailableFilters(ele.name, ele.list);
    })
  }

  setAvailableFilters(property: any, list: any) {
    this.availableFilter[property] = list.map(role => {
      let obj = {
        name: role,
        key: role
      }
      return obj;
    });
    this.availableFilter[property].unshift({ name: 'All', key: 'All' });
  }

  constructRoleList() {
    let learner: any = [{ id: 0, roleName: 'None', app: { appCode: 'LA' } }];
    let incident: any = [{ id: 0, roleName: 'None', app: { appCode: 'IT' } }];
    let audit: any = [{ id: 0, roleName: 'None', app: { appCode: 'AT' } }];
    let auth: any = [{ id: 0, roleName: 'None', app: { appCode: 'AA' } }];

    this.masterRoleList.forEach(role => {
      if (role.app.appCode === 'LA') {
        learner.push(role);
      } else if (role.app.appCode === 'IT') {
        incident.push(role);
      } else if (role.app.appCode === 'AT') {
        audit.push(role);
      } else if (role.app.appCode === 'AA') {
        auth.push(role);
      }
    });

    this.learnerRoleList = [...learner];
    this.incidentRoleList = [...incident];
    this.auditRoleList = [...audit];
    this.authRoleList = [...auth];
  }

  sendEmployeetof2f(data:any){
   this.sendDatatof2f.emit(data)
   this.selectedEmployeesData = [];
   this.checkedAll = false;
   this.indeterminateAll = false;
   for(let x of this.employeeList){
    x.checked = false
   }
  }
  closepopup(){
    this.closeEmppopup.emit();
  }
}
