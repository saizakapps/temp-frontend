import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { F2fSummaryComponent } from './f2f-summary.component';

const routes: Routes = [{ path: '', component: F2fSummaryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F2fSummaryRoutingModule { }
