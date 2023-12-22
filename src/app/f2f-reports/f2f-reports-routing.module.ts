import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { F2fReportsComponent } from './f2f-reports.component';

const routes: Routes = [
  {
    path: '',
    component: F2fReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F2fReportsRoutingModule { }
