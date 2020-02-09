import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Register } from '../models/register';
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private accServ: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private modalServ: BsModalService
  ) { }

 

  // FormControl properties. Initialized here to later use password property
  registerForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;

  errorList: string[];
  modalRef: BsModalRef;
  modalMessage: string;

  // This decorator will reference the modal in html with id template
  @ViewChild('template') modal: TemplateRef<any>;


  // Custom Validator to validate password and cpassword are same
  // Works Fine
  mustMatch(passwordControl: AbstractControl): ValidatorFn {
    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls have not been initialized yet
      if (!passwordControl && !cpasswordControl) {
        return null;
      }
      // return null if another validator has already found an error on the matchingControl
      if (cpasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (passwordControl.value !== cpasswordControl.value) {
        return { 'mustMatch': true };
      } else {
        return null;
      }

    }
  }

  // Works Fine
  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required, this.mustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);

    this.registerForm = this.fb.group({
      username: this.username,
      password: this.password,
      cpassword: this.cpassword,
      email: this.email
    });

    // initialize errorList property
    this.errorList = [];
  }

  // Works fine except not all errors are shown in modal at one go
  onSubmit() {
    let user: Register = this.registerForm.value;
    this.accServ.register(user.username, user.password, user.email).subscribe(
      result => {
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
        this.errorList = [];
        for(var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          //console.log(error.error.value[i]);
        }
        this.modalMessage = "Your Registration Was Unsuccessful";
        this.modalRef = this.modalServ.show(this.modal);
      }
    );
  }

}
