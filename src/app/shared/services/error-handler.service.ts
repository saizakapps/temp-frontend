import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private ngxService: NgxUiLoaderService, private snackBar: MatSnackBar) { }

  /* handle alert and success event */
  handleAlert(message) {
    this.ngxService.stop();
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
