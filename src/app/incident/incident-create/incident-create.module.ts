import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentSharedModule } from '../../shared/incident-shared/module/incident-shared.module';
import { SharedModule } from '../../shared/shared.module';
import { IncidentCreateRoutingModule } from './incident-create-routing.module';
import { IncidentCreateComponent } from './incident-create.component';
// import { EvidenceViewComponent } from '../evidence-view/evidence-view.component';
import { WitnessFormComponent } from '../witness-form/witness-form.component';
import { WitnessViewComponent } from '../witness-view/witness-view.component';
// import { PersonalInfoViewComponent } from '../personal-info-view/personal-info-view.component';
// import { IncidentDetailsViewComponent } from '../incident-details-view/incident-details-view.component';
// import { ProductDetailsViewComponent } from '../product-details-view/product-details-view.component';
import { InsuranceVerificationFormComponent } from '../insurance-verification-form/insurance-verification-form.component';
// import { BasicInfoViewComponent } from '../basic-info-view/basic-info-view.component';
// import { IssuesHandlingViewComponent } from '..//issues-handling-view/issues-handling-view.component';
import { LegalInfoFormComponent } from '../legal-info-form/legal-info-form.component';


@NgModule({
  declarations: [
    IncidentCreateComponent,
  ],
  imports: [
    CommonModule,
    IncidentCreateRoutingModule,
    IncidentSharedModule,
    SharedModule

  ],exports:[
  //EvidenceViewComponent
  ]
})
export class IncidentCreateModule {
gotToList(){
 }
}
