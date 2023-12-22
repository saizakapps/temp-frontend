import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import { RequestApiService } from '../services/request-api.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [ RequestApiService,CommonService,MatSnackBar],
    });
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
