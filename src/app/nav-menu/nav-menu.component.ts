import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { CarService } from '../services/car.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  // These two properties will be used to display or hide navbar items based on login status
  loginStatus$: Observable<boolean>;
  username$: Observable<string>;

  constructor(private accServ: AccountService,
              private carServ: CarService) { }

  ngOnInit() {
    this.loginStatus$ = this.accServ.isLoggedIn;
    this.username$ = this.accServ.currentUserName;
  }

  onLogout() {
    this.carServ.clearCache();
    this.accServ.logout();
  }




}
