import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountService } from '../services/account.service';
//import { NoSanitizePipe } from './customPipe';
//import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmailComponent implements OnInit {

  emailconfirmMessage: any;

  constructor(private accServ: AccountService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    /*
    this.accServ.getEmailConfirmationPage(null, null).subscribe(
      result => {
        this.emailconfirmMessage = result;
      }
    )
    */
  }

}
 