/**
 * @author Winston N
 */

import { Injectable, NgModule } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Utils } from '../utils';
import { ErrorHandlerService } from '../services/error-handler.service';
import { LoginService } from 'src/app/authentication/login/login.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router,
    private utils: Utils,
    private ngxService: NgxUiLoaderService,
    private errorHandler: ErrorHandlerService,
    private loginService: LoginService) {

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (!request || !request.url || request.url === this.utils.API.LOGIN_AUTH) {
      return next.handle(request);
    }

    const token = localStorage.getItem('authenticationToken');

    if (token && token !== '') {
      request = request.clone({
        // all header values should be in string
        setHeaders: {
          Authorization: 'Bearer ' + `${token}`,
        }
      });
    }

    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log('auth err', error);
        let errorMessage = '';
        if (error.status === 401 || error.status === 403 || error.status === 0 || error.error.errors.message.includes('[401 Unauthorized]')) {
          /* if (error.error.errors.message.includes('[401 Unauthorized]')) {
            errorMessage = 'Session expired, Please login again';
          } else {
            errorMessage = `${error.error.errors.message}`;
          } */
          errorMessage = 'Session expired, Please login again';
          this.loginService.logout();
         // location.reload();
        } else if (error.error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `${error.error.error.message}`;
        } else if (error.error.message) {
          // Validation message from the back end to display in UI
          errorMessage = `${error.error.message}`;
        } else if (error.error.errors && error.error.errors.message) {
          // Validation message from the back end to display in UI
          errorMessage = `${error.error.errors.message}`;
        } else {
          // server-side error
          // errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
          errorMessage = error.name === 'HttpErrorResponse' ? 'Internal Server Error' : error.name;
        }
        if (errorMessage.indexOf("[{") !== -1) {
          const tempArr = JSON.parse(errorMessage.slice(errorMessage.indexOf("[{")) || '[]');
          errorMessage = tempArr[0] && tempArr[0]?.errors?.message ? tempArr[0].errors.message : errorMessage;
        }
        errorMessage = errorMessage
        this.errorHandler.handleAlert(errorMessage);
        return throwError(errorMessage);
      })
      );

  }
}
