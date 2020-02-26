import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class BusquedaElemsService {

  constructor(private http: Http) { }

  busquedaClientes() {
    return this.http.get(environment.apiUrl + 'media').toPromise().then(response => response.json());
  }

  busquedaLineaPedidos() {
    return this.http.get(environment.apiUrl + 'media').toPromise().then(response => response.json());
  }

  busquedaPedidos() {
    return this.http.get(environment.apiUrl + 'media').toPromise().then(response => response.json());
  }


  busquedaInicial(): Promise<JSON> {
      return this.http.get(environment.apiUrl + 'trt').toPromise().then(response => response.json());
  }

  recorteVideo(pedido_vid, fecha_vid, instante_recorte) {

    instante_recorte.pedido = pedido_vid;
    instante_recorte.fecha = fecha_vid;

    return this.http.post(environment.apiUrl + 'recorte', instante_recorte).toPromise()
      .then(response => { return response.status === 200 ? response.text() : response.text(); }
      );

  }

  screenShotVideo(_fecha, _pedido, _Sec): Promise<string> {

    return this.http.post(environment.apiUrl + 'takeScreenShot/' + _Sec, {fecha: _fecha, pedido: _pedido}).toPromise()
      .then(response => { return response.status === 200 ? response.text() : response.text(); } );
  }

  busquedaUsers() {
      return this.http.get(environment.apiUrl + 'users').toPromise().then(response => response.json());
  }

}
