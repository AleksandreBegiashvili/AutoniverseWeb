import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {

  emailconfirmMessage: any;

  constructor(private accServ: AccountService) { }

  ngOnInit() {
    this.accServ.getEmailConfirmationPage().subscribe(
      result => {
        this.emailconfirmMessage = result;
      }
    )
  }

}
