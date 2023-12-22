import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentMobileHomeComponent } from './incident-mobile-home.component';

const routes: Routes = [{
	path:'',component:IncidentMobileHomeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentMobileHomeRoutingModule { }
