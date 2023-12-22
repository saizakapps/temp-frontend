import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Utils } from '../shared/utils';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { Subject } from 'rxjs';
import { throttle as _throttle, noop as _noop } from "lodash-es";
import { MatTable } from '@angular/material/table';

import * as moment from 'moment';
import _ from 'underscore';
import * as __ from 'lodash';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { CdkColumnDef } from '@angular/cdk/table';
import * as $ from 'jquery';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  /* search variables */
  searchEmployee: any = [{ name: 'Employee ID', key: 'employeeId' }, { name: 'Employee Name', key: 'employeeName' }];
  searchBy: any = 'employeeId';
  portalRoleId: any = null;
  searchTextValue: any = null;

  sfRoleIdList: any = [];
  portalRoleIdList: any = [];

  userMgmtColumns: any = [];
  userMgmtColumnsToDisplay: any = [];

  userListData: any = [];
  userListDataTotalCount: any = [];
  userListPayloadObj: any = {};
  listData: any = [];
  cloneUserListDataList: any = [];
  start: number = 0;
  limit: number = 300;
  end: number = this.limit + this.start;

  /* sort by filter variables */
  sortBy: any = 'Sort By Asc';
  sortByVal: any = 'asc';
  sortByField: any;
  /* Table Sort Variable */
  sortOption: any = this.utils.ddOptions.sortOption;

  destroyed$: Subject<void> = new Subject<void>();

  selectedRowDetail: any = {};
  selection = new SelectionModel(true, []);

  roleSelected: any = false;
  inviteUserList: any = [];
  inviteColumns: string[] = ['id', 'empName', 'action'];
  empEditObj: any = [];
  userUpdatePayloadObj: any = [];

  indeterminate: any;
  portalStatus: any;
  sfStatus: any;

  /* Modal variables */
  modalLabel: any;
  modalButton: any;

  @ViewChild('table1', { static: true }) table1: MatTable<string[]>;
  @ViewChild('closeInviteModal', { static: false }) public closeInviteModal: ElementRef;
  @ViewChild('closeUserEditModal', { static: false }) public closeUserEditModal: ElementRef;
  @ViewChild('statusPopover') public statusPopover: NgbPopover;

  portalRoles: any = [];
  /* status */
  currentFilters: any = {
    sfRole: [],
    portalRole: []
  };

  availableFilter: any = {
    'sfStatus': [{ name: 'All', key: 'All' }, { name: 'Active', key: true }, { name: 'Inactive', key: false }],
    'portalStatus': [{ name: 'All', key: 'All' }, { name: 'Invited', key: true }],
    'sfRole': [],
    'portalRole': []
  };

  cloneSfRole: any;
  clonePortalRole: any;
  recordFound:boolean = false;
  showShimmer:boolean = true;
  constructor(
    public utils: Utils,
    private apiHandler: ApiHandlerService,
    private elRef: ElementRef,
    private errorHandler: ErrorHandlerService,
    private changeDetectorRefs: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService
  ) {

  }

  ngOnInit(): void {
    this.getModuleAccess();
    this.userMgmtColumns = this.utils.TABLE_HEADERS.USER_MANAGEMENT_TABLE;
    this.userMgmtColumnsToDisplay = this.userMgmtColumns.map((col: { name: any; }) => col.name);
    //this.getUsersList();
    this.getPortalRoles();
    this.getSfRoles();
    this.getUsersList(this.start, this.end);
    console.log(this.userListData, 'this.userListData');
    this.updateIndex();
    this.getSelectedCheckbox();
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-UA');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
  }

  onTableScroll(e) {
    const tableViewHeight = e.target.offsetHeight // viewport
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 400;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      const listRemainDataCount = ((this.userListDataTotalCount - this.userListData.length));
      console.log(listRemainDataCount, 'listRemainDataCount');
      if (listRemainDataCount > 0) {
        this.getUsersList(this.start, this.end);
        this.updateIndex();
      }
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.userListData);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userListData.length;
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
    return this.selection.selected.map(item => item);
  }

  // getTableData(start, end) {
  //   console.log(start, end);
  //   return ELEMENT_DATA.filter((value, index) => index >= start && index < end)
  // }

  updateIndex() {
    this.start = this.end;
    this.end = this.limit + this.start;
  }

  updateSort(sortBy?, sortObj?) {
    // this.statusPopover.close();
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    console.log(this.sortBy, this.sortByField);
    this.start = 0;
    this.end = this.limit + this.start;
    this.userListData = [];
    if (this.sortBy === 'Sort By Asc') {
      this.sortByVal = 'asc';
      // this.userListData = (__.sortBy([...this.userListData], [element => element[this.sortByField].toLowerCase()]));
    } else if (this.sortBy === 'Sort By Desc') {
      this.sortByVal = 'desc';
      // this.userListData = (__.sortBy([...this.userListData], [element => element[this.sortByField].toLowerCase()])).reverse();
    } else if (this.sortBy === 'Reset') {
      this.sortByField = 'employeeId';
      this.sortByVal = 'asc';
      //this.userListData = [...this.cloneUserListDataList];
    }
    this.getUsersList(this.start, this.end);
  }

  /* Table filter apply */
  updateFilter(items, column, multi?: boolean) {
    if (multi) {
      if (items.checked) {
        console.log(items, 'items');
        if (column.property === 'sfRole') {
          this.availableFilter[column.property].forEach(element => {
            if (element.checked) {
              this.sfRoleIdList.push(element.key);
            }
          });
        } else {
          this.availableFilter[column.property].forEach(element => {
            if (element.checked) {
              this.portalRoleIdList.push(element.key);
            }
          });
        }
      }
    } else {
      if (column.property === 'sfStatus') {
        if (items.key !== 'All') {
          this.sfStatus = items.key;
        } else {
          this.sfStatus = null;
        }
      } else {
        if (items.key !== 'All') {
          this.portalStatus = items.key;
        } else {
          this.portalStatus = null;
        }
      }
      this.getUsersList(0, 300);
    }
    console.log(this.availableFilter);
  }

  callGetUsersList(property) {
    if (property === 'sfRole' || property === 'portalRole') {
      if (property === 'sfRole') {
        if (JSON.stringify(this.availableFilter[property]) !== JSON.stringify(this.cloneSfRole)) {
          this.cloneSfRole = $.extend(true, [], this.availableFilter[property]);
        } else {
          return;
        }
      } else {
        if (JSON.stringify(this.availableFilter[property]) !== JSON.stringify(this.clonePortalRole)) {
          this.clonePortalRole = $.extend(true, [], this.availableFilter[property]);
        } else {
          return;
        }
      }
      this.getUsersList(0, 300);
    }
  }

  selectAll(event, property) {
    this.availableFilter[property].forEach(element => {
      if (event.checked) {
        element.checked = true;
      } else {
        element.checked = false;
      }
    });
    this.callGetUsersList(property);
  }

  selectionToggle(property) {
    let checkedCount = 0;
    this.availableFilter[property].forEach(element => {
      if (element.checked) {
        checkedCount++;
      }
    });
    if (checkedCount !== this.availableFilter[property].length) {
      this.indeterminate = true;
    }
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

  callGetFilteredList(type: any, event?: boolean, isPopup?: boolean) {

    /* Bind searchBy in request */
    // if (type === 'search' && this.filterRequest.searchText !== this.searchTextModal) {
    //   this.filterRequest.searchText = this.searchTextModal;
    //   this.filterRequest.searchBy = this.searchBy;
    //   this.getFilteredList();
    // }

  }

  /* apply search by item */
  applySearchByLabel() {
    const searchObj = this.searchEmployee.find(obj => obj.key === this.searchBy);
    if (this.checkMinimumChar(3, this.searchTextValue?.length)) {
      return;
    }
    this.getUsersList(0, 300);
  }

  clearSearchText() {
    this.searchTextValue = '';
  }


  async getUsersList(start, end) {
    // this.ngxService.start();
    this.recordFound = false;
    this.showShimmer = true;
    this.userListData = [];
    const logedUserValues = JSON.parse(localStorage.getItem("userDetails"));
    console.log(logedUserValues, 'logedUserValues');

    this.userListPayloadObj = {
      "currentEmployeeId": logedUserValues.employeeId,
      "searchBy": this.searchBy,
      "searchValue": this.searchTextValue,
      "sfRoleId": this.sfRoleIdList,
      "portalRoleId": this.portalRoleIdList,
      "sfStatus": this.sfStatus,
      "portalStatus": this.portalStatus,
      "start": start,
      "end": end,
      "sortBy": this.sortByField,
      "sortDir": this.sortByVal
    };

    const response: any = await this.apiHandler.postData(this.utils.API.GET_USER_LIST, this.userListPayloadObj, this.destroyed$);
    this.listData = response.payload.recordList;
    this.userListDataTotalCount = response.payload.count;
    console.log(this.listData, 'listData');
    this.userListData = this.userListData.concat(this.listData);
    console.log(this.userListData.length, 'this.userListData');
    this.resetFilterList();
    // this.ngxService.stop();
    this.showShimmer = false;
    this.recordFound = true;
    return this.listData;
  }

  resetFilterList() {
    this.sfRoleIdList = [];
    this.portalRoleIdList = [];
  }

  async updateUser(value) {
    console.log(value);
    this.portalRoleId = value.portalRoleId;
    this.empEditObj = {};
    this.empEditObj.empId = value.employeeId;
    this.empEditObj.empName = value.employeeName;
    this.empEditObj.empRole = value.sfRole;
    this.empEditObj.empEmail = value.email;

  }

  inviteUsersList() {
    this.userUpdatePayloadObj = {};
    this.userUpdatePayloadObj.employeeIds = [];
    this.inviteUserList.forEach(element => {
      this.userUpdatePayloadObj.employeeIds.push(element.empId);
    });
    this.userUpdatePayloadObj.portalRoleId = this.portalRoleId;
    this.userUpdatePayloadObj.portalStatus = true;
    this.userUpdatePayloadObj.action = 'invite';
    const message = "Invited successfully";
    this.sendUserUpdateDetails(message);
    this.closeInviteModal.nativeElement.click();

  }

  roleChange() {
    this.roleSelected = this.portalRoleId == null ? false : true;
  }

  closeUserRole() {
    this.portalRoleId = null;
    this.roleSelected = this.portalRoleId == null ? false : true;
  }

  openPopup(element: any) {
    if (element === 'invite') {
      this.modalLabel = 'Invite to Portal';
      this.modalButton = 'Invite'
    } else if (element === 'revoke') {
      this.modalButton = 'Revoke';
      this.modalLabel = 'Revoke portal access';
    }
    this.inviteUserList = [];
    this.selection.selected.forEach(employee => {
      let employeeObj: any = {};
      employeeObj.empId = employee.employeeId;
      employeeObj.empName = employee.employeeName;
      this.inviteUserList.push(employeeObj);
    });
  }

  modalOkClick() {
    if (this.modalButton === 'Invite') {
      this.inviteUsersList();
    } else if (this.modalButton === 'Revoke') {
      this.revokeUserList();
    }
  }

  updateUserRole() {
    this.userUpdatePayloadObj = {};
    this.userUpdatePayloadObj.employeeIds = [];
    this.userUpdatePayloadObj.employeeIds.push(this.empEditObj.empId);
    this.userUpdatePayloadObj.portalRoleId = this.portalRoleId;
    this.userUpdatePayloadObj.portalStatus = null;
    this.userUpdatePayloadObj.action = 'roleupdate';
    const message = "360° Role Updated successfully";
    this.sendUserUpdateDetails(message);
    this.closeUserEditModal.nativeElement.click();
  }

  revokeUserList() {
    this.userUpdatePayloadObj = {};
    this.userUpdatePayloadObj.employeeIds = [];
    this.inviteUserList.forEach(element => {
      this.userUpdatePayloadObj.employeeIds.push(element.empId);
    });
    this.userUpdatePayloadObj.portalRoleId = this.portalRoleId;
    this.userUpdatePayloadObj.portalStatus = false;
    this.userUpdatePayloadObj.action = 'revoke';
    const message = "Revoked successfully";
    this.sendUserUpdateDetails(message);
    this.closeInviteModal.nativeElement.click();
  }

  removeInvite(data) {
    // console.log(data, 'data');
    // let tempRemoveListArry = [];

    this.inviteUserList = this.inviteUserList.filter((item) => item.empId !== data.empId);

    // console.log(tempRemoveListArry, 'tempRemoveListArry');
    //this.inviteUserList = [...tempRemoveListArry];
    //console.log(this.inviteUserList, 'this.inviteUserList');
    this.table1.renderRows();
    //this.changeDetectorRefs.detectChanges();
  }

  async getPortalRoles() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_PORTAL_ROLES, '', this.destroyed$);
    console.log(response.payload, 'portal roles response');
    this.portalRoles = response.payload;
    this.portalRoles.forEach(category => {
      this.availableFilter.portalRole?.push({ name: category?.portalRole, key: category?.id, checked: false });
    })
  }

  async getSfRoles() {
    const response: any = await this.apiHandler.getData(this.utils.API.GET_SF_ROLES, '', this.destroyed$);
    console.log(response.payload, 'portal roles response');
    const sfRoles = response.payload;
    sfRoles.forEach(category => {
      this.availableFilter.sfRole?.push({ name: category?.sfRole, key: category?.id, checked: false });
    })
  }

  async sendUserUpdateDetails(message) {
    const response: any = await this.apiHandler.postData(this.utils.API.POST_USER_BASED_ACTION, this.userUpdatePayloadObj, this.destroyed$, message);
    this.selection.clear();
    this.start = 0;
    this.end = this.limit + this.start;
    this.getUsersList(this.start, this.end);
  }

  /*
  getFilterLists() {
    this.buildFilterList(this.userListData, 'sfRole');
  }

  buildFilterList(data, property) {
    const uniqData = _.sortBy(_.compact(_.uniq(_.pluck(data, property))));
    this.availableFilter[property] = uniqData?.map((item) => {
      const temp: any = {};
      temp.name = item;
      temp.key = data.find(ele => ele.sfRole === item).sfRoleId;
      temp.checked = false;
      return temp;
    });
    if (uniqData.length > 0) {
      this.availableFilter[property].unshift({ name: 'All', key: 'All' });
    }
    console.log(this.availableFilter);
  } */

}
