import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ApiHandlerService } from 'src/app/shared/services/api-handler.service';
import { CommonService } from 'src/app/shared/services/common.services';
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';
import { Utils } from 'src/app/shared/utils';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
  MatDialogConfig,
} from "@angular/material/dialog";
import { IncidentService } from "../../incident/incident.service";
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  fillerNav: any = [];
  userDetails: any = {};
  dashboardCount: any = {};

  showLA: boolean = false;
  showHS: boolean = false;
  displayName: any = '';
  destroyed$: Subject<void> = new Subject<void>();
  public finalSideNav: any = [];
  @Input() leftMenuURL: any;

  constructor(public router: Router,
    private utils: Utils,
    private ngxService: NgxUiLoaderService,
    private apiHandler: ApiHandlerService,
    private emitService: CommonService, 
    public ngxservice: ngxService, 
    private dialog: MatDialog, private incidentservice:IncidentService) {


    /* checking the navigation start, end */
    this.router.events.subscribe((event: Event) => {
      if (this.router.url != '/login') {
        this.getSideMenu()
      }

      if (event instanceof NavigationStart) {
        // if(this.router.url == '/message' || this.router.url !== '/userAccess' || this.router.url !== '/courses' || this.router.url !== '/courses'){
        //   this.ngxService.start();
        // }
      }

      if (event instanceof NavigationEnd) {
        // this.ngxService.stop();
      }

      if (event instanceof NavigationError) {
        this.ngxService.stop();
      }
    });
  }

  ngOnInit() {
    let url = this.router.url;
    let isnotLearner = (url.includes('incident-list') || url.includes('audit-list')) ? true : false;
    /* get side menu details */
    this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.getSideMenu();
    if (isnotLearner == false) {
      //  this.getDashboardCount();

      this.emitService.commonSubjectResEmit$.subscribe((obj: any) => {
        this.getDashboardCount();
      });
      this.checkUrl();
    }
    let username = localStorage.getItem('username');
    this.ngxservice.userId = username;
    let HealthSafetyAccessData = JSON.parse(localStorage.getItem('HealthSafetyAccessData'));
    // if(HealthSafetyAccessData.length>0){
    //   this.ngxservice.AccessdataAudit = HealthSafetyAccessData[0].app.modules[1];
    // }

    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails != null && userDetails != undefined) {
      this.displayName = ((userDetails.firstName != '' && userDetails.firstName != null) ? userDetails.firstName : '') + ' ' + ((userDetails.lastName != '' && userDetails.lastName != null) ? userDetails.lastName : '');
    }

  }

  checkUrl() {
    const url: any = this.router.url;
    if (['/courses', '/employees', '/reports', '/f2f-reports', '/userAccess', '/message'].includes(url)) {
      this.showLA = true;
      this.showHS = false;
    } else {
      this.showHS = true;
      this.showLA = false;
    }
  }

  isCollapsed: boolean[] = [];

  /* get side menu details */
  getSideMenu() {
    this.fillerNav = this.utils.LEFT_MENU;
    this.fillerNav.forEach(item => item.isCollapsed = true);
    const accessAppsList: any = JSON.parse(localStorage.getItem('accessApps'));
    const hsApps = (accessAppsList!=null)?accessAppsList.filter(app => app.app.appCode === 'IT' || app.app.appCode === 'AT'):[];
    const tempHsModules = hsApps.map(app => app.app.modules);
    const hsModules = tempHsModules.flat();
    hsApps.forEach(app => {
      hsModules.concat(app.app.modules);
    });

    const accessApps =(accessAppsList!=null)? accessAppsList.filter(app => app.app.appCode !== 'IT' && app.app.appCode !== 'AT'):[];

    const hs = {
      app: {
        modules: [...hsModules],
        appCode: "HS"
      }
    }

    accessApps.push(hs);
    // const access = (accessApps!=null)?this.constructByGroupName(accessApps.map(app => app.app)):[];
    this.fillerNav.forEach(item => {
      const accessObj = accessApps.find(app => app.app.appCode === item.appCode);
      if (accessObj) {
        item.access = true;
        for (let nav of item.modules) {
          nav.access = accessObj.app.modules.find(module => module.moduleCode === nav.moduleCode) !== undefined ? true : false;
          if (nav.routeUrl == this.router.url) {
            nav.isActive = true;
            item.isCollapsed = true;
          } else if ((this.router.url == '/incident-list' || this.router.url == '/incident-create' || this.router.url == '/incident-history') && (nav.routeUrl == '/incident-list')) {
            nav.isActive = true;
            item.isCollapsed = true;
          } else {
            nav.isActive = false;
            item.isCollapsed = false;
          }
        }
      }
    });

    /* if (access) {
      for (let nav of this.fillerNav) {
        nav.access = access[nav.key] ? true : false;
      }
    } else {
      this.logOut();
    } */
  }

  constructByGroupName(list) {
    let appGroup: any = [];
    list.forEach(element => {
      const isObjAvailable = appGroup.find(ele => ele.groupName === element.groupName);
      if (isObjAvailable) {
        isObjAvailable.modules = isObjAvailable.modules.concat(element.modules);
      } else {
        const obj = {
          groupName: element.groupName,
          access: element.access,
          modules: element.modules
        }
        appGroup.push(obj);
      }
    });

    return appGroup;
  }

  showMenu(app) {
    const current = app.modules.find(module => module.routeUrl === this.router.url);
    if (current) {
      return true;
    } else {
      return false;
    }
  }

  async getDashboardCount() {
    const portalRole = this.utils.portalRole;
    const payload = {
      payload:
      {
        country: [this.userDetails.countryId],
        region: [this.userDetails.regionId],
        store: [this.userDetails.storeId],
        admin: ![portalRole.superAdmin, portalRole.hr].includes(this.userDetails.portalRoleName)
      }
    };

    const response: any = await this.apiHandler.postData(this.utils.API.GET_DASHBOARD_COUNT, payload, this.destroyed$);
    this.dashboardCount = response.payload;
  }

  setLocalStorage(item: any) {
    let users: any = JSON.parse(localStorage.getItem('users'));
    if (item === 'Incident tracker') {
      users.employeeId = '1001';
      users.roleCode = 'SM'
    } else if (item === 'Store audits') {
      users.employeeId = '1149';
      users.roleCode = 'AD'
    }
    localStorage.setItem('users', JSON.stringify(users));
  }

  logOut() {
    if (this.router.url == 'incident-create') {
      localStorage.removeItem('userDetails');
      localStorage.removeItem('authAccessData');
      localStorage.removeItem('accessApps');
      localStorage.removeItem('auditAccessData');
      localStorage.removeItem('HealthSafetyAccessData');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('incidentAccessData');
      localStorage.removeItem('learnerAccessData');
    } else {
      localStorage.clear();
    }


    this.router.navigate(['/login']);
  }
  @ViewChild('leavepagepopup', { read: TemplateRef }) leavepagepopup: TemplateRef<any>;
compareIncidentSubscript:any;
  sidenav(path: any) {
    // if (this.router.url == '/incident-create') {
    //   this.incidentservice.compareIncidentSubscript = this.incidentservice.compareIncidentsubject$.subscribe((value:any)=>{
    //   let oldData = value.old;
    //   let newData = value.new;
    //   let isChange = this.incidentservice.deepJsonDataCompare(oldData,newData);
    //     if(!isChange){
    //       this.ngxservice.nextpathValue = path;
    //       this.dialog.open(this.leavepagepopup, {
    //       width: "600px"
    //       });
    //     }else{
    //       this.router.navigate([path]);
    //     }
    //   })

    // }
    // else {
    this.router.navigate([path]);
   // }

  }
  confirmnavigate() {
    if(this.incidentservice.compareIncidentSubscript !== undefined){
    this.incidentservice.compareIncidentSubscript.unsubscribe();
    }
    this.router.navigate([this.ngxservice.nextpathValue]);
  }

  cancelClick(){
    if(this.incidentservice.compareIncidentSubscript !== undefined){
      this.incidentservice.compareIncidentSubscript.unsubscribe();
      }
      }
}
