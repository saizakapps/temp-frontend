import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { CoursesComponent } from './courses.component';
import { MainSharedModule } from '../main-shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
//import * as _ from 'underscore';


@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    MainSharedModule,
    SharedModule,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule,
    DragDropModule
  ]
})
export class CoursesModule { }
