import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, NavigationStart, NavigationError } from '@angular/router';
import { Utils } from '../../shared/utils';
import * as _ from 'underscore';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Title } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ngxService } from 'src/app/shared/services/incident-services/ngxservice';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {


  /* private previousUrl: any;
  public currentUrl: any = 'Listing'; */

  constructor(public router: Router, private utils: Utils,
    private titleService: Title,
    private ngxService: NgxUiLoaderService, public ngxservice:ngxService, private breakpointObserver: BreakpointObserver) {
    /* router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {

        this.previousUrl = this.currentUrl;
        const url = _.where(this.utils.LEFT_MENU, { routeUrl: event.url })[0]?.name || event.url;
        this.currentUrl = url !== '/' ? url : 'Courses';

      }
    }); */


    /* checking the navigation start, end */
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
      //   if(this.router.url == '/message'){
      //   this.ngxService.start();
      // }
    }

      if (event instanceof NavigationEnd) {
        // this.ngxService.stop();
        const title = this.getTitle(this.router.routerState, this.router.routerState.root)[0] || '';
        this.titleService.setTitle(`Smyths360 - ${title}`);
      }

      if (event instanceof NavigationError) {
        this.ngxService.stop();
      }
    });

  }


  ngOnInit() {
    if(this.breakpointObserver.isMatched(Breakpoints.Web)!=true && this.breakpointObserver.isMatched(Breakpoints.Tablet)!=true  && this.breakpointObserver.isMatched(Breakpoints.HandsetLandscape)!=true){
      this.ngxservice.mobileView = true
    }
    else{
      this.ngxservice.mobileView = false
    }
  }

  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
  logout() {
      localStorage.removeItem('userDetails');
      localStorage.removeItem('authAccessData');
      localStorage.removeItem('accessApps');
      localStorage.removeItem('auditAccessData');
      localStorage.removeItem('HealthSafetyAccessData');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('incidentAccessData');
      localStorage.removeItem('learnerAccessData');
    
    this.router.navigate(['/login']);
  }
}
