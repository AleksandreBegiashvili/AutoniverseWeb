import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: 'root'
})

export class JwtInterceptor implements HttpInterceptor {

    constructor (private accServ: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.accServ.isLoggedIn;
        let token = localStorage.getItem('jwt');
        
        if(currentUser && !isNullOrUndefined(token)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }

}