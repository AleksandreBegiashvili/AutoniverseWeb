import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = "https://localhost:44314/api/cars";
  private baseUrlAdd: string = "https://localhost:44314/api/cars/addcar";
  private baseUrlUpdate: string = "https://localhost:44314/api/cars/updatecar";
  private baseUrlDelete: string = "https://localhost:44314/api/cars/deletecar";

  private car$: Observable<Car[]>;

  getCars(): Observale<Car[]> {

  }

  // Get car by its ID
  getCar(): Observable<Car> {

  }

  // Insert a car
  insertCar(car: Car): Observable<Product> {

  }

  // Update a  car
  updateProduct(id: number, car: Car): Observable<Product> {

  }

  // Delete a car
  deleteCar(id: number) {
    
  }
}
