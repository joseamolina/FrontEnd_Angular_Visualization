import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {AuthenticationService} from '../services/login.service';

@Injectable()
export class PermissionsService {

  public permission = '';

  constructor(authServ: AuthenticationService) {
    if (sessionStorage.getItem('currentUser')) {
      authServ.giveRole(JSON.parse(sessionStorage.getItem('currentUser')).username).subscribe(
        data => {
          this.permission = data.rol;
        }, error => {
        }
      );
    }
  }

  public use(permitive: string): void {
    this.permission = permitive;
  }
}
