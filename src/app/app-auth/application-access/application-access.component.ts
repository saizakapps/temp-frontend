import { Component, OnInit } from '@angular/core';
import * as __ from 'lodash';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ApiHandlerService } from 'src/app/shared/services/api-handler.service';
import { CommonService } from 'src/app/shared/services/common.services';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { RequestApiService } from 'src/app/shared/services/incident-services/request-api.service';
import { Utils } from 'src/app/shared/utils';

interface ApplicationAccessTable {
  id?: number;
  roleName: string,
  show?: boolean,
  app: {
    id: number,
    name: string,
    appCode?: string,
    groupName: string;
    access: boolean,
    modules: [
      {
        name: string,
        id: number,
        moduleCode?: string,
        view: boolean,
        create: boolean,
        update: boolean,
        access: boolean
      }
    ]
  }
}

@Component({
  selector: 'app-application-access',
  templateUrl: './application-access.component.html',
  styleUrls: ['./application-access.component.scss']
})

export class ApplicationAccessComponent implements OnInit {

  tableData: ApplicationAccessTable[] = [];

  cloneTableData: ApplicationAccessTable[] = [];

  appAuthListColumns: any = ['Roles', 'Apps', 'Modules', ''];

  appList: any = [];

  cloneAppList: any = [];

  moduleList: any = [];

  availableAppsList: any = [];
  selectedApp: any = '';
  selectedAppIndex: any = 0;
  selectedRole: any = '';
  roleNameList: any = [];

  showSearch: boolean = false;

  columnFilters: any[] = [{ name: 'All', key: 'all' }, { name: 'Active', key: 'active' }, { name: 'Inactive', key: 'inactive' }]

  destroyed$: any = new Subject();

  constructor(
    private errorHandler: ErrorHandlerService,
    private apiHandlerService: RequestApiService,
    private utils: Utils,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getAppModules();
    this.tableData = [{
      roleName: '',
      app: {
        id: 0,
        name: '',
        groupName: '',
        access: false,
        modules: [
          {
            name: '',
            id: 0,
            view: true,
            create: false,
            update: false,
            access: false
          }
        ]
      }
    }];
    this.appAuthListColumns = this.utils.TABLE_HEADERS.APP_AUTH_TABLE;
  }

  /* Get app module list */
  async getAppModules() {
    const response: any = await this.apiHandlerService.getData(this.utils.API.GET_APP_MODULES);
    this.appList = this.generateList(response);
    this.cloneAppList = __.cloneDeep(this.appList);
    this.getRoleList();
  }

  generateList(list: any) {
    let tempArray: any = [];
    list.forEach(element => {
      let obj: any = {
        id: element.id,
        name: element.appName,
        appCode: element.appCode,
        groupName: element.groupName,
        access: false,
      }
      let modules: any = [];
      if (element.module.length > 0) {
        element.module.forEach(module => {
          const moduleObj: any = {
            name: module.moduleName,
            id: module.id,
            moduleCode: module.moduleCode,
            view: true,
            create: false,
            update: false,
            access: false
          };
          modules.push(moduleObj);
        });
      } else {
        modules.push({
          name: element.appName,
          id: element.id,
          view: true,
          create: false,
          update: false,
          access: false
        })
      }
      obj.modules = modules;
      tempArray.push(obj);
    });
    return tempArray;
  }

  /* Get role list */
  roleList: any = [];
  async getRoleList() {
    const response: any = await this.apiHandlerService.getData(this.utils.API.GET_AUTH_ROLES);
    this.roleList = response;
    const roles: ApplicationAccessTable[] = response.map(role => JSON.parse(role.access));
    roles.forEach((element, index) => {
      element.id = this.roleList[index].id;
    });
    this.tableData = [...roles];
    this.tableData.push({
      roleName: '',
      app: {
        id: 0,
        name: '',
        groupName: '',
        access: false,
        modules: [
          {
            name: '',
            id: 0,
            view: true,
            create: false,
            update: false,
            access: false
          }
        ]
      }
    })
    this.selectedApp = this.selectedApp !== '' ? this.selectedApp : this.appList[0].name;
    this.selectedAppIndex = this.selectedAppIndex !== 0 ? this.selectedAppIndex : 0;
    this.tableData[this.tableData.length - 1].app.name = this.selectedApp;
    this.updateList(this.tableData[this.tableData.length - 1], this.tableData.length - 1)
    this.constructAvailableApps();
    this.cloneTableData = __.cloneDeep(this.tableData);
    this.ngxService.stop();
  }

