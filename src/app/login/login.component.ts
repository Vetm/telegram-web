import {Component, OnInit} from '@angular/core';
import {MtprotoService} from '../mtproto.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public number;
  public code;
  public codeRequested = false;

  constructor(private mtp: MtprotoService, private snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit() {
  }

  async next() {
    if (!this.codeRequested) {
      const auth = await this.requestCode(this.number);
      if (auth['_'] === 'auth.sentCode') {
        this.codeRequested = true;
      } else {
        this.snackBar.open('Invalid phone number. Please try again.', '', {
          duration: 5000,
        });
        this.number = '';
      }
    } else {
      const user = await this.authorizeWithCode(this.code);
      if (user) {
        this.router.navigate(['']);
      } else {
        this.snackBar.open('Invalid code. Please try again.', '', {
          duration: 5000,
        });
      }
    }
  }

  async requestCode(number) {
    return await this.mtp.requestCode(number);
  }

  async authorizeWithCode(code) {
    return await this.mtp.authorizeWithCode(code);
  }

}
