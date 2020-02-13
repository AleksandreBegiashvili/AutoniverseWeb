import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { EmailComponent } from './email/email.component';
import { RouterModule } from '@angular/router';
import { DynamicComponentModule } from 'ng-dynamic';
import { DataTablesModule } from 'angular-datatables';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthGuardService } from './guards/auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    EmailComponent,
    AccessDeniedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DynamicComponentModule.forRoot({imports: [RouterModule]}),
    AngularFontAwesomeModule,
    DataTablesModule
  ],
  providers: [
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
