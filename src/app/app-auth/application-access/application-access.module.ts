import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationAccessRoutingModule } from './application-access-routing.module';
import { ApplicationAccessComponent } from './application-access.component';
import { MultiSelectDropdownComponent } from 'src/app/shared/components/multi-select-dropdown/multi-select-dropdown.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainSharedModule } from 'src/app/main-shared.module';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';


@NgModule({
  declarations: [
    ApplicationAccessComponent,
    MultiSelectDropdownComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    ApplicationAccessRoutingModule,
    SharedModule,
    MainSharedModule
  ]
})
export class ApplicationAccessModule { }
