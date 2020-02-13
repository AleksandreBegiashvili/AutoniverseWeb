import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailsComponent } from './car-details/car-details.component';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CarListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'car-list',
    component: CarListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: ':id',
    component: CarDetailsComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService
  ]
})
export class CarsRoutingModule { }
