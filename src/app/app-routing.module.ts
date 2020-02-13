import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmailComponent } from './email/email.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: 'cars',
    loadChildren: './cars/cars.module#CarsModule'
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  },
  // {
  //   path: "emailConfirmation",
  //   component: EmailComponent
  // },
  {
    path: "access-denied",
    component: AccessDeniedComponent
  },
  {
    path: "**",
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
