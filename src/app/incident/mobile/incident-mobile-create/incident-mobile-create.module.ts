import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentSharedModule } from '../../../shared/incident-shared/module/incident-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { IncidentMobileCreateRoutingModule } from './incident-mobile-create-routing.module';
import { IncidentMobileCreateComponent } from './incident-mobile-create.component';
import { WitnessFormComponent } from '../../witness-form/witness-form.component';
import { WitnessViewComponent } from '../../witness-view/witness-view.component';
import { InsuranceVerificationFormComponent } from '../../insurance-verification-form/insurance-verification-form.component';
import { LegalInfoFormComponent } from '../../legal-info-form/legal-info-form.component';


@NgModule({
  declarations: [
    IncidentMobileCreateComponent
  ],
  imports: [
    CommonModule,
    IncidentMobileCreateRoutingModule,
    SharedModule,
    IncidentSharedModule
  ]
})
export class IncidentMobileCreateModule { }
