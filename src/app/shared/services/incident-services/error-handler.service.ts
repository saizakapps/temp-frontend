import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ngxService } from './ngxservice';
import { CommonService } from './common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {


  constructor(private ngxservice: ngxService, private snackBar: MatSnackBar, private common: CommonService, private ngxService: NgxUiLoaderService) { }

  /* handle alert and success event */
  handleAlert(message: any) {
    this.ngxService.stop();
    this.snackBar.open(message, undefined, {
      duration: 3000,
    });
  }
}
