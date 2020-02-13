import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../models/car';
import { shareReplay, first, flatMap } from 'rxjs/operators';

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

  getCars(): Observable<Car[]> {
    if (!this.car$) {
      this.car$ = this.http.get<Car[]>(this.baseUrl).pipe(
        shareReplay()
      );
    }
    // If cars already exist, then return it
    return this.car$;
  };

  // Get car by its ID
  getCarById(id: number): Observable<Car> {
    return this.getCars().pipe(flatMap(
      result => result),
      first(car => car.id == id)
    );
  };

  // Insert a car
  insertCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.baseUrlAdd, car);
  }

  // Update a  car
  updateCar(id: number, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.baseUrlUpdate}/${id}`, car);
  }

  // Delete a car
  deleteCar(id: number) {
    return this.http.delete(`${this.baseUrlDelete}/${id}`);
  }

  // Clear cache
  clearCache() {
    this.car$ = null;
  }
}