  constructAvailableApps() {
    let tempArray: any = [];
    let tempRoleList: any = [];
    const tempData: any = __.cloneDeep(this.tableData);
    tempData.pop();
    tempData.forEach(app => {
      const isAvail = tempArray.find(item => item.name === app.app.name);
      if (!isAvail) {
        const obj = {
          name: app.app.name,
          key: app.app.name.split(" ").join("").toLowerCase(),
        }
        tempArray.push(obj);
      }
      if ((!tempRoleList.find(role => role.roleName === app.roleName)) && app.show === true) {
        tempRoleList.push(app.roleName);
      }
    });
    this.availableAppsList = [...tempArray];

    this.roleNameList = [...tempRoleList];
  }

  /* Generate modules based on selected app */
  generateModules(apps: any, row: any): void {
    let tempModuleList = row.modules.length > 0 ? __.cloneDeep(row.modules) : __.cloneDeep(this.moduleList);
    let moduleList = [];
    apps.forEach((app: any) => {
      if (app.access) {
        tempModuleList.forEach((module: any) => {
          if (module.parent.id === app.id) {
            moduleList.push(module);
          }
        });
      }
    });
    row.apps = apps;
    row.modules = [...moduleList];
  }

  /* Add row when button click */
  addRole() {
    let lastIndex = this.tableData.pop();
    this.tableData.unshift(lastIndex);
    this.roleList.unshift(lastIndex);
    this.tableData.push(
      {
        roleName: '',
        show: true,
        app: {
          id: 0,
          name: this.selectedApp,
          groupName: '',
          access: false,
          modules: [
            {
              name: '',
              id: 0,
              view: true,
              create: false,
              update: false,
              access: false
            }
          ]
        }
      }
    );
    this.updateList(this.tableData[this.tableData.length - 1], this.tableData.length - 1);
    /* setTimeout(() => {
      const doc: any = document.getElementById("table");
    doc.scrollTop = doc.scrollHeight + 30;
    }, 200); */
  }

  async deleteRole(role: any, index: number) {
    this.ngxService.start();
    if (this.tableData.length - 1 === index) {
      this.tableData.pop();
      this.tableData.push({
        roleName: '',
        app: {
          id: 0,
          name: '',
          groupName: '',
          access: false,
          modules: [
            {
              name: '',
              id: 0,
              view: true,
              create: false,
              update: false,
              access: false
            }
          ]
        }
      });
    } else if (this.tableData.length - 1 !== index) {
      const response: any = await this.apiHandlerService.postData(this.utils.API.DELETE_AUTH_ROLES, { id: [this.roleList[index].id] });
      if (response) {
        this.roleList[index].active = !this.roleList[index].active;
        this.errorHandler.handleAlert(`${role.roleName} ${this.roleList[index].active ? 'disabled' : 'enabled'} successfully`);
      }
    }
    this.updateFilter();
    this.ngxService.stop();
  }

  checkRoleData(row: any, type: string) {
    return type === 'add' ? !(row.roleName !== '' && row.app.access && row.app.modules.find(module => module.access) && (row.app.modules.find(module => module.view) || row.app.modules.find(module => module.create) || row.app.modules.find(module => module.update))) :
      !(row.role !== '' || row.app.access || row.view === true || row.create === true || row.update === true || row.modules.find(module => module.access) || (row.app.modules.find(module => module.view) || row.app.modules.find(module => module.create) || row.app.modules.find(module => module.update)));
  }

  checkTableDataChange() {
    let disableSave: boolean = true;

    if (this.roleList.length > 0) {
      this.tableData.forEach((row, index) => {
        if (index < this.roleList.length) {
          const obj = this.cloneTableData.find(cloneRow => row.roleName === cloneRow.roleName);
          if (obj) {
            this.roleList[index].edit = false;
            const obj1 = __.cloneDeep(obj);
            const obj2 = __.cloneDeep(row);
            delete obj1.show;
            delete obj2.show;
            if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
              disableSave = false;
              this.roleList[index].edit = true;
            }
          } else {
            disableSave = false;
            this.roleList[index].edit = true;
          }

          if (row.roleName === '' || !row.app.modules.find(module => module.access)) {
            this.roleList[index].emptyAlert = true;
          } else {
            this.roleList[index].emptyAlert = false;
          }
        }
      })
    }

