import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditListRoutingModule } from './audit-list-routing.module';
import { AuditListComponent } from './audit-list.component';
import { RouterModule } from '@angular/router';
// import { MainSharedModule } from 'src/app/main-shared.module';
import { MaterialModule } from '../../shared/incident-shared/material/material.module';
// import { SharedModule } from 'src/app/shared/shared.module';
import { AuditListService } from './audit-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { IncidentSharedModule } from '../../shared/incident-shared/module/incident-shared.module';

@NgModule({
  declarations: [
    AuditListComponent,  
    ],
  imports: [
    CommonModule,
    AuditListRoutingModule,
    //MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IncidentSharedModule
  ],

})
export class AuditListModule { }
