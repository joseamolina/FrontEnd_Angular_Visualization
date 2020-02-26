import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  templateUrl: 'advertencia.component.html',
  styleUrls: []
})

export class AdventenciaComponent {


  constructor(public dialogRefSnap: MatDialogRef<AdventenciaComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRefSnap.close();
  }
}
