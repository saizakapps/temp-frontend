import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbPaginationModule, NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgImageSliderModule } from 'ng-image-slider';

import { SafePipe } from '../pipes/safe.pipe';
import { DateFromUTCPipe } from '../pipes/date-from-utc.pipe';
import { NgxUiLoaderConfig, NgxUiLoaderModule, POSITION, SPINNER } from 'ngx-ui-loader';
import { CustomTableComponent } from '../component/custom-table/custom-table.component';
import { TitlebarComponent } from '../component/titlebar/titlebar.component';
import { MultiSelectDropdownComponent } from '../component/multi-select-dropdown/multi-select-dropdown.component';
import { Utils } from './utils';
import { FileDragDropComponent } from '../component/file-drag-drop/file-drag-drop.component';
import { FileDragDropDirective } from '../directives/file-drag-drop.directive';
import { ProgressBarComponent } from '../component/progress-bar/progress-bar.component';
import { HistoryTableComponent } from '../component/history-table/history-table.component';
import { PriorityTableComponent } from '../component/priority-table/priority-table.component';
import { PdfViewerComponent } from '../component/pdf-viewer/pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentViewerComponent } from '../component/document-viewer/document-viewer.component';
import { CustomImageViewerComponent } from '../component/custom-image-viewer/custom-image-viewer.component';
import { BasicInfoViewComponent } from 'src/app/incident/basic-info-view/basic-info-view.component';
import { EvidenceViewComponent } from 'src/app/incident/evidence-view/evidence-view.component';
import { IncidentDetailsViewComponent } from 'src/app/incident/incident-details-view/incident-details-view.component';
import { InsuranceVerificationViewComponent } from 'src/app/incident/insurance-verification-view/insurance-verification-view.component';
import { IssuesHandlingViewComponent } from 'src/app/incident/issues-handling-view/issues-handling-view.component';
import { PersonalInfoViewComponent } from 'src/app/incident/personal-info-view/personal-info-view.component';
import { ProductDetailsViewComponent } from 'src/app/incident/product-details-view/product-details-view.component';
import { WitnessStatementPreviewComponent } from 'src/app/incident/witness-statement-preview/witness-statement-preview.component';
import { AuditCustomTableComponent } from 'src/app/auditcomponents/audit-custom-table/audit-custom-table.component';
import { AuditShimmertableComponent } from 'src/app/auditcomponents/audit-shimmertable/audit-shimmertable.component';

import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared.module';
import { IncidentHistoryViewComponent } from 'src/app/incident/incident-history-view/incident-history-view.component';
import { IncidentShimmerTableComponent } from '../component/incident-shimmer-table/incident-shimmer-table.component';
import { HeaderComponent } from 'src/app/layouts/header/header.component';
import { WitnessFormComponent } from 'src/app/incident/witness-form/witness-form.component';
import { WitnessViewComponent } from 'src/app/incident/witness-view/witness-view.component';
import { InsuranceVerificationFormComponent } from 'src/app/incident/insurance-verification-form/insurance-verification-form.component';
import { LegalInfoFormComponent } from 'src/app/incident/legal-info-form/legal-info-form.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsPosition: POSITION.bottomCenter,
  fgsSize: 40,
  fgsColor: 'rgba(22,194,233,0.86)',
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  hasProgressBar: false
};
@NgModule({
  declarations: [
    ProgressBarComponent,
    FileDragDropDirective,
    SafePipe,
    FileDragDropComponent,
    CustomTableComponent,
    TitlebarComponent,
    MultiSelectDropdownComponent,
    HistoryTableComponent,
    BasicInfoViewComponent,
    PersonalInfoViewComponent,
    IncidentDetailsViewComponent,
    EvidenceViewComponent,
    IssuesHandlingViewComponent,
    ProductDetailsViewComponent,
    InsuranceVerificationViewComponent,
    PriorityTableComponent,
    PdfViewerComponent,
    AuditCustomTableComponent,
    AuditShimmertableComponent,
    DateFromUTCPipe,
    DocumentViewerComponent,
    WitnessStatementPreviewComponent,
    CustomImageViewerComponent,
    IncidentHistoryViewComponent,
    IncidentShimmerTableComponent,
    HeaderComponent,
    WitnessFormComponent,
    WitnessViewComponent,
    InsuranceVerificationFormComponent,
    LegalInfoFormComponent
  ],
  imports: [
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgbPaginationModule,
    NgbAlertModule,
    NgbTooltipModule,
    ShimmerModule,
    BsDatepickerModule.forRoot(),
    NgImageSliderModule,
    GalleryModule,
    LightboxModule,
    NgxExtendedPdfViewerModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    NgbAlertModule,
    NgbTooltipModule,
    NgImageSliderModule,
    MaterialModule,
    SharedModule,
    NgxExtendedPdfViewerModule,
    BsDatepickerModule,
    GalleryModule,
    LightboxModule,

    SafePipe,
    DateFromUTCPipe,
    CustomTableComponent,
    TitlebarComponent,
    MultiSelectDropdownComponent,
    FileDragDropComponent,
    ProgressBarComponent,
    AuditCustomTableComponent,
    AuditShimmertableComponent,
    HistoryTableComponent,
    BasicInfoViewComponent,
    PersonalInfoViewComponent,
    IncidentDetailsViewComponent,
    EvidenceViewComponent,
    IssuesHandlingViewComponent,
    ProductDetailsViewComponent,
    InsuranceVerificationViewComponent,
    CustomImageViewerComponent,
    PriorityTableComponent,
    PdfViewerComponent,
    DocumentViewerComponent,
    WitnessStatementPreviewComponent,
    IncidentHistoryViewComponent,
    IncidentShimmerTableComponent,
    HeaderComponent,
    WitnessFormComponent,
    WitnessViewComponent,
    InsuranceVerificationFormComponent,
    LegalInfoFormComponent
  ],
  providers: [
    Utils,
    DatePipe
  ]
})
export class IncidentSharedModule { }
