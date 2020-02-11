import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Register } from '../models/register';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlLogin: string = "https://localhost:44314/api/account/login";
  private baseUrlRegister: string = "https://localhost:44314/api/account/register";
  private baseUrlEmailConfirm: string = "https://localhost:44314/api/notification";

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('userName'));
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
    localStorage.setItem('loginStatus', '0');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userRole');
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


  getEmailConfirmationPage(userId: string, code: string): Observable<string> {
    // This condition makes sure that user can not access this resource without clicking a link with these two parameters
    // I will add a boolean for security reasons
    let hasCredentials: boolean = false;
    if(isNullOrUndefined(userId) || isNullOrUndefined(code)) {
      this.router.navigate(['login']);
    } else {
      hasCredentials = true;
    }
    let headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // BELOW REQUEST MUST BE FIXED, IT IS JUST A DEMO VERSION. SHOULD HAVE A QUERY PARAMETER. ASP.NET SHOULD BE CHANGED AS WELL
    return this.http.get<string>(`${this.baseUrlEmailConfirm}/?hasCredentials=${hasCredentials}`, {headers, responseType: 'text' as 'json'}).pipe(
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

  checkLoginStatus(): boolean {
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
