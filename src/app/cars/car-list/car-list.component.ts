import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/public_api';
import { Car } from 'src/app/models/car';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  // For the form control -- Adding cars
  addForm: FormGroup;
  make: FormControl;
  model: FormControl;
  description: FormControl;
  year: FormControl;
  price: FormControl;

  // For the form control - Updating cars
  updateForm: FormGroup;
  _make: FormControl;
  _model: FormControl;
  _description: FormControl;
  _year: FormControl;
  _price: FormControl;
  _id: FormControl;

  // Add Modal Reference
  @ViewChild('template') addModal: TemplateRef<any>; 

  // Update Modal Reference
  @ViewChild('editTemplate') editModal: TemplateRef<any>;

  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedCar: Car;
  cars$: Observable<Car[]>;
  cars: Car[] = [];
  userRoleStatus: string;

  // Datatable properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private carServ: CarService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.cars$ = this.carServ.getCars();
    this.cars$.subscribe(
      result => {
        this.cars = result;
        this.dtTrigger.next(this.cars);
      }
    )
  }

}
