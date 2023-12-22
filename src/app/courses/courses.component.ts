import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { NestedTreeControl } from '@angular/cdk/tree';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Utils } from '../shared/utils';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import _ from 'underscore';
import * as __ from 'lodash';
import * as $ from 'jquery';
import { CommonService } from '../shared/services/common.services';
import { Router } from '@angular/router';
import { ApiHandlerService } from '../shared/services/api-handler.service';
import { of, Subject } from 'rxjs';
import { ErrorHandlerService } from '../shared/services/error-handler.service';
import moment from 'moment';

export interface GroupBy {
  level: number;
  isGroupBy: boolean;
  name: string;
  checked: boolean;
  state: string
  courseName: string;
  roleGroup: string;
  country: string;
  region: string;
  store: string;
}
@Component({
  selector: 'table-expandable-rows-example',
  styleUrls: ['courses.component.scss'],
  templateUrl: 'courses.component.html'
})

export class CoursesComponent implements OnInit, OnDestroy {

  @ViewChild('statusModal', { static: false }) public statusModal: ElementRef;
  @ViewChild('table', { static: true }) table: MatTable<string[]>;
  @ViewChildren(NgbPopover) popovers: QueryList<NgbPopover>;

  view: boolean = false;
  create: boolean = false;
  update: boolean = false;

  public modules: any;

  courseCode: any = this.utils.CourseCode;

  newCourseDD: any = this.utils.ddOptions.DD_LABELS;
  selectedCountryDropDown: any = [];
  selectedRoleGroupDropDown: any = [];
  courseListSort: any = [];
  dragDropResponse: any;

  intialCallCount: number = 4;
  theImp: any = [];
  thatImp: any = [];
  theCloneImp: any = [];
  thatCloneImp: any = [];
  viewType: any = 'course';
  courseCategory: any = [];
  courseListColumns: any = [];
  courseListColumnsToDisplay: any = [];
  courseList: any = [];
  courseListGroupingObj: any = {};
  courseListGrouping: any = [];
  cloneCourseList: any = [];
  searchTextValue: any = '';
  roleGroupList: any = [];
  cloneRoleGroupList: any = [];
  roleList: any = [];
  statusList: any = [{ name: 'Enable', key: 'Active' }, { name: 'Disable', key: 'Inactive' }, { name: 'Delete', key: 'Delete' }];
  countryList: any = [];
  regionList: any = [];
  storeList: any = [];
  selectedRoleGroup: any = [];
  selectedRole: any = [];
  selectedStatus: any;
  selectedCountry: any = [];
  selectedRegion: any = [];
  selectedStore: any = [];
  statusAction: any = [];
  actionModalObj: any = {};
  statusActionList: any[];
  inactiveCount: any = [];
  activeCount: any = [];
  dateFilterOptions: any = [
    {
      name: 'All',
      key: 'all'
    },
    {
      name: 'Today',
      key: 'today',
      fromDate: moment().startOf('day'),
      toDate: moment().endOf('day')
    },
    {
      name: 'Past 3 Months',
      key: 'pastThree',
      fromDate: moment().subtract(3, 'month').startOf('day'),
      toDate: moment().endOf('day')
    },
    {
      name: 'Past 6 Months',
      key: 'pastSix',
      fromDate: moment().subtract(6, 'month').startOf('day'),
      toDate: moment().endOf('day')
    }
  ];
  filteredDate: any = {
    name: 'All',
    key: 'all'
  };

  roleGroup: any = {};
  countryRegionStore: any = {};
  cloneCountryRegionStore: any = {};
  // suggestedRoleGroup: any = {}
  currentFilters: any = {
    externalCourseName: 'All',
    courseTypeName: 'All',
    roleGroupName: 'All',
    roleName: 'All',
    editedBy: 'All',
    createdBy: 'All',
    courseStatus: 'All'
  };
  availableFilter: any = {
    //courseType: this.utils.ddOptions.DD_LABELS.courseType,
    courseTypeName: [{ name: 'All', key: 'All' }],
    courseStatus: this.utils.ddOptions.DD_LABELS.courseStatus
  };
  viewTypes: any = [{ name: 'Role group', key: 'roleGroup' }, { name: 'Course view', key: 'course' }]

