import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationAccessComponent } from './application-access.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationAccessRoutingModule { }
