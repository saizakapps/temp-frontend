import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationViewRoutingModule } from './application-view-routing.module';
import { ApplicationViewComponent } from './application-view.component';

import { IncidentSharedModule } from '../../shared/incident-shared/module/incident-shared.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ApplicationViewComponent
  ],
  imports: [
    CommonModule,
    ApplicationViewRoutingModule,
	IncidentSharedModule,
	SharedModule
  ]
})
export class ApplicationViewModule { }
