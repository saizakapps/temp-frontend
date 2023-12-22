import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
//import  { environment } from '../../../environments/environment';
import { CommonService } from '../../services/incident-services/common.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private common:CommonService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request || !request.url) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
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
        let errorMessage = '';
        if (error.status === 401 || error.status === 403 || error.status === 0) {
          this.common.logout();
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
       // errorMessage = errorMessage
       this.common.openSnackBar(errorMessage,2,"Failed");
        return throwError(errorMessage);
      })
      );

  }
  }
