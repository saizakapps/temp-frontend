import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentFormRoutingModule } from './incident-form-routing.module';
import { IncidentFormComponent } from './incident-form.component';


@NgModule({
  declarations: [
     IncidentFormComponent
  ],
  imports: [
    CommonModule,
    IncidentFormRoutingModule
  ]
})
export class IncidentFormModule { }
