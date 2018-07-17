import {Component, OnInit} from '@angular/core';
import {MtprotoService} from "./mtproto.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  phone = '';
  code = '';
  message = '';

  constructor(public mtp: MtprotoService) {
  }

  ngOnInit() {
  }


}
