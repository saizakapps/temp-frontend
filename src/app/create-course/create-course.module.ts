import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateCourseRoutingModule } from './create-course-routing.module';
import { CreateCourseComponent } from './create-course.component';
import { SharedModule } from '../shared/shared.module';
// import { NgxSuneditorModule } from 'ngx-suneditor';
import * as CKEditor from '../ckeditor/ckeditor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CreateCourseComponent],
  imports: [
    CommonModule,
    CreateCourseRoutingModule,
    SharedModule,
    CKEditorModule,
    FormsModule
    // NgxSuneditorModule
  ]
})
export class CreateCourseModule { }
