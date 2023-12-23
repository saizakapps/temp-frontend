import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { ngxService } from 'src/app/services/ngxservice';
import {
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from "@angular/material/dialog";
@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {
  // public productData: any = [{id:1,name:'Learners app',url:''},
  // {id:2,name:'Incident Tracker',url:''},
  // {id:3,name:'Car sheet',url:''},
  // {id:4,name:'Audit Tracker',url:''}];
  public productData: any = [
    {
      product_title: "APP AUTH",
      isShow: false,
      appCode: 'AA',
      modules: [
        {
          icon: "assets/images/tile-icon9.png",
          title: "Roles",
          url: "/#/application-access",
          isShow: false,
          moduleCode: 'AA-ROLE'
        },
        {
          icon: "assets/images/tile-icon11.png",
          title: "User role mapping",
          url: "/#/user-roles",
          isShow: false,
          moduleCode: 'AA-URM'
        }
      ]
    },
    {
      product_title: "LEARN",
      isShow: false,
      appCode: 'LA',
      modules: [
        {
          icon: "assets/images/tile-icon1.png",
          title: "Courses",
          url: "/#/courses",
          isShow: false,
          moduleCode: 'LA-C'
        },
        {
          icon: "assets/images/tile-icon2.png",
          title: "Employees",
          url: "/#/employees",
          isShow: false,
          moduleCode: 'LA-E'
        },
        {
          icon: "assets/images/tile-icon3.png",
          title: "Reports",
          url: "/#/reports",
          isShow: false,
          moduleCode: 'LA-R'
        },
        /* {
          icon: "assets/images/tile-icon4.png",
          title: "User access",
          url: "/#/userAccess",
          isShow: false,
          moduleCode: 'LA-UA'
        }, */
        {
          icon: "assets/images/tile-icon8.png",
          title: "F2F-Reports",
          url: "/#/f2f-reports",
          isShow: false,
          moduleCode: 'LA-F2FR'
        },
        {
          icon: "assets/images/tile-icon10.png",
          title: "Message",
          url: "/#/message",
          isShow: false,
          moduleCode: 'LA-M'
        }


      ]
    },
    {
      product_title: "HEALTH & SAFETY",
      isShow: false,
      appCode: 'HS',
      modules: [
        {
          icon: "assets/images/tile-icon5.png",
          title: "Incident tracker",
          url: "/#/incident-list",
          isShow: false,
          moduleCode: 'IT'
        },
        {
          icon: "assets/images/tile-icon6.png",
          title: "Store audits",
          url: "/#/audit-list",
          isShow: false,
          moduleCode: 'AT'
        }
      ]
    },
    {
      product_title: "FORMS",
      isShow: false,
      appCode: 'FA',
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
  constructor(private dialog: MatDialog, private route: Router, private ngxservice: NgxUiLoaderService) { }
  public displayName: any;
  ngOnInit(): void {
    let getAccessData: any = JSON.parse(localStorage.getItem('accessApps'));
    let accesDataKeys = Object.keys(getAccessData);

    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails != null && userDetails != undefined) {
      this.displayName = ((userDetails.firstName != '' && userDetails.firstName != null) ? userDetails.firstName : '') + ' ' + ((userDetails.lastName != '' && userDetails.lastName != null) ? userDetails.lastName : '');
    }
    this.setAccessForTail();
  }


  setAccessForTail() {

    const accessAppsList: any = JSON.parse(localStorage.getItem('accessApps'));

    const hsApps = accessAppsList.filter(app => app.app.appCode === 'IT' || app.app.appCode === 'AT');

    const tempHsModules = hsApps.map(app => app.app.modules);

    const hsModules = tempHsModules.flat();

    hsApps.forEach(app => {
      hsModules.concat(app.app.modules);
    });

    const accessApps = accessAppsList.filter(app => app.app.appCode !== 'IT' && app.app.appCode !== 'AT');

    const hs = {
      app: {
        modules: [...hsModules],
        appCode: "HS"
      }
    }

    accessApps.push(hs);

    accessApps.forEach(accessApp => {
      const appObj: any = this.productData.find(app => app.appCode === accessApp.app.appCode);
      if (appObj) {
        appObj.isShow = true;
        accessApp.app.modules.forEach(accessModule => {
          const moduleObj: any = appObj.modules.find(module => module.moduleCode === accessModule.moduleCode);
          if (moduleObj) {
            moduleObj.isShow = true;
          }
        });
      }
    });


    /* let allAccessData = JSON.parse(localStorage.getItem('accessApps'));
    if (allAccessData.length > 0) {
      for (let x of this.productData) {
        if (x.appCode == 'AA') {
          let isExistAuth = allAccessData.filter(function (item: any) {
            return item.app.appCode == 'AA'
          });
          if (isExistAuth.length > 0) {
            x.isShow = true;
            let isExistUR = isExistAuth[0].app.modules.filter(function (item: any) {
              return item.moduleCode == 'AA-ROLE'
            });
            x.modules[0].isShow = (isExistUR) ? true : false;
            let isExistURM = isExistAuth[0].app.modules.filter(function (item: any) {
              return item.moduleCode == 'AA-URM'
            });
            x.modules[1].isShow = (isExistURM) ? true : false;
          } else {
            x.isShow = false;
          }
        } else if (x.app_code == 'LA') {
          let isExistLearner = allAccessData.filter(function (item: any) {
            return item.app.appCode == 'LA'
          });
          if (isExistLearner.length > 0) {
            x.isShow = true;
            let modules = isExistLearner[0].app.modules;
            for (let y of x.modules) {
              let isExistModule = modules.filter(function (item: any) {
                return item.moduleCode == y.moduleCode
              });
              y.isShow = (isExistModule) ? true : false;
            }

          } else {
            x.isShow = false;
          }
        } else if (x.app_code == 'HS') {
          let isExistHS = allAccessData.filter(function (item: any) {
            return item.app.appCode == 'IT' || item.app.appCode == 'AT'
          });
          if (isExistHS.length > 0) {
            x.isShow = true;
            let isExistIT = allAccessData.filter(function (item: any) {
              return item.app.appCode == 'IT'
            });
            x.modules[0].isShow = (isExistIT.length > 0) ? true : false;
            let isExistAT = allAccessData.filter(function (item: any) {
              return item.app.appCode == 'AT'
            });
            x.modules[1].isShow = (isExistAT.length > 0) ? true : false;
          }
        } else if (x.app_code == 'FA') {

        }
      }
    } else {
      for (let x of this.productData) {
        x.isShow = false;
        for (let y of x.modules) {
          y.isShow = false;
        }
      }
    } */

    //     let HealthSafetyAccessData = JSON.parse(localStorage.getItem('HealthSafetyAccessData'));
    //    let learnerAccessData = JSON.parse(localStorage.getItem('learnerAccessData'));
    //   let incidentAccessData = JSON.parse(localStorage.getItem('incidentAccessData'));
    //   let auditAccessData = JSON.parse(localStorage.getItem('auditAccessData'));
    //    let authAccessData = JSON.parse(localStorage.getItem('authAccessData'));
    //    // let accessDataKeys = Object.keys(accessData);
    //    if(allAccessData.length>0){
    //      if(authAccessData.length>0){
    //        this.productData[0].isShow=true;
    //        let authAccessModules=authAccessData[0].app.modules;

    //            if((authAccessModules.filter((item)=>{ return item.id==9; })).length>0){
    //               this.productData[0].modules[0].isShow = true;
    //            }else{
    //              this.productData[0].modules[0].isShow = false;
    //            }
    //            if((authAccessModules.filter((item)=>{ return item.id==10; })).length>0){
    //               this.productData[0].modules[1].isShow = true;
    //            }else{
    //              this.productData[0].modules[1].isShow = false;
    //            }
    //      }else{
    //        this.productData[0].isShow=false;
    //      }
    //      if(learnerAccessData.length != 0){
    //          this.productData[1].isShow = true;

    //            let learnersModules=learnerAccessData[0].app.modules;;
    //           if((learnersModules.filter(function(item){ return item.name==4; })).length>0){
    //             this.productData[1].modules[0].isShow = true;

    //            }else{
    //                this.productData[1].modules[0].isShow = false;
    //            }
    //            if((learnersModules.filter((item)=>{ return item.id==1; })).length>0){
    //               this.productData[1].modules[1].isShow = true;
    //            }else{
    //              this.productData[1].modules[1].isShow = false;
    //            }
    //            if((learnersModules.filter((item)=>{ return item.id==8; })).length>0){
    //               this.productData[1].modules[2].isShow = true;
    //            }else{
    //              this.productData[1].modules[2].isShow = false;
    //            }
    //             if((learnersModules.filter((item)=>{ return item.id==5; })).length>0){
    //              this.productData[1].modules[3].isShow = true;
    //            }else{
    //              this.productData[1].modules[3].isShow = false;
    //            }
    //            if((learnersModules.filter((item)=>{ return item.id==6; })).length>0){
    //               this.productData[1].modules[4].isShow = true;
    //            }else{
    //              this.productData[1].modules[4].isShow = false;
    //            }
    //            if((learnersModules.filter((item)=>{ return item.id==7; })).length>0){
    //              this.productData[1].modules[5].isShow = true;
    //            }else{
    //                this.productData[1].modules[5].isShow = false;
    //            }


    //      }else{
    //         this.productData[1].isShow = false;
    //       this.productData[1].modules[0].isShow = false;
    //       this.productData[1].modules[1].isShow = false;
    //       this.productData[1].modules[2].isShow = false;
    //       this.productData[1].modules[3].isShow = false;
    //      }
    //      if((incidentAccessData.length>0) || (auditAccessData.length>0)){
    //            this.productData[2].isShow = true;
    //                  if((incidentAccessData.length>0)){

    //          let incidentModuleAccess:any = incidentAccessData[0].app.modules;
    //          let incidentModule:any = incidentModuleAccess.filter(function(item:any){
    //            return item.id==2;
    //          });
    //          if(incidentModule.length>0){
    //          this.productData[2].modules[0].isShow = true;
    //            }else{
    //          this.productData[2].modules[0].isShow = false;
    //            }

    //        }else{
    // this.productData[2].modules[0].isShow = false;

    //        }
    // if(auditAccessData.length>0){
    //   let auditModuleAccess:any = auditAccessData[0].app.modules;
    //          let auditModule:any = auditModuleAccess.filter(function(item:any){
    //            return item.id==3;
    //          });

    //      if((auditModule.filter(function(item:any){ return item.id==3; })).length>0){

    //          this.productData[2].modules[1].isShow = true;
    //            }else{

    //          this.productData[2].modules[1].isShow = false;
    //            }
    // }else{
    //   this.productData[2].modules[1].isShow = false;
    // }
    //      }else{
    //           this.productData[2].isShow = false;
    //      }





    //    }else{
    //      for(let x of this.productData){
    //        x.isShow=false;
    //        for(let y of x.modules){
    //          y.isShow=false;
    //        }
    //      }
    //    }
  }



  productClick(item: any) {
    if (item.name == 'Incident Tracker') {
      this.route.navigate(['incident-list']);
    } else if (item.name == 'Store Audit') {
      this.route.navigate(['audit-list']);
    } else {
      this.route.navigate([item.url]);
    }
  }

  logoutConfirm(content: any) {
    this.dialog.open(content, { width: "500px" });
  }
  logOut() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }
}