  /* sort by filter variables */
  sortBy: any = 'Sort By Desc';
  sortByField: any = 'updatedTime';

  /* Table Sort Variable */
  sortOption: any = this.utils.ddOptions.sortOption;

  roleTreeControl: any = new NestedTreeControl<any>((node: any) => node.child);
  hasChild: any = (_: number, node: any) => !!node.child && node.child.length > 0;

  /* height variables */
  pageContainerHeight: any = 0;
  tableRowHeight = 40;
  filterBarHeight = 60;

  /* pagination count variables */
  courseTable = 1;
  courseTableItemCount: any = 1;
  noOfPageInPagination: any = 5;

  /* Data rendered check variable */
  recordFound:boolean = false;

  storeCount: any;
  levelCount: any;
  selectedStoreCount: any;
  selectedLevelCount: any;

  destroyed$: Subject<void> = new Subject<void>();

  showShimmer:boolean = false;

  constructor(public utils: Utils, private ngxService: NgxUiLoaderService,
    private modalService: NgbModal, private emitService: CommonService, private router: Router, private apiHandler: ApiHandlerService, private errorHandler: ErrorHandlerService) {
    /* get page height */
    setTimeout(() => {
      this.pageContainerHeight = document.getElementsByClassName('page-container')[0].clientHeight;
      /* set height of table container */
      this.setHeightOfContainer();
    });
  }

  ngOnInit(): void {
    this.getModuleAccess();
    this.courseListColumns = this.utils.TABLE_HEADERS.COURSE_LIST_TABLE;
    this.courseListColumnsToDisplay = this.courseListColumns.map((col: { name: any; }) => col.name);
    this.getCourseConfig()
    this.getRoleGroup();
    this.getAllCountries();
    this.getCourseList();
  }

  getModuleAccess() {
    const accessApps = JSON.parse(localStorage.getItem('accessApps'));
    let module: any;
    for (let role of accessApps) {
      module = role.app.modules.find(module => module.moduleCode === 'LA-C');
      if (module) {
        break;
      }
    }
    this.view = module.view;
    this.create = module.create;
    this.update = module.update;
  }

  /* page height calculation */
  /* while resize page */
  onResize() {
    this.setHeightOfContainer();
    this.courseTable = 1;
  }
  /* set init height for containers */
  setHeightOfContainer() {
    /* 60 - footer height */
    this.pageContainerHeight = document.getElementsByClassName('page-container')[0].clientHeight - this.filterBarHeight - 60;
    this.setPageCount(this.pageContainerHeight);
  }
  /* set item per page based on height
      T1Height - Employee table
  */
  setPageCount(T1Height) {
    /* change item per page count based on height of the table */
    /* 80 - is the height of table header, margin and paddings */
    this.courseTableItemCount = Math.floor(((T1Height - 80) / this.tableRowHeight)) > 0 ?
      Math.floor(((T1Height - 80) / this.tableRowHeight)) : 1;
  }

  /* Get Course Types */
  async getCourseConfig() {
    // this.ngxService.start();
    this.showShimmer = true
    const response: any = await this.apiHandler.getData(this.utils.API.GET_COURSE_TYPES, null, this.destroyed$);
    this.courseCategory = response.payload;
    localStorage.setItem('courseCategory', JSON.stringify(this.courseCategory));
    this.courseCategory.forEach(category => {
      this.availableFilter.courseTypeName?.push({ name: category?.courseTypeDesc, key: category?.courseTypeDesc });
    }),
      this.intialCallCount--;
    if (this.intialCallCount === 0) {
      // this.ngxService.stop();
      this.showShimmer = false
    }
  }

  /* Get role group */
  async getRoleGroup() {
    // this.ngxService.start();
    this.showShimmer = true
    const roleGroupList = [];
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ROLE_GROUPS, '', this.destroyed$);
    /* const suggestedIndex = response.payload?.findIndex((element) => element.code === 'LAS');
    if (suggestedIndex) {
      this.suggestedRoleGroup = response.payload[suggestedIndex];
      response.payload.splice(0, 0, response.payload.splice(suggestedIndex, 1)[0]);
    } */
    this.roleGroup = this.sortRoleGroup(response?.payload || []);
    this.roleGroup.forEach((role: any) => {
      if (role.active === true) {
        roleGroupList.push(role);
      }
    });

