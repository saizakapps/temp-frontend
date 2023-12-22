import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable, throwError } from 'rxjs';
import { Route, Router } from '@angular/router';
import { Utils } from '../../shared/utils';
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root',
})

export class LoginService {

  accountEmit: BehaviorSubject<any>;
  accountDetail$: Observable<any>;

  public FIR_TABLE_NAME: any;
  public FIR_DF_TABLE_NAME: any = null;

  /* site details emiiters */
  siteEmit: BehaviorSubject<any>;
  siteEmitter$: Observable<any>;

  public reportSubject = new Subject<any>();
  public reportEmit$ = this.reportSubject.asObservable();

  constructor(
    private http: HttpClient,
    private utils: Utils,
    private router: Router) {
    this.accountEmit = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUserDetail')));
    this.accountDetail$ = this.accountEmit.asObservable();

    /* SETTING SITE DETAILS */
    this.siteEmit = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('userSiteDetail')));
    this.siteEmitter$ = this.siteEmit.asObservable();
  }


  public get currentUserDetail() {
    return this.accountEmit.value;
  }

  public setUserDetail(user: any) {
    this.accountEmit.next(user);
  }

  public get getSiteDetail() {
    return this.siteEmit.value;
  }

  public setSiteDetail(site: any) {
    this.siteEmit.next(site);
  }


  /* get logged in user role detail */
  getUserRoleByScreen() {
  }

  /*
   sign in with given credintial
  */
  signup(param: any) {
    return this.http.post(this.utils.API.LOGIN_AUTH, param, { observe: 'response' });
  }


  /* logout user */
  logout() {
    // this.http.post(this.utils.API.LOGOUT, null).subscribe( (response) => {
    //     this.updateLocalStorage();
    // }, (error) => {
    //     console.log('error while logout');
    // });
    this.updateLocalStorage();
  }

  /* logout process */
  updateLocalStorage() {
    this.setUserDetail({});
    this.router.navigate(['/login']);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authenticationToken');
    localStorage.removeItem('userDetail');
    localStorage.removeItem('web-application-accessOption-name');
    localStorage.removeItem('selectedLanguage');
    localStorage.removeItem('task-page-filter');
    localStorage.removeItem('nav-page-filter');
    localStorage.clear();

  }


  /** validate user credentials */
  singUpToVerifyUser(param: any) {
    // return this.http.post(this.utils.API.USER_VALID, param, { observe: 'response' });
  }

  /* Report manager page set default page */
  setDefaultUrl(value: any) {
    this.reportSubject.next(value);
  }

}
