import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Register } from '../models/register';
import { Login } from '../models/login';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlLogin: string = "https://localhost:44314/api/account/login";
  private baseUrlRegister: string = "https://localhost:44314/api/account/register";
  private baseUrlEmailConfirm: string = "https://localhost:44314/api/notification";

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  // SHOULD BE USED LoginViewModel later


  login(user: Login) {
    console.log(user);
    return this.http.post<any>(this.baseUrlLogin, user).pipe(

      map(result => {
        // login successful if there's a JWT token in the response
        if (result && result.token) {
          // store user details and jwt token in local storage to kepp user logged in between page refreshes
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.userRole);
          this.userName.next(localStorage.getItem('username'));
          this.userRole.next(localStorage.getItem('userRole'));


        }
        return result;
      })
    );
  };


  // Below is the login method without type safety
  /*
  login(username: string, password: string) {
    return this.http.post<any>(this.baseUrlLogin, { username, password }).pipe(

      map(result => {
        // login successful if there's a JWT token in the response
        if (result && result.token) {
          // store user details and jwt token in local storage to kepp user logged in between page refreshes
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.userRole);

        }
        return result;
      })
    );
  };

*/


  logout() {
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userRole');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/login']);
    console.log("Logged out successfully");
  }



  register(user: Register) {
    return this.http.post<any>(this.baseUrlRegister, user).pipe(
      map
        (
          result => {
            // registration was successful
            return result;
          },
          error => {
            return error;
          })
    );
  };

  // Below is the register method without type safety
  /*
    register(username: string, password: string, email: string) {
      return this.http.post<any>(this.baseUrlRegister, { username, password, email }).pipe(
        map
          (
            result => {
              // registration was successful
              return result;
            },
            error => {
              return error;
            })
      );
    };
  */




  //EMAIL CONFIRMATION. NEEDS FIX!!!!!!!!
  /*
  
  
    getEmailConfirmationPage(userId: string, code: string): Observable<string> {
      // if(isNullOrUndefined(userId) || isNullOrUndefined(code)) {
      //   this.router.navigate(['login']);
      // }
  
  
  
      //let headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      // BELOW REQUEST MUST BE FIXED, IT IS JUST A DEMO VERSION. SHOULD HAVE A QUERY PARAMETER. ASP.NET SHOULD BE CHANGED AS WELL
      return this.http.get<any>(this.baseUrlEmailConfirm).pipe(
        map(
          result => {
            return result;
          },
          error => {
            return error;
          }
        )
      );
    };
  
  */



  checkLoginStatus(): boolean {


    var loginCookie = localStorage.getItem("loginStatus");

    if (loginCookie == "1") {
      if (isNullOrUndefined(localStorage.getItem('jwt'))) {
        return false;
      }
      // Get and Decode the token
      const token = localStorage.getItem('jwt');
      const decoded = jwt_decode(token);

      // check if the cookie is valid
      if (decoded.exp === undefined) {
        return false;
      }
      // Get current date time
      const date = new Date(0);
      // Convert Exp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If value of token time greater than now
      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }
      return false;
    }
    return false;
  }


  get isLoggedIn() {
    return this.loginStatus.asObservable();
  }

  get currentUserName() {
    return this.userName.asObservable();
  }

  get currentUserRole() {
    return this.userRole.asObservable();
  }


}
