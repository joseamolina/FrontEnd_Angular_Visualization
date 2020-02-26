import {Component, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import {BusquedaElemsService} from '../services/busqueda-elems.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  templateUrl: 'dialogsnap.component.html',
  styleUrls: []
})

export class DialogSnapComponent {

  imagen;
  apiUrl = environment.apiUrl;

  constructor(public dialogRefSnap: MatDialogRef<DialogSnapComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private busqElem: BusquedaElemsService) {

    this.busqElem.screenShotVideo(data._pedido, data._fecha, data._sec).then(url => this.imagen = this.apiUrl + url);

  }

  close() {
    this.dialogRefSnap.close();
  }

  onNoClick(): void {
    this.dialogRefSnap.close();
  }
}
