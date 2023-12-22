import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderConfig, NgxUiLoaderModule, POSITION, SPINNER } from 'ngx-ui-loader';
import { MainSharedModule } from '../main-shared.module';
import { MaterialModule } from './material.module';
import { Utils } from './utils';
import { SafePipe } from './pipes/safe.pipe';
import { DragDropFileUploadDirective } from '../file-upload/drag-drop-file-upload.directive';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateFromUTCPipe } from './pipes/date-from-utc.pipe';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ShimmerModule } from '@sreyaj/ng-shimmer';
import { ShimmertableComponent } from '../shimmertable/shimmertable.component';
import { IncidentSharedModule } from './incident-shared/module/incident-shared.module';
// import { HidePipe } from './pipes/hide.pipe';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: 'rgba(22,194,233,0.86)',
  bgsPosition: POSITION.bottomCenter,
  fgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.threeStrings, // foreground spinner type
  hasProgressBar: false
};


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    MaterialModule,
    MainSharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    ShimmerModule,
  ],
  declarations: [
    SafePipe,
    DragDropFileUploadDirective,
    DateFromUTCPipe,
    ShimmertableComponent
    // HidePipe,
  ],
  exports: [
    NgxUiLoaderModule,
    MaterialModule,
    MainSharedModule,
    ReactiveFormsModule,
    FormsModule,
    SafePipe,
    DateFromUTCPipe,
    // HidePipe,
    DragDropFileUploadDirective,
    Daterangepicker,
    NgxDocViewerModule,
    NgxPaginationModule,
    NgxExtendedPdfViewerModule,
    ShimmerModule,
    ShimmertableComponent,
  ],
  providers: [
    Utils
  ]
})
export class SharedModule { }
