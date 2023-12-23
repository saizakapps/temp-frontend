import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layouts/layout/layout.component';
import { MainSharedModule } from './main-shared.module';
import { SharedModule } from './shared/shared.module';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from 'ng-sidebar';
import { AuthGuard } from './shared/auth-guard/auth-guard';
import { AuthInterceptor } from './shared/auth-interceptor/auth-interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { IncidentSharedModule } from './shared/incident-shared/module/incident-shared.module';
@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MainSharedModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    MainSharedModule,
    NgbModule,
    SidebarModule.forRoot(),
    IncidentSharedModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
