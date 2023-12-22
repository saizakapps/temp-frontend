import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentMobileCreateComponent } from './incident-mobile-create.component';

const routes: Routes = [{
	path:'',component:IncidentMobileCreateComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentMobileCreateRoutingModule { }
