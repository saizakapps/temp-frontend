import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ApiHandlerService } from 'src/app/shared/services/api-handler.service';
import { Utils } from 'src/app/shared/utils';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse
} from "@angular/common/http";
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userDetails: any;
  navigateTo: any;
  header: any;

  show: any = 'login';

  viewPassword: any = {
    login: false,
    new: false,
    confirm: false
  }

  /* Login variables */
  username: any = '';
  password: any = '';

  /* ChangePassword variables */
  newPassword: any = '';
  confirmPassword: any = '';

  /* Forgot password */
  mailId: any = '';

  destroyed$: Subject<void> = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver, private ngxservice: ngxService, private requestapi: HttpClient, private apiHandler: ApiHandlerService, private ngxService: NgxUiLoaderService, private router: Router, private utils: Utils, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.ngxService.stop();
  }


  async logIn() {
    const params = {
      userName: this.username.trim(),
      password: this.password
    }

    this.ngxService.start();
    const response: any = await this.apiHandler.signInPostData(this.utils.urlUtils.API.LOGIN_AUTH, params, this.destroyed$);
    this.ngxService.stop();
    if (response) {
      this.header = response.headers;
      this.userDetails = response.body;

      if (response.body.changePassCheck) {
        this.show = 'change';
        const authorizationCode = this.header.get('authorization').split(' ');
        localStorage.setItem('authenticationToken', authorizationCode[1] || null);
      } else {
        this.saveAuth();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveAuth() {
    const authorizationCode = this.header.get('authorization').split(' ');
    /* setting values on local storage */
    localStorage.setItem('authenticationToken', authorizationCode[1] || null);

    // localStorage.setItem('authenticationToken', response.jwtToken);
    localStorage.setItem('userDetails', JSON.stringify(this.userDetails));

    localStorage.setItem('isLoggedIn', 'true');

    this.router.navigate(['/view']);

    // this.getSideMenu();
  }

  /* getSideMenu() {
    const leftMenu = this.utils.LEFT_MENU;
    const access = this.userDetails.access;
    if (access) {
      for (let nav of leftMenu) {
        nav.access = access[nav.key] ? true : false;
      }
      const navIndex = leftMenu.findIndex(element => element.access);
      if (navIndex === -1) {
        this.router.navigate(['/login']);
      } else {
        Land to the access granted page
        this.router.navigate([leftMenu[navIndex].routeUrl]);
      }
    } else {
      this.router.navigate(['/login']);
    }
  } */

  async resetConfirm() {
    if (this.newPassword.length < 8) {
      this.errorHandler.handleAlert('Password must contain 8 characters');
      return;
    } else if (this.newPassword !== this.confirmPassword) {
      this.errorHandler.handleAlert('Password mismatch');
      return;
    }
    const params = {
      employeeId: this.userDetails.employeeId,
      portalPassword: this.newPassword
    }
    const response: any = await this.apiHandler.postData(this.utils.urlUtils.API.CHANGE_PASSWORD, params, this.destroyed$);
    if (response) {
      this.saveCredentials();
    } else {
      this.router.navigate(['/login']);
    }
  }

  async forgotPassword() {
    const params = {
      email: this.mailId
    }
    const response: any = await this.apiHandler.postData(this.utils.urlUtils.API.FORGOT_PASSWORD, params, this.destroyed$);
    if (response) {
      this.mailId = '';
      this.show = 'login';
      this.errorHandler.handleAlert('Reset password sent to your mail id');
    }
  }

  checkPasswordStrength() {

  }


  async login_sso() {
    let params = {
      username: this.username.trim(),
      password: this.password
    }
    await this.requestapi.post(this.utils.urlUtils.API.LOGIN_SSO, params, {
      reportProgress: false,
      observe: "response"
    }).subscribe((response: any) => {
      if (response) {
        this.header = response.headers;
        this.userDetails = response.body;

        if (response.body.changePassCheck) {
          this.show = 'change';
          const authorizationCode = this.header.get('authorization').split(' ');
          localStorage.setItem('authenticationToken', authorizationCode[1] || null);
        } else {
          this.saveCredentials();
        }
        // this.mailId = '';
        // this.show = 'login';
        // this.errorHandler.handleAlert('Reset password sent to your mail id');
      }
    }, error => {
      console.log(error, "error");
    })


  }

  saveCredentials() {
    let data = this.userDetails;
    let allAccessData = [];
    let learnerAccessData = [];
    let HealthSafetyAccessData = [];
    let incidentAccessData = [];
    let auditAccessData = [];
    let authAccessData = [];

    for (let x of data.accessDetail) {
      allAccessData.push(JSON.parse(x));
    }
    learnerAccessData = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'LA';
    })
    HealthSafetyAccessData = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'IT';
    })
    incidentAccessData = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'IT';
    })
    auditAccessData = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'AT';
    })
    authAccessData = allAccessData.filter(function (item: any) {
      return item.app.id == 'AA';
    })
    localStorage.setItem('accessApps', JSON.stringify(allAccessData));

    let username = data.username;
    localStorage.setItem('username', username);
    this.ngxservice.userId = username;
    let access = this.setModuleAccess();
    // data.access = access;
    let { accessDetail, ...rest } = data;
    let accessData = { access: access }
    let userDetails = { ...accessData, ...rest };
    //localStorage.setItem('users', JSON.stringify(userDetails));

    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    localStorage.setItem('isLoggedIn', 'true');
    // this.setUserDetailsAuditIncident();
    let redirectURL = this.getRedirectURLByUserAccess(allAccessData);
   this.header.keys()
      .forEach((keyName) => {
        let token =this.header.get(keyName);
        if (token.includes('Bearer')) {
          let authenticationToken = token.replace('Bearer ', '');
          localStorage.setItem('authenticationToken', authenticationToken.toString());
          //this.getUserDetailsByUsername(username);

        }
        console.log(redirectURL, "redirectURL");
        this.router.navigate([redirectURL]);
      }

      );
  }


  getUserDetailsByUsername(username: any) {

    this.requestapi.get(this.utils.urlUtils.API.GET_USER_USERNAME + username).subscribe((response: any) => {
      if (response) {
        let data = response.payLoad;
        let access = this.setModuleAccess();
        data.access = access;
        localStorage.setItem('userDetails', JSON.stringify(data));
        localStorage.setItem('isLoggedIn', 'true');
        // this.setUserDetailsAuditIncident();
        this.router.navigate(['/view']);
      }
    });

  }

  setModuleAccess() {
    let access = {
      "userAccess": false,
      "employees": false,
      "courses": false,
      "reports": false,
      "faq": false,
      "message": false,
      "f2freports": false,
      "incidentList": false,
      "incidentCreateincident": false,
      "HistoryauditList": false,
      "IncidentMobile": false,
      "IncidentMobileCreate": false,
      "applicationAccessuserRoles": false,
      'incidentCreate': false,
      'incidentHistory': false,
      'auditList': false,
      'applicationAccess': false,
      'userRoles': false
    };
    let allAccessData = JSON.parse(localStorage.getItem('accessApps'))

    let isExistAuth = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'AA'
    });
    if (isExistAuth.length > 0) {

      let isExistUR = isExistAuth[0].app.modules.filter(function (item: any) {
        return item.moduleCode == 'AA-ROLE'
      });
      access.userRoles = (isExistUR) ? true : false;
      let isExistURM = isExistAuth[0].app.modules.filter(function (item: any) {
        return item.moduleCode == 'AA-URM'
      });
      access.applicationAccess = (isExistURM) ? true : false;
    } else {
      access.applicationAccess = false;
      access.userRoles = false;
    }

    let isExistLearner = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'LA'
    });
    let modulesLearners = (isExistLearner.length > 0) ? isExistLearner[0].app.modules : [];

    access.userAccess = modulesLearners.find(x => x.moduleCode == 'LA-UA')?.access ? true : false;
    access.employees = modulesLearners.find(x => x.moduleCode == 'LA-E')?.access ? true : false;
    access.courses = modulesLearners.find(x => x.moduleCode == 'LA-C')?.access ? true : false;
    access.reports = modulesLearners.find(x => x.moduleCode == 'LA-R')?.access ? true : false;
    access.faq = modulesLearners.find(x => x.moduleCode == 'LA-F')?.access ? true : false;
    access.message = modulesLearners.find(x => x.moduleCode == 'LA-M')?.access ? true : false;
    access.f2freports = modulesLearners.find(x => x.moduleCode == 'LA-F2FR')?.access ? true : false;

    /* for(let x of modulesLearners){
    access.userAccess  = (x.moduleCode=='LA-UA')?true:false;
    access.employees  = (x.moduleCode=='LA-E')?true:false;
    access.courses  = (x.moduleCode=='LA-C')?true:false;
    access.reports  = (x.moduleCode=='LA-R')?true:false;
    access.faq  = (x.moduleCode=='LA-F')?true:false;
    access.message  = (x.moduleCode=='LA-M')?true:false;
    access.f2freports  = (x.moduleCode=='LA-F2FR')?true:false;
    } */

    let isExistHS = allAccessData.filter(function (item: any) {
      return item.app.appCode == 'IT' || item.app.appCode == 'AT'
    });
    if (isExistHS.length > 0) {
      let isExistIT = allAccessData.filter(function (item: any) {
        return item.app.appCode == 'IT'
      });
      access.incidentList = (isExistIT.length > 0) ? true : false;
      access.incidentCreateincident = (isExistIT.length > 0) ? true : false;
      access.incidentCreate = (isExistIT.length > 0) ? true : false;
      access.incidentHistory = (isExistIT.length > 0) ? true : false;
      access.IncidentMobile = (isExistIT.length > 0) ? true : false;
      access.IncidentMobileCreate = (isExistIT.length > 0) ? true : false;
      let isExistAT = allAccessData.filter(function (item: any) {
        return item.app.appCode == 'AT'
      });
      access.HistoryauditList = (isExistAT.length > 0) ? true : false;
      access.auditList = (isExistAT.length > 0) ? true : false;
    }
    return access;
  }
  public productData: any = [
    {
      product_title: "APP AUTH",
      isShow: false,
      app_code: 'AA',
      modules: [
        {
          icon: "assets/images/tile-icon5.png",
          title: "Roles",
          url: "/application-access",
          isShow: false,
          moduleCode: 'AA-ROLE'
        },
        {
          icon: "assets/images/tile-icon6.png",
          title: "User role mapping",
          url: "/user-roles",
          isShow: false,
          moduleCode: 'AA-URM'
        }
      ]
    },
    {
      product_title: "LEARN",
      isShow: false,
      app_code: 'LA',
      modules: [
        {
          icon: "assets/images/tile-icon1.png",
          title: "Courses",
          url: "/courses",
          isShow: false,
          moduleCode: 'LA-C'
        },
        {
          icon: "assets/images/tile-icon2.png",
          title: "Employees",
          url: "/employees",
          isShow: false,
          moduleCode: 'LA-E'
        },
        {
          icon: "assets/images/tile-icon3.png",
          title: "Reports",
          url: "/reports",
          isShow: false,
          moduleCode: 'LA-R'
        },
        {
          icon: "assets/images/tile-icon4.png",
          title: "User access",
          url: "/userAccess",
          isShow: false,
          moduleCode: 'LA-UA'
        },
        {
          icon: "assets/images/tile-icon4.png",
          title: "F2F-Reports",
          url: "/f2f-reports",
          isShow: false,
          moduleCode: 'LA-F2FR'
        },
        {
          icon: "assets/images/tile-icon4.png",
          title: "message",
          url: "/message",
          isShow: false,
          moduleCode: 'LA-M'
        }


      ]
    },
    {
      product_title: "HEALTH & SAFETY",
      isShow: false,
      app_code: 'HS',
      modules: [
        {
          icon: "assets/images/tile-icon5.png",
          title: "Incident tracker",
          url: "/incident-list",
          isShow: false,
          moduleCode: 'IT'
        },
        {
          icon: "assets/images/tile-icon6.png",
          title: "Store audits",
          url: "/audit-list",
          isShow: false,
          moduleCode: 'AT'
        }
      ]
    },
    {
      product_title: "FORMS",
      isShow: false,
      app_code: 'FA',
      modules: [
        {
          icon: "assets/images/tile-icon7.png",
          title: "Bike assembly",
          url: "",
          isShow: false,
        }
      ]
    }
  ]
  getRedirectURLByUserAccess(allAccessData) {
    let url = '';
    let modulecode = '';
    if (allAccessData.length > 0) {
      let moduleAccessCount = 0;
      for (let x of allAccessData) {

        moduleAccessCount = x.app.modules.length + moduleAccessCount;
        for (let y of x.app.modules) {
          modulecode = y.moduleCode;
        }
      }
      if (moduleAccessCount > 1) {
        url = '/view';
      } else {
        for (let x of this.productData) {
          for (let y of x.modules) {
            if (y.moduleCode == modulecode) {
              url = y.url
            }
          }
        }

        //url='/view';
      }
    } else {
      url = '/view';
    }
    url = (url != '') ? url : '';
    if (this.breakpointObserver.isMatched(Breakpoints.Web) != true && this.breakpointObserver.isMatched(Breakpoints.Tablet) != true && this.breakpointObserver.isMatched(Breakpoints.HandsetLandscape) != true) {
              //this.router.navigate(['/incident/mobile/list']);
              url ='/incident/mobile/list';
              this.ngxservice.mobileView = true

            }
            else {
              //this.router.navigate([redirectURL]);
              this.ngxservice.mobileView = false
            }
    console.log(url,"url");
    return url;
  }
}
