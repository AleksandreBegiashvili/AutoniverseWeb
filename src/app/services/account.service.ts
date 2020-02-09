import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }

  private baseUrlLogin: string = "https://localhost:44314/api/account/login";
  private baseUrlRegister: string = "https://localhost:44314/api/account/register";

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('userName'));
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  // SHOULD BE USED LoginViewModel later
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
  }

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
