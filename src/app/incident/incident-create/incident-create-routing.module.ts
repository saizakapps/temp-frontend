import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentCreateComponent } from './incident-create.component';

const routes: Routes = [
{
	path:'',component:IncidentCreateComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncidentCreateRoutingModule { }
