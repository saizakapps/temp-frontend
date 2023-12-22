import { Utils } from './../utils';
/**
 * @author Winston.N
 */

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CreateCourseComponent } from 'src/app/create-course/create-course.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../services/common.services';

@Injectable()
export class CanComponentDeactivate implements CanDeactivate<CreateCourseComponent> {

  constructor(private ngxService: NgxUiLoaderService, private commonService: CommonService) { }

  async canDeactivate(target: CreateCourseComponent) {
    // const modified =
    await this.commonService.emitCommonSubject();
    if(localStorage.getItem('canDeactivate') === 'true'){
      localStorage.removeItem('canDeactivate');
      return true;
    }
    let text = "Do you want to leave this page?";
    if (window.confirm(text) == true) {
      return true;
    } else {
      this.ngxService.stop();
      return false;
    }
  }
}
