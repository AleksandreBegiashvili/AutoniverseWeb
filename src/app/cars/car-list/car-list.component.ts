import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Car } from 'src/app/models/car';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { CarService } from 'src/app/services/car.service';


@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit, OnDestroy {

  // For the form control -- Adding cars
  addForm: FormGroup;
  make: FormControl;
  model: FormControl;
  description: FormControl;
  productionYear: FormControl;
  price: FormControl;

  // For the form control - Updating cars
  updateForm: FormGroup;
  _make: FormControl;
  _model: FormControl;
  _description: FormControl;
  _productionYear: FormControl;
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



  constructor(private carServ: CarService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef) { }

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
        this.chRef.detectChanges();
        this.dtTrigger.next(this.cars);
      }
    );

    // Modal Message
    this.modalMessage = "All Fields Are Mandatory";

    // add-form properties
    this.make = new FormControl('', [Validators.required]);
    this.model = new FormControl('', [Validators.required]);
    this.description = new FormControl('', [Validators.required]);
    this.price = new FormControl('', [Validators.required]);
    this.productionYear = new FormControl('', [Validators.required]);
    this.addForm = this.fb.group({
      price: this.price,
      make: this.make,
      model: this.model,
      description: this.description,
      productionYear: this.productionYear
    });

    // update-form properties
    this._id = new FormControl();
    this._make = new FormControl('', [Validators.required]);
    this._model = new FormControl('', [Validators.required]);
    this._description = new FormControl('', [Validators.required]);
    this._price = new FormControl('', [Validators.required]);
    this._productionYear = new FormControl('', [Validators.required]);
    this.updateForm = this.fb.group({
      id: this._id,
      make: this._make,
      model: this._model,
      description: this._description,
      price: this._price,
      productionYear: this._productionYear
    });

  }

  onAddCar() {
    this.modalRef = this.modalService.show(this.addModal);
  }

  onSubmit() {
    let newCar = this.addForm.value;
    newCar.carCategoryId = 1;
    //console.log(newCar);

    this.carServ.insertCar(newCar).subscribe(
      result => {
        this.carServ.clearCache();
        this.cars$ = this.carServ.getCars();

        this.cars$.subscribe(newList => {
          this.cars = newList;
          this.modalRef.hide();
          this.addForm.reset();
          this.rerender();
        });
        console.log("New Car Added");
      },
      error => console.log("Could Not Add Product")
    )
  };

  onUpdate() {
    let editCar = this.updateForm.value;
    this.carServ.updateCar(editCar.id, editCar).subscribe(
      result => {
        console.log('Car Updated');
        this.carServ.clearCache();
        this.cars$ = this.carServ.getCars();
        this.cars$.subscribe(updatedList => {
          this.cars = updatedList;
          this.modalRef.hide();
          this.rerender();
        })
      },
      error => console.log('Could not update car')
    )
  }

  onUpdateModal(carUpdate: Car): void {
    this._id.setValue(carUpdate.id);
    this._make.setValue(carUpdate.make);
    this._model.setValue(carUpdate.model);
    this._description.setValue(carUpdate.description);
    this._price.setValue(carUpdate.price);
    this._productionYear.setValue(carUpdate.productionYear);

    this.updateForm.setValue({
      id: this._id.value,
      make: this._make.value,
      model: this._model.value,
      description: this._description.value,
      price: this._price.value,
      productionYear: this._productionYear.value
    });

    this.modalRef = this.modalService.show(this.editModal);
  }

  // Method for destroying new table after inserting a new car and then rerendering again
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      // Call dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}
