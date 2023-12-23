import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Utils } from '../utils';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {

  currentModule: any;

  learnerUrls: any;

  constructor(private router: Router, private http: HttpClient, private utils: Utils, private errorHandler: ErrorHandlerService) {
    /* this.currentModule = this.router.url;
    this.learnerUrls = ['/courses', '/create-course', '/employees', '/reports', '/f2f-reports', '/userAccess', '/message', '/user-roles']; */
  }

  getData(url, param, subject, queryParam?) {
    return new Promise((resolve, reject) => {
      if (param) {
        url = `${url}/${param}`;
      }
      if (queryParam) {
        let tempUrl = '';
        const keys = Object.keys(queryParam);
        keys.forEach((key, index) => {
          tempUrl = `${tempUrl}${key}=${queryParam[key]}`;
          if (index < keys.length - 1) {
            tempUrl += '&';
          }
        });
        url = `${url}?${tempUrl}`
      }
      this.http.get(url).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
        }
      );
    });
  }

  deleteData(url, param, subject) {
    return new Promise((resolve, reject) => {
      if (param) {
        url = `${url}/${param}`;
      }
      this.http.delete(url).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
        }
      );
    });
  }

  test(url: any) {
    this.http.get(url).pipe().subscribe()
  }

  postData(url, param, subject, message?: any) {
    return new Promise((resolve, reject) => {
      /* prepare common post param */
      const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
      const postParam = {
        deviceId: 'portal',
        payload: param,
        source: 'web',
        userId: userDetail?.id
      };
      this.http.post(url, postParam).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
          if (message) {
            this.errorHandler.handleAlert(message);
          }
        }, error => {

          if (typeof error !== 'string') {
            this.errorHandler.handleAlert(error?.error?.errors?.message || 'Internal Server Error !!!');
          }
          reject('error');
        });
    });
  }

  plainPostData(url, param, subject, message?: any) {
    return new Promise((resolve, reject) => {
      /* prepare common post param */
      const postParam = {
        payload: param
      };
      this.http.post(url, postParam).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
          if (message) {
            this.errorHandler.handleAlert(message);
          }
        }, error => {

          if (typeof error !== 'string') {
            this.errorHandler.handleAlert(error?.error?.errors?.message || 'Internal Server Error !!!');
          }
          reject('error');
        });
    });
  }

  fileUpload(url, param, subject, message?: any) {
    return new Promise((resolve, reject) => {
      this.http.post(url, param).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
          if (message) {
            this.errorHandler.handleAlert(message);
          }
        }, error => {

          if (typeof error !== 'string') {
            this.errorHandler.handleAlert(error?.error?.errors?.message || 'Internal Server Error !!!');
          }
          reject('error');
        });
    });
  }

  signInPostData(url, param, subject, message?: any) {
    return new Promise((resolve, reject) => {
      /* prepare common post param */
      const postParam = {
        deviceId: 'web',
        payload: param,
        source: 'web',
        userId: 'web'
      };
      this.http.post(url, postParam, { observe: 'response' }).pipe(takeUntil(subject)).subscribe(
        (response: any) => {
          resolve(response);
          if (message) {
            this.errorHandler.handleAlert(message);
          }
        }, error => {
          console.log('error', error);
          if (typeof error !== 'string') {
            this.errorHandler.handleAlert(error?.error?.errors?.message || 'Internal Server Error !!!');
          }
          reject('error');
        });
    });
  }
}
