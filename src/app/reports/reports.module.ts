import { ReportsComponent } from './reports.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { MainSharedModule } from '../main-shared.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MainSharedModule,
    SharedModule,
  ]
})
export class ReportsModule { }
