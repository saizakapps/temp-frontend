import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationViewComponent } from './application-view.component';
const routes: Routes = [
{path:'',component:ApplicationViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationViewRoutingModule { }
