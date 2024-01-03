import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { F2fSummaryRoutingModule } from './f2f-summary-routing.module';
import { F2fSummaryComponent } from './f2f-summary.component';
import { MainSharedModule } from '../main-shared.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IncidentSharedModule } from '../shared/incident-shared/module/incident-shared.module';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';


@NgModule({
  declarations: [
    F2fSummaryComponent,
    EmployeeDetailsComponent
  ],
  imports: [
    CommonModule,
    F2fSummaryRoutingModule,
    MainSharedModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IncidentSharedModule,
  ]
})
export class F2fSummaryModule { }