    this.roleGroupList = [...roleGroupList];
    this.constructSelectedIds(this.roleGroupList, '', 'roleGroup');
    this.cloneRoleGroupList = $.extend(true, [], this.roleGroupList);

    this.intialCallCount--;
    if (this.intialCallCount === 0) {
      // this.ngxService.stop()
      this.showShimmer = false
    }
    this.levelCount = this.getCount(this.roleGroupList, 0);
  }

  sortRoleGroup(list) {
    list = __.sortBy(list, 'sequenceId');
    list.forEach(element => {
      element.child = _.sortBy(element.child, 'sequenceId');
    });
    return list;
  }

  /* Get All Country Region Store */
  async getAllCountries() {
    // this.ngxService.start();
    this.showShimmer = true
    const countryList = [];
    const response: any = await this.apiHandler.getData(this.utils.API.GET_ALL_COUNTRIES, '', this.destroyed$);
    this.countryRegionStore = response.payload;
    this.countryRegionStore.forEach((country: any) => {
      if (country.active === true) {
        countryList.push(country);
      }
    });

    this.countryList = [...countryList];
    this.constructSelectedIds(this.countryList, '', 'country');

    this.countryList = this.emitService.sortRegion(this.countryList);

    console.log('Country list: ',this.countryList);

    this.cloneCountryRegionStore = $.extend(true, [], this.countryList);

    this.intialCallCount--;
    if (this.intialCallCount === 0) {
      // this.ngxService.stop();
      this.showShimmer = false
    }
    this.storeCount = this.getCount(this.countryList, 0);
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

  calcSelectedStore() {
    this.selectedStoreCount = 0;
    this.selectedStoreCount = this.getSelectedChildCount(this.countryList, this.selectedStoreCount);
    return this.selectedStoreCount;
  }

  calcSelectedLevel() {
    this.selectedLevelCount = 0;
    this.selectedLevelCount = this.getSelectedChildCount(this.roleGroupList, this.selectedLevelCount);
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

  /* Get Course List */
  async getCourseList() {
    // this.ngxService.start();
    this.showShimmer = true
    this.recordFound = false
    const response: any = await this.apiHandler.getData(this.utils.API.GET_COURSE_LIST, '', this.destroyed$);
    this.buildCourseList(response.payload);
    this.theImp = this.sortCourseList(this.theImp);
    this.theCloneImp = $.extend(true, [], this.theImp);
    this.thatCloneImp = $.extend(true, [], this.thatImp);
    if (this.viewType === 'roleGroup') {
      this.applyClmFilter();
      this.updateClmSort();
    } else if (this.viewType === 'course') {
      this.applyPlainClmFilter();
      this.updatePlainClmSort();
    }
    this.getFilterLists()
    this.intialCallCount--;
    this.recordFound = true;
    if (this.intialCallCount === 0) {
      // this.ngxService.stop();
      this.showShimmer = false
    }
  }

  toggleView() {
    /* reset all UI filters */
/*     this.searchTextValue = '';
    this.currentFilters = {
      externalCourseName: 'All',
      courseTypeName: 'All',
      roleGroupName: 'All',
      roleName: 'All',
      editedBy: 'All',
      courseStatus: 'All'
    };
    this.selectedCountryDropDown = [];
    this.selectedRoleGroupDropDown = [];
    this.roleGroupList = $.extend(true, [], this.cloneRoleGroupList);
    this.countryList = $.extend(true, [], this.cloneCountryRegionStore); */
    if (this.viewType === 'roleGroup') {
      this.sortBy = 'Reset';
      this.sortByField = null;
      this.applyClmFilter();
      this.updateClmSort();
    } else if (this.viewType === 'course') {
      this.sortBy = 'Sort By Desc';
      this.sortByField = 'updatedTime';
      this.applyPlainClmFilter();
      this.updatePlainClmSort();
    }
  }

  buildCourseList(list) {
    const tempCourseList = [];
    const tempPlainCourseList = [];
    // const childWithOutParent = [];
    list?.forEach(element => {
      element.crsIds = [];
      this.constructCrsIds(element.countries, '', element, element.crsIds);
      const ids = ['roleGroupId', 'roleId', 'levelId'];
      let rrlId = '';
      for (const id of ids) {
        if (rrlId) {
          rrlId += `|${element[id]}`
        } else {
          rrlId = element[id];
        }
      }
      const tempElement = { ...element };
      this.buildGroupTable(tempElement, tempCourseList, rrlId)
      const tempPlainElement = { ...element };
      this.buildPlainTable(tempPlainElement, tempPlainCourseList, rrlId); //, childWithOutParent
    });
    this.theImp = tempCourseList;
    this.thatImp = tempPlainCourseList;
  }

  buildGroupTable(tempElement, tempCourseList, rrlId) {
    const groupIndex = tempCourseList.findIndex(obj => {
      return obj.roleGroupId === tempElement.roleGroupId
        && obj.roleId === tempElement.roleId
        && (tempElement.roleGroupId && tempElement.roleId && !tempElement.levelId ? tempElement.courseTypeCode === obj.courseTypeCode : obj.levelId === tempElement.levelId)
    });
    if (groupIndex === -1) {
      tempElement.roleGrpLevelIds = rrlId;
      const groupLabel =
        // tempElement.roleGroupId && tempElement.roleGroupId === this.suggestedRoleGroup.id ? 'Suggested' :
        tempElement.roleId && tempElement.levelId ? `${tempElement.roleName} - ${tempElement.levelName}`
          : tempElement.roleId && !tempElement.levelId ? `${tempElement.roleName} ${tempElement.courseTypeCode === this.courseCode.Policies ? '- Policies' : '- CheckList'}`
            : !tempElement.roleId && !tempElement.levelId ? 'Others / Non Mandatory' : '';
      tempCourseList.push({
        roleGroupId: tempElement.roleGroupId,
        roleId: tempElement.roleId,
        levelId: tempElement.levelId,
        courseTypeCode: tempElement.courseTypeCode,
        label: groupLabel,
        child: [tempElement]
      });
    } else {
      tempElement.roleGrpLevelIds = rrlId;
      if (tempElement.parentId) {
        const publishIndex = tempCourseList[groupIndex].child.findIndex(obj => tempElement.parentId === obj.courseId);
        if (publishIndex === -1) {
          tempCourseList[groupIndex].child.push(tempElement);
        } else {
          tempCourseList[groupIndex].child[publishIndex].courseStatus = 'Published & Draft';
          tempCourseList[groupIndex].child[publishIndex].draft = tempElement;
        }
      } else {
        const draftIndex = tempCourseList[groupIndex].child.findIndex(obj => tempElement.parentId === obj.courseId);
        if (draftIndex === -1) {
          tempCourseList[groupIndex].child.push(tempElement);
        } else {
          tempElement.courseStatus = 'Published & Draft';
          tempElement.draft = { ...tempCourseList[groupIndex].child[draftIndex] }
          tempCourseList[groupIndex].child[draftIndex] = tempElement;
        }
      }
    }
  }

  buildPlainTable(tempPlainElement, tempPlainCourseList, rrlId) { //, childWithOutParent
    const courseIndex = tempPlainCourseList.findIndex(obj => tempPlainElement.parentId ? (tempPlainElement.parentId === obj.courseId || tempPlainElement.parentId === obj.parentId) : (tempPlainElement.courseId === obj.courseId || tempPlainElement.courseId === obj.parentId));
    if (courseIndex === -1) {
      tempPlainElement.roleGrpLevelIds = [rrlId];
      tempPlainCourseList.push(tempPlainElement);
      /* if (tempPlainElement.parentId) {
        childWithOutParent.push(tempPlainElement);
      } else {
        const childIndex = childWithOutParent.findIndex(obj => tempPlainElement.parentId === obj.courseId);
        if (childIndex !== -1) {
          tempPlainElement.courseStatus = 'Published & Draft';
        }
        tempPlainCourseList.push(tempPlainElement);
      } */
    } else {
      if (tempPlainElement.parentId || tempPlainCourseList[courseIndex].parentId) {
        if (!tempPlainElement.parentId) {
          tempPlainCourseList[courseIndex].roleGrpLevelIds.push(rrlId);
          tempPlainElement.roleGrpLevelIds = tempPlainCourseList[courseIndex].roleGrpLevelIds;
          tempPlainElement.draft = { ...tempPlainCourseList[courseIndex] };
          tempPlainCourseList[courseIndex] = { ...tempPlainElement };
        } else {
          tempPlainCourseList[courseIndex].draft = { ...tempPlainElement };
        }
        tempPlainCourseList[courseIndex].courseStatus = 'Published & Draft';
      } else {
        tempPlainCourseList[courseIndex].roleGrpLevelIds.push(rrlId);
      }
    }
  }

  sortCourseList(list) {
    list = __.sortBy(list, ['roleGroupId', 'roleId', 'levelId']);
    list.forEach(element => {
      element.child = _.sortBy(element.child, 'sequenceId');
    });
    return list;
  }

  constructCrsIds(list: any, parent: any, row: any, tempArr: any) {
    list?.forEach(element => {
      let crsIds = (parent ? parent + "|" : parent) + element.id;
      if (element.children?.length > 0) {
        this.constructCrsIds(element.children, crsIds, row, tempArr);
      } else {
        tempArr.push(crsIds);
      }
    });
  }

  notAllExpanded() {
    return !!this.theImp.find(obj => obj.isExpanded !== true);
  }

  clmFilterApplied() {
    const filterFields = Object.keys(this.currentFilters);
    return filterFields.find((key) => this.currentFilters[key] !== 'All');
  }

  updateClmFilter(items, column) {
    this.currentFilters[column.property] = items.key;
    this.applyClmFilter();
  }

  updateClmSort(sortBy?, sortObj?) {
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    if (this.sortBy === 'Reset') {
      this.applyClmFilter();
    } else if (this.sortBy === 'Sort By Asc') {
      this.theImp.forEach(element => {
        element.child = __.sortBy(element.child, this.sortByField);
      });
    } else if (this.sortBy === 'Sort By Desc') {
      this.theImp.forEach(element => {
        __.sortBy(element.child, this.sortByField);
        element.child = element.child.reverse();
      });
    }
  }

  changeDateFilter(event) {
    this.filteredDate = event;
    if (this.viewType === 'roleGroup') {
      this.applyClmFilter();
      this.updateClmSort();
    } else if (this.viewType === 'course') {
      this.applyPlainClmFilter();
      this.updatePlainClmSort();
    }
  }

  /* Apply UI filter for group table listing */
  applyClmFilter() {
    this.theImp = $.extend(true, [], this.theCloneImp);
    const filterFields = Object.keys(this.currentFilters);
    const notResetAll = filterFields.find((key) => this.currentFilters[key] !== 'All');
    if (notResetAll || this.searchTextValue || this.selectedRoleGroupDropDown?.length > 0 || this.selectedCountryDropDown?.length > 0
      || (this.filteredDate.fromDate && this.filteredDate.toDate)) {
      this.theImp.forEach(element => {
        element.child = element.child.filter((obj) => {
          let hasValue = false;
          if (notResetAll) {
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
            if (hasValue === false) {
              return hasValue;
            }
          }
          if (this.searchTextValue) {
            hasValue = obj.externalCourseName.toLowerCase().includes(this.searchTextValue.toLowerCase()) || obj.internalCourseName.toLowerCase().includes(this.searchTextValue.toLowerCase());
            if (hasValue === false) {
              return hasValue;
            }
          }
          if (this.selectedCountryDropDown?.length > 0) {
            let isSelected = null;
            for (const selected of this.selectedCountryDropDown) {
              isSelected = obj.crsIds?.find(country => this.stringCompare(selected, country));
              if (isSelected) {
                break;
              }
            }
            hasValue = !!isSelected;
            if (hasValue === false) {
              return hasValue;
            }
          }
          if (this.selectedRoleGroupDropDown?.length > 0) {
            let isSelected = null;
            for (const selected of this.selectedRoleGroupDropDown) {
              isSelected = this.stringCompare(selected, obj.roleGrpLevelIds);
              if (isSelected) {
                break;
              }
            }
            hasValue = !!isSelected;
            if (hasValue === false) {
              return hasValue;
            }
          }
          if (this.filteredDate.fromDate && this.filteredDate.toDate) {
            hasValue = moment(new Date(obj.updatedTime)).isBetween(this.filteredDate.fromDate, this.filteredDate.toDate);
            if (hasValue === false) {
              return hasValue;
            }
          }
          return hasValue;
        });
      });
    }
  }

  /* Apply UI filter for course table listing */
  applyPlainClmFilter() {
    this.thatImp = $.extend(true, [], this.thatCloneImp);
    const filterFields = Object.keys(this.currentFilters);
    const notResetAll = filterFields.find((key) => this.currentFilters[key] !== 'All');
    if (notResetAll || this.searchTextValue || this.selectedRoleGroupDropDown?.length > 0 || this.selectedCountryDropDown?.length > 0
      || (this.filteredDate.fromDate && this.filteredDate.toDate)) {
      this.thatImp = this.thatImp.filter(obj => {
        let hasValue = false;
        if (notResetAll) {
          for (const key of filterFields) {
            if (this.currentFilters[key] !== 'All') {
              if (this.currentFilters[key] === "Disabled" ? obj.active === false : obj[key] === this.currentFilters[key]) {
                hasValue = true;
              } else {
                hasValue = false;
                break;
              }
            }
          }
          if (hasValue === false) {
            return hasValue;
          }
        }
        if (this.searchTextValue) {
          hasValue = obj.externalCourseName.toLowerCase().includes(this.searchTextValue.toLowerCase()) || obj.internalCourseName.toLowerCase().includes(this.searchTextValue.toLowerCase());
          if (hasValue === false) {
            return hasValue;
          }
        }
        if (this.selectedCountryDropDown?.length > 0) {
          let isSelected = null;
          for (const selected of this.selectedCountryDropDown) {
            isSelected = obj.crsIds?.find(country => this.stringCompare(selected, country));
            if (isSelected) {
              break;
            }
          }
          hasValue = !!isSelected;
          if (hasValue === false) {
            return hasValue;
          }
        }
        if (this.selectedRoleGroupDropDown?.length > 0) {
          let isSelected = null;
          for (const selected of this.selectedRoleGroupDropDown) {
            isSelected = obj.roleGrpLevelIds?.find(rrlId => this.stringCompare(selected, rrlId));
            if (isSelected) {
              break;
            }
          }
          hasValue = !!isSelected;
          if (hasValue === false) {
            return hasValue;
          }
        }
        if (this.filteredDate.fromDate && this.filteredDate.toDate) {
          hasValue = moment(new Date(obj.updatedTime)).isBetween(this.filteredDate.fromDate, this.filteredDate.toDate);
          if (hasValue === false) {
            return hasValue;
          }
        }
        return hasValue;
      });
    }
  }

  updatePlainClmFilter(items, column) {
    this.currentFilters[column.property] = items.key;
    this.applyPlainClmFilter();
  }

  updatePlainClmSort(sortBy?, sortObj?) {
    this.sortBy = sortBy ? sortBy : this.sortBy;
    this.sortByField = sortObj ? sortObj : this.sortByField;
    if (this.sortBy === 'Reset') {
      this.applyPlainClmFilter();
    } else if (this.sortBy === 'Sort By Asc') {
      this.thatImp = __.sortBy(this.thatImp, this.sortByField);
    } else if (this.sortBy === 'Sort By Desc') {
      this.thatImp = __.sortBy(this.thatImp, this.sortByField).reverse();
    }
  }

  countryRegionStoreId(response: any) {
    response.forEach(row => {
      let tempArr = [];
      this.constructCrsIds(row.countries, '', row, tempArr);
      row.crsIds = [...tempArr];
    })
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

  roleCourseSelect(value) {
    value.state = value.state === 'checked' ? 'unchecked' : 'checked';
    this.changeObjProperty(value.child, 'state', value.state);

  }

  courseSelect(value, parent) {
    value.state = value.state === 'checked' ? 'unchecked' : 'checked';
    const childSelected = parent.child.filter(obj => obj.state === 'checked');
    parent.state = childSelected.length === parent.child.length ? 'checked'
      : childSelected.length === 0 ? 'unchecked' : 'mixed'
  }

  async drop(event: CdkDragDrop<string[]>) {
    const dragRow = event.item.data;
    const dragParent = this.theImp.find(obj => obj.roleGroupId === dragRow.roleGroupId
      && obj.roleId === dragRow.roleId
      && obj.levelId === dragRow.levelId);
    if ((event.previousIndex !== event.currentIndex)
      && (dragParent.child[0].courseTypeCode !== this.courseCode.Policies)
      /* && (dragParent.roleId && dragParent.levelId && this.suggestedRoleGroup.id !== dragParent.roleGroupId) */) {
      let startLength = 0; let endLength = 0; let preIndex = 0; let curIndex = 0;
      for (const group of this.theImp) {
        if (group.isExpanded !== false) {
          endLength = startLength + group.child?.length || 0;
          if (startLength <= event.previousIndex && endLength > event.previousIndex) {
            if (endLength > event.currentIndex) {
              preIndex = event.previousIndex - startLength;
              curIndex = event.currentIndex - startLength;
            }
            break;
          } else {
            startLength = endLength;
          }
        }
      }
      if (dragParent?.child && preIndex > -1 && curIndex > -1 && preIndex !== curIndex) {
        // this.ngxService.start();
        this.showShimmer = true
        const params = {
          roleGroupId: dragRow.roleGroupId,
          roleId: dragRow.roleId,
          levelId: dragRow.levelId,
          from: dragParent.child[preIndex].sequenceId,
          to: dragParent.child[curIndex].sequenceId
        };
        const response: any = await this.apiHandler.postData(this.utils.API.UPDATE_COURSE_SEQUENCE, params, this.destroyed$);
        this.dragDropResponse = response.payload;
        moveItemInArray(dragParent.child, preIndex, curIndex);
        dragParent.child.forEach((element, index) => {
          element.sequenceId = index + 1;
        });
        // this.ngxService.stop();
        this.showShimmer = false
      }
    }
  }

  /* Status Action change */
  changeStatusAction(event) {
    this.statusAction = event;
    var checkedListFilter = [];
    if (this.viewType === 'roleGroup') {
      this.theImp.forEach(element => {
        const selectedCourse = element.child?.filter(obj => obj.state == 'checked') || [];
        checkedListFilter = checkedListFilter.concat(selectedCourse);
      });
    } else {
      var checkedListFilter = _.filter(this.thatImp, function (data) {
        return data.state == 'checked';
      });
    }
    this.actionModalObj.total = checkedListFilter.length;
    this.actionModalObj.published = 0;
    this.actionModalObj.draft = 0;
    this.actionModalObj.actionCount = 0;
    var activeCourseList = [];
    checkedListFilter.forEach(obj => {
      if (this.statusAction.key === 'Active' || this.statusAction.key === 'Inactive') {
        if (['Published', 'Published & Draft'].includes(obj.courseStatus)) {
          this.actionModalObj.published++;
          this.actionModalObj.actionCount++;
          activeCourseList.push(obj);
        } else if (obj.courseStatus === 'Draft') {
          this.actionModalObj.draft++;
        }
      } else if (this.statusAction.key === 'Delete') {
        if (obj.courseStatus === 'Published') {
          this.actionModalObj.published++;
          // activeCourseList.push(obj);
        } else if (['Draft', 'Published & Draft'].includes(obj.courseStatus)) {
          this.actionModalObj.draft++;
          this.actionModalObj.actionCount++;
          activeCourseList.push(obj.courseStatus === 'Draft' ? obj : obj?.draft);
        }
      }
    });
    this.statusActionList = [...activeCourseList];
    this.statusModal.nativeElement.click();
  }

  /* Prepare filter list */
  getFilterLists() {
    /* Build bay filter list */
    this.buildFilterList(this.thatCloneImp, 'roleName');
    /* Build palletId filter list */
    this.buildFilterList(this.thatCloneImp, 'editedBy');
    this.buildFilterList(this.thatCloneImp, 'createdBy');
    /* Build courser type filter list */
    // this.buildFilterList(this.courseList, 'courseTypeName');
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

  /* Create or Edit Course set action type courseTypeCode and courseId */
  createOrEditCourse(type: any, courseType: any, obj?: any) {
    this.router.navigate(['/create-course']);
    let status;
    if (obj?.courseStatus === 'Published & Draft' || obj?.courseStatus === 'Published') {
      status = 'publish';
    } else if (obj?.courseStatus === 'Draft') {
      status = 'draft';
    }
    const courseTypeParam: any = {
      type: type,
      courseTypeCode: courseType,
      courseId: obj?.courseId,
      view: status,
      categoryId: obj?.categoryId,
      categoryName: obj?.categoryName
    }
    localStorage.setItem('courseType', JSON.stringify(courseTypeParam));
  }

  applyDateFilter() {

  }

  /* Select All from drop down list */
  selectAll(event: any, list: any, type: any) {
    this.changeObjProperty(list, 'selectStatus', event.checked ? 'checked' : 'unchecked');
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleGroupList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Filter update once drop down value selected */
  filterUpdate(ddList: any, type: any) {
    let tempSelected = [];
    for (let country of ddList) {
      this.selectedDropDown(country, tempSelected, type);
    }
    type === 'country' ? this.selectedCountryDropDown = [...tempSelected] : this.selectedRoleGroupDropDown = [...tempSelected];
    this.viewType === 'roleGroup' ? this.applyClmFilter() : this.applyPlainClmFilter();
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
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleGroupList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Select Multiple properties */
  selectionToggle(isChecked, node, type) {
    node.selectStatus = isChecked ? 'checked' : 'unchecked';
    this.changeObjProperty(node.child, 'selectStatus', node.selectStatus);
    this.updateSelectionstatus(type);
    type === 'country' ? this.filterUpdate(this.countryList, type) : this.filterUpdate(this.roleGroupList, type);
    type === 'country' ? this.calcSelectedStore() : this.calcSelectedLevel();
  }

  /* Update selection Status in List */
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

  /* Set Drop Down list status as checked or unchecked or mixed */
  setSelectionStatus(node) {
    if (node.child && node.child.length) {
      for (let child of node.child) {
        this.setSelectionStatus(child);
      }
      let checkedChild = 0;
      let mixedChild = 0;
      node.child.forEach((obj) => {
        if (obj.selectStatus === 'checked') {
          checkedChild++;
        }
        if (obj.selectStatus === 'checked' || obj.selectStatus === 'mixed') {
          mixedChild++;
        }
      });
      node.selectStatus = node.child.length === checkedChild ? 'checked' : mixedChild === 0 ? 'unchecked' : 'mixed';
    }
  }

  /* Compare string and return boolean */
  stringCompare(row: any, key: any) {
    if (!row || !key) {
      return false;
    }
    let least = row.length !== key.length ? row.length > key.length ? key : row : row;
    let higher = row.length !== key.length ? row.length < key.length ? key : row : key;
    let sliced = higher.slice(0, least?.length);
    return least === sliced && (higher.charAt(sliced.length) === '|' || higher.charAt(sliced.length) === '');
  }

  async statusActionConfirm() {
    if (this.actionModalObj.actionCount !== 0) {
      let statusActionIds = this.statusActionList.map((action) => action.courseId);
      console.log('Ids', statusActionIds);
      let message = 'Updated Successfully';
      const params = {
        id: statusActionIds,
        courseStatus: this.statusAction.key
      }
      const response: any = await this.apiHandler.postData(this.utils.API.CHANGE_COURSE_STATUS, params, this.destroyed$, message);
      if (response.payload === true) {
        this.intialCallCount = 1;
        this.getCourseList();
      } else {
        this.errorHandler.handleAlert('Status change action failed');
      }
    }
    this.statusModal.nativeElement.click();
  }

  actionButtionDisable() {
    return this.viewType === 'roleGroup' ? !this.theImp.find(row => ['checked', 'mixed'].includes(row.state)) : !this.thatImp.find(row => row.state === 'checked');
  }

  changeObjProperty(array: any, property: any, assignValue: any) {
    array?.forEach((obj) => {
      obj[property] = assignValue;
      if (obj.child && obj.child.length > 0) {
        this.changeObjProperty(obj.child, property, assignValue);
      }
    });
    return array;
  }

  closePopover(index: number) {
    let x = this.courseListColumns;
    if (this.popovers && this.popovers.length > index - 1) {
      this.popovers.toArray()[index - 1].close();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyed$.unsubscribe();
  }
}

