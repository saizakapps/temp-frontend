import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loginRoutes } from './login.routing';


@NgModule({
  declarations: [
    LoginComponent

  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(loginRoutes)
  ]
})
export class LoginModule { }
