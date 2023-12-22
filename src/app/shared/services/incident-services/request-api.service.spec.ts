import { TestBed } from '@angular/core/testing';

import { RequestApiService } from './request-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from '../services/common.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
describe('RequestApiService', () => {
  let service: RequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    	providers:[RequestApiService,CommonService,MatSnackBar],
		imports :[
		HttpClientTestingModule
		]
    });
    service = TestBed.inject(RequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