    if (this.tableData.length !== this.cloneTableData.length) {
      disableSave = false;
    }
    return disableSave;
  }

  async saveRole() {
    const tempData = __.cloneDeep(this.tableData);
    let isLastIndexFilled: boolean = !this.checkRoleData(this.tableData[this.tableData.length - 1], 'add');
    let isLastIndexEmpty: boolean = false;
    const row = this.tableData[this.tableData.length - 1];
    isLastIndexEmpty = row.roleName === '' &&
      !row.app.modules.find(module => module.access) &&
      !row.app.modules.find(module => module.create) &&
      !row.app.modules.find(module => module.update);

    /* Check if the last row is empty of fully filled */
    if (isLastIndexEmpty || isLastIndexFilled) {
      if (!isLastIndexFilled) {
        tempData.pop();
      } else {
      }
    } else {
      this.errorHandler.handleAlert("Please fill  360 role name and modules");
      return;
    }

    if (this.roleList.find(role => role.emptyAlert === true)) {
      this.errorHandler.handleAlert("Please fill highlighted field");
      return;
    }

    let param = tempData.map(obj => {
      const { show, emptyAlert, ...rest } = obj;
      return rest;
    });

    param.forEach(element => {
      const module = element.app.modules.filter(module => module.access === true);
      element.modules = [...module];
    });

    this.ngxService.start();
    const response: any = await this.apiHandlerService.postData(this.utils.API.POST_AUTH_ROLES, param);
    if (response) {
      this.errorHandler.handleAlert('Roles saved successfully');
      if (!isLastIndexEmpty) {
        this.addRole();
      }
      this.getRoleList();
    }
    this.ngxService.stop();
  }

  updateList(row, index) {
    this.showSearch = false;
    const selectedAppObj = this.appList[this.selectedAppIndex];
    if (selectedAppObj) {
      row.id = this.roleList[index]?.id ? this.roleList[index]?.id : 0;
      row.app.id = selectedAppObj.id;
      row.app.access = true;
      row.app.appCode = selectedAppObj.appCode;
      row.app.name = selectedAppObj.name;
      row.app.groupName = selectedAppObj.groupName;
      row.app.modules = selectedAppObj.modules;
    } else {
      row.id = 0;
      row.app.id = 0;
      row.app.access = false;
      row.app.name = '';
      row.app.groupName = '';
      row.app.modules = [
        {
          name: '',
          id: 0,
          view: true,
          create: false,
          update: false,
          access: false
        }
      ];
    }
    this.appList = [];
    this.appList = __.cloneDeep(this.cloneAppList);
    this.updateFilter();
  }

  handleSelectedRole(selectedRole: string, type: string) {
    this.selectedRole = selectedRole;
    this.updateFilter(type);
  }

  updateFilter(type?: string) {
    this.tableData.forEach((data, index) => {
      const roleListObj: any = this.roleList.find(role => role.id === data.id);

      if (roleListObj) {
        const appCheck: boolean = data.app.name.split(' ').join('').toLowerCase() === this.selectedApp.split(' ').join('').toLowerCase();
        const roleCheck: boolean = this.commonService.compareStringsCharByChar(this.selectedRole, data.roleName);
        const activeCheck: boolean = this.filterValue === 'active' && roleListObj.active === true;
        const inActiveCheck: boolean = this.filterValue === 'inactive' && roleListObj.active === false;

        if ((((appCheck || this.selectedApp === 'all') && (roleCheck || this.selectedRole === '')) || index === this.tableData.length - 1) && ((activeCheck) || (inActiveCheck) || (this.filterValue === 'all'))) {
          data.show = true;
        } else {
          data.show = false;
        }
      }
    });
    this.constructAvailableApps();
  }

  clearInput() {
    this.selectedRole = '';
    const doc: any = document.getElementById('searchbar-input');
    if (doc) {
      doc.value = '';
    }
  }

  checkModule(row: any) {
    if (!row.app.modules.find(module => module.access)) {
      return true;
    } else {
      return false;
    }
  }

  filterValue: any = 'all';
  applyFilter() {
    this.roleList.forEach((role: any) => {
      const tableDataObj: any = this.tableData.find(row => row.id === role.id);
      if (tableDataObj.app.name === this.selectedApp) {
        if (this.filterValue === 'active') {
          if (role.active === true) {
            tableDataObj.show = true;
          } else {
            tableDataObj.show = false;
          }
        } else if (this.filterValue === 'inactive') {
          if (role.active === false) {
            tableDataObj.show = true;
          } else {
            tableDataObj.show = false;
          }
        } else if (this.filterValue === 'all') {
          tableDataObj.show = true;
        }
      }
    })
  }
}
