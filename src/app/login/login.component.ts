import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../services/login.service';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  // Internacionalizacion var change
  cambio_estrat = true;

  email = new FormControl('', [Validators.required, Validators.email]);
  model: any = {};
  badLogin = '';
  hide = true;
  badLog = false;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {

    this.authenticationService.login(this.model.username, this.model.password).subscribe(
          data => {
          this.router.navigate(['/']);
        }, error => {
            if (error.status === 401){
              this.badLogin = 'BAD_LOG';
              this.badLog = true;
            } else {
              this.badLogin = 'ERR_SYS_LOG';
              this.badLog = true;
            }
      }
    );
  }

}
