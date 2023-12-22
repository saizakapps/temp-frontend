import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderModule, NgxUiLoaderConfig, POSITION, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';
import { MaterialModule } from './shared/material.module';
import { Utils } from './shared/utils';
import { NgSelectModule } from '@ng-select/ng-select';
import { AngularEditorModule } from '@kolkov/angular-editor';
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
    NgSelectModule,
    AngularEditorModule,
    NgImageSliderModule,
    PdfViewerModule,
  ],
  declarations: [],
  exports: [
    FormsModule,
    NgbModule,
    NgxUiLoaderModule,
    MaterialModule,
    NgSelectModule,
    AngularEditorModule,
    NgImageSliderModule,
    PdfViewerModule
  ],
  providers: [Utils],
  entryComponents: []
})
export class MainSharedModule { }
