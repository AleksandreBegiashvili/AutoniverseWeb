import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Login } from '../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginStatusGet: boolean;
  loginForm: FormGroup;
  // returnUrl will be used to return user to the url that he visited before login redirect
  returnUrl: string;
  errorMessage: string;
  invalidLogin: boolean;

  constructor(private accServ: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    //console.log(this.loginForm);

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onSubmit() {
    let userLogin: Login = this.loginForm.value;
    this.accServ.login(userLogin).subscribe(
      result => {
        let token = (<any>result).token;
        //console.log(token);
        console.log("User logged in successfuly");
        this.invalidLogin = false;
        //console.log(this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      },
      err => {
        this.invalidLogin = true;
        this.errorMessage = err.error.loginError;
        console.log(this.errorMessage);
      }
    )
  }

}
