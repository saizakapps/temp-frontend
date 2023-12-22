import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentListRoutingModule } from './incident-list-routing.module';
import { IncidentListComponent } from './incident-list.component';
import { SharedModule } from '../../shared/shared.module';
//import { IncidentCreateComponent } from '../incident-create/incident-create.component';
import { IncidentSharedModule } from '../../shared/incident-shared/module/incident-shared.module';


@NgModule({
  declarations: [
    IncidentListComponent,
    //IncidentCreateComponent
  ],
  imports: [
    CommonModule,
    IncidentListRoutingModule,
    SharedModule,
    IncidentSharedModule
  ]
})
export class IncidentListModule { }
