import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { EmployeeManagementComponent } from './employee-management.component';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule }  from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    EmployeeManagementComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    SharedModule,
    DragDropModule
  ]
})
export class EmployeeManagementModule { }
