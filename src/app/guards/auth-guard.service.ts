import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private accServ: AccountService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accServ.isLoggedIn.pipe(take(1), map(
      (loginStatus: boolean) => {
        const destination: string = state.url;
        const carId = route.params.id;

        // check if user is not logged in
        if (!loginStatus) {
          this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        // If user is already logged in
        switch (destination) {
          case '/cars':
          case '/cars/' + carId:
            {
              if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "Moderator") {
                return true;
              }
            }
          case '/cars/update': {
            if(localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Moderator"){
              this.router.navigate(['/access-denied']);
              return false;
            }

            if(localStorage.getItem("userRole") === "Admin"){
              return true;
            }
          }
          default: return false;
        }
      }
    ));
  }
}
