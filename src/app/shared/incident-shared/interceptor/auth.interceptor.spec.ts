import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { CommonService } from '../../services/common.service';
import { RequestApiService } from '../../services/request-api.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
describe('AuthInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
		AuthInterceptor,
		CommonService,
		RequestApiService,
		MatSnackBar
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
