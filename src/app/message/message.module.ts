import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { MessageRoutingModule } from './message-routing.module';
import { MainSharedModule } from '../main-shared.module';
import { SharedModule } from '../shared/shared.module';
import { NgxEditorModule } from 'ngx-editor';



@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule,
    MessageRoutingModule,
    MainSharedModule,
    SharedModule,
    NgxEditorModule
  ]
})
export class MessageModule { }
