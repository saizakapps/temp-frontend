import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentSharedModule } from '../../../shared/incident-shared/module/incident-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { IncidentMobileHomeRoutingModule } from './incident-mobile-home-routing.module';
import { IncidentMobileHomeComponent } from './incident-mobile-home.component';


@NgModule({
  declarations: [
    IncidentMobileHomeComponent
  ],
  imports: [
    CommonModule,
    IncidentMobileHomeRoutingModule,
    SharedModule,
    IncidentSharedModule
  ]
})
export class IncidentMobileHomeModule { }
