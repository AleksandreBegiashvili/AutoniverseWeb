import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarListComponent } from './car-list/car-list.component';
import { CarDetailsComponent } from './car-details/car-details.component';

const routes: Routes = [
  {
    path: '',
    component: CarListComponent
  },
  {
    path: 'car-list',
    component: CarListComponent
  },
  {
    path: ':id',
    component: CarDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule { }
