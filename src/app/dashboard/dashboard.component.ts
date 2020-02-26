import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {AuthenticationService} from '../services/login.service';
import {TranslateService} from '../modulo_internacionalizacion/translate.service';
import {Ng2DeviceService} from "ng2-device-detector";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']


})
export class DashboardComponent implements OnInit {


  // Internacionalizacion var change
  cambio_estrat = true;
  userProjected;
  lenguas = [{cod: 'es', mensaje: 'ES'}, {cod: 'cat', mensaje: 'CAT'}, {cod: 'en', mensaje: 'EN'}];

  constructor(public router: Router, public http: Http, private deviceService: Ng2DeviceService, private authService: AuthenticationService, private _translate: TranslateService) {}

  ngOnInit() {

    this.userProjected = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')).username : null;
    this.selectLang('es');
  }

  changeLanguage(event) {

    switch (this.deviceService.getDeviceInfo().browser) {
      case 'chrome':
        this.selectLang(event.path[1].id);
        break;
      case 'safari':
        this.selectLang(event.target.parentElement.id);
        break;
      case 'firefox':
        this.selectLang(event.target.id);
        break;
    }
  }

  selectLang(lang: any): any {
    this._translate.use(lang);
  }

  logOut() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
