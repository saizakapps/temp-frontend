import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { F2fReportsRoutingModule } from './f2f-reports-routing.module';
import { F2fReportsComponent } from './f2f-reports.component';
import { MainSharedModule } from '../main-shared.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    F2fReportsComponent
  ],
  imports: [
    CommonModule,
    F2fReportsRoutingModule,
    MainSharedModule,
    SharedModule
  ]
})
export class F2fReportsModule { }
