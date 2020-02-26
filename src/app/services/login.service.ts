import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import {PermissionsService} from '../permissions/permissions.service';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http) { }

  login(username: string, password: string) {

    return this.http.post(environment.apiUrl + 'login', { username: username, password: password })
      .map(user => {
        if (user && user.json().keycload) {
          sessionStorage.setItem('currentUser', JSON.stringify({username: username, keycload: user.json().keycload}));
        }
        return user;
      });
  }

  consultarUser(un) {
    return this.http.get(environment.apiUrl + 'user/' + un).map(cont => cont.json());
  }

  darAlta(_username, _rol, _email) {
    return this.http.post(environment.apiUrl + 'user',
      { username: _username, rol: _rol, email: _email})
      .map( contestacion => contestacion.json().contestacion);
  }

  giveRole(_username) {
    return this.http.get(environment.apiUrl + 'roleUser/' + _username).map(contestacion => contestacion.json());
  }

  changePwd(_username, _old_pwd, _new_pwd) {
    return this.http.post(environment.apiUrl + 'changepwd',
      { username: _username, old_pwd: _old_pwd, new_pwd: _new_pwd })
      .map( contestacion => {contestacion.json(); return contestacion; } );
  }

  borrarUsuario(_username) {

    return this.http.delete(environment.apiUrl + 'user/' + _username)
      .map( contestacion => contestacion.json());
  }

  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
  }
}
