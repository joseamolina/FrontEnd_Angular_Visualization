///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {VideoSearchService} from '../services/videoSearch.service';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {FormControl, Validators} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {IMyDateRangeModel, IMyDrpOptions} from 'mydaterangepicker';
import {MatDialog} from '@angular/material';
import {BusquedaElemsService} from '../services/busqueda-elems.service';
import {Cliente} from '../model/Cliente';
import {Carretilla} from '../model/Carretilla';
import 'jquery';
import {Video} from '../model/Video';
import {AuthenticationService} from '../services/login.service';
import {DialogVideoComponent} from './dialogvideo.component';
import {PermissionsService} from '../permissions/permissions.service';
import {AdventenciaComponent} from '../advertencia/adventencia.component';
import {MatSnackBar} from '@angular/material';
import {TranslatorPipe} from "../modulo_internacionalizacion/translator.pipe";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  providers: [PermissionsService]
})
export class VideosComponent implements OnInit, AfterViewInit, OnDestroy {
  noVideosAun: boolean;


  // Internacionalizacion var change
  cambio_estrat = true;

  muestraCardUser = false;

  // Controles para el autocompletado de los formularios
  myControlClientes = new FormControl();
  myControlCarretillas = new FormControl();
  myControlUsers = new FormControl();

  activePwdError = true;


  // Listas de los objetos filtrados en el autocompletado
  filteredClients: Observable<Cliente[]>;
  filteredCarretillas: Observable<Carretilla[]>;

  // Parameters to search available
  dates_available = [];
  clientes_available = [];
  carretillas_available = [];

  selectionValue = '';

  userToDelete = '';

  noDeleteUser = '';

  bothPwdEqual = false;

  alta = {username: '', email: ''};

  users_founded = [];
  users_filtered;

  pwdChange = {old: '', new: '', new_again: ''};

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  pwdChangeControl2 = new FormControl('', [Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]);
  pwdChangeControl1 = new FormControl('', [Validators.required]);
  pwdChangeControl3 = new FormControl('', [Validators.required]);

  // Variables de modelo encargadas de controlar el proceso de búsqueda
  model;
  elems: Array<any> = ['', '', '', '', '', ''];
  name_elems: Array<String> = ['cliente', 'pedido', 'carretilla', 'numero_serie', 'fecha_ini'];
  date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  linea_pedido;

  // Se encarga de controlar lo que responde el servidor de los videos buscados
  responseVideos;
  showResponse;

  total;

  erroneusMessage;

  // Controlador de la fecha (parametros y busqueda)
  placeHolderTxt = 'Selecciona una fecha';
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'},
    monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
      7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
    showClearBtn: true,
    enableDates: this.dates_available,
    showSelectDateText: true,
    disableSince: {day: this.date.getDate(), month: this.date.getMonth() + 1, year: this.date.getFullYear()},
    sunHighlight: true,
    markCurrentDay: true,
    width: '83%'
  };

  constructor( private videoService: VideoSearchService, public dialog: MatDialog,
               private busquedaElems: BusquedaElemsService, private authService: AuthenticationService,
               public permissionsService: PermissionsService, public snackBar: MatSnackBar, public trans: TranslatorPipe) {}

  ngOnDestroy() {
    this.authService.logout();
  }

  ngAfterViewInit() {

    console.log(this.permissionsService.permission);

    this.authService.giveRole(JSON.parse(sessionStorage.getItem('currentUser')).username).subscribe(
          data => {
            if (data.rol === 'cliente') {

              this.videoService.searchClientVideos(JSON.parse(sessionStorage.getItem('currentUser')).
                username).then(video => this.responseVideos = video);

            } else {

              this.busquedaElems.busquedaInicial().then(resp => this.computeElems(resp));

              this.videoService.searchAllVideos().then(video => {
                this.responseVideos = video;

                if (this.responseVideos.length === 0){
                  this.noVideosAun = true;
                }
              });

              this.filteredClients = this.myControlClientes.valueChanges.startWith(null)
                .map( cliente => cliente && typeof cliente === 'object' ? cliente.name : cliente)
                .map(name => name ? this.filter(name) : this.clientes_available.slice());
            }
          }, error => {}
    );
  }

  ngOnInit() {

    this.busquedaElems.busquedaUsers().then(resp => {
      this.users_founded = resp;
    });

    this.users_filtered = this.myControlUsers.valueChanges.startWith(null)
      .map( user => user && typeof user === 'object' ? user.username : user)
      .map(user => user ? this.filterUser(user) : this.users_founded.slice());

    this.filteredCarretillas = this.myControlCarretillas.valueChanges.startWith(null)
      .map(carretilla => carretilla && typeof carretilla === 'object' ? carretilla.name : carretilla)
      .map(name => name ? this.filterCarretillas(name) : this.carretillas_available.slice());

    this.model = JSON.parse(sessionStorage.getItem('currentUser'));

  }

  cambioBoolTranslate(new_var) {
    this.cambio_estrat = new_var;
  }

  visualizarUser() {

    this.muestraCardUser = false;
    this.authService.consultarUser(this.userToDelete).subscribe(
      data => {
        this.muestraCardUser = true;
      },error => {
        this.muestraCardUser = false;
        this.snackBar.open('No existe un usuario con ese nombre', '', { duration: 2000});
        this.userToDelete = '';

      }
    );

  }

  openAdvDialog(_mensaje_adv) {

    const dialogRef = this.dialog.open(AdventenciaComponent, {
      width: '50%',
      data: { mensaje: _mensaje_adv}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.borrarUsuario();
      }
    });

  }

  borrarUsuario() {


    this.noDeleteUser  = '';

    const dialogRef = this.dialog.open(AdventenciaComponent, {
      width: '50%',
      data: { mensaje: this.trans.transform('SEG_DEL_USER', true)}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.borrarUsuario(this.userToDelete).subscribe(
          data => {
            this.snackBar.open('El usuario ' + this.userToDelete + ' ha sido borrado', '', { duration: 2000});
            this.users_founded = this.users_founded.filter(user => user.username === this.userToDelete);
            this.users_filtered = this.myControlUsers.valueChanges.startWith(null)
              .map( user => user && typeof user === 'object' ? user.username : user)
              .map(user => user ? this.filterUser(user) : this.users_founded.slice());
            this.userToDelete = '';
            this.muestraCardUser = false;
          },
          error => {
            this.noDeleteUser  = 'No se ha podido borrar al usuario';
          }
        );
      }
    });

  }

  darDeAlta(_mensaje_adv) {

    this.noDeleteUser = '';

    if ( !this.emailFormControl.hasError('required') && !this.emailFormControl.hasError('pattern')) {

        const dialogRef = this.dialog.open(AdventenciaComponent, {
          width: '50%',
          data: { mensaje: this.trans.transform('SEG_ALTA_USER', true)}
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.authService.darAlta(this.alta.username, this.selectionValue, this.alta.email)
                .subscribe(
                  data => {

                      this.snackBar.open('El usuario ha sido dado de alta.', '', { duration: 2000});
                      this.users_founded.push({username: this.alta.username, rol: this.selectionValue});

                }, error => {
                  this.noDeleteUser = error._body.contestacion;
                }
                );
          }
        });
    }

  }


  computeElems(message: JSON) {

    const simp_dates = message['dates_found'];

    for (let i = 0; i < simp_dates.length; i++) {
      const myDate = new Date(simp_dates[i]);
      this.dates_available.push({year: myDate.getFullYear(), month: myDate.getMonth() + 1, day: myDate.getDate()});

    }

    if ( this.permissionsService.permission !== 'cliente') {
        const simp_clientes = message['clientes'];
        for (let i = 0; i < simp_clientes.length; i++) {
            const cliente = new Cliente(simp_clientes[i]);
            this.clientes_available.push(cliente);

        }
    }
    const simp_carretillas = message['carretillas_found'];

    for (let i = 0; i < simp_carretillas.length; i++) {
      const carretilla = new Carretilla(simp_carretillas[i]);
      this.carretillas_available.push(carretilla);

    }
  }

  filterCarretillas(name: string): Carretilla[] {
    return this.carretillas_available.filter(carretilla => carretilla.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filter(name: string): Cliente[] {
    return this.clientes_available.filter(cliente => cliente.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterUser(username: string) {
    return this.users_founded.filter(user => user.username.toLowerCase().indexOf(username.toLowerCase()) === 0);
  }

  displayFn(cliente: Cliente) {
    return cliente;
  }

  displayFn_carretillas(carretilla) {
    return carretilla;
  }

  displayFn_users(user) {
    return user;
  }

  openDialog(dato_video: any, event, index): void {

    const video = new Video( dato_video._id, new Date(dato_video.fecha_ini), dato_video.carretilla,
      dato_video.cliente, dato_video.pedido, dato_video.hitos, dato_video.duracion);

    const dialogRef = this.dialog.open(DialogVideoComponent, {
      width: '50%',
      // height: '72%',
      data: {
        // (String 'video_completo') v (JSON<linea_pedido>)
        start: event,

        // (int index) v (null)
        indice: index,

        // Whole video
        vid: video,
        src:  environment.apiUrl + 'accessMedia/' + dato_video.pedido + '/' + dato_video.fecha_ini,
        type: 'video/mp4' }
    });

  }

  changePwd() {

    if (this.pwdChange.new !== this.pwdChange.new_again) this.bothPwdEqual = true;

    const _mesage = this.trans.transform('SEG_CH_PWD', true);

    if ( ( !this.pwdChangeControl2.hasError('required') &&
        !this.pwdChangeControl2.hasError('pattern') &&
        !this.pwdChangeControl1.hasError('required') &&
        this.pwdChange.new_again === this.pwdChange.new &&
        !this.pwdChangeControl3.hasError('required'))) {

      this.bothPwdEqual = false;

      const dialogRef = this.dialog.open(AdventenciaComponent, {
        width: '50%',
        data: { mensaje: _mesage}
      });



      dialogRef.afterClosed().subscribe(result => {

        if (result) {
          this.authService.changePwd(JSON.parse(sessionStorage.getItem('currentUser'))
            .username, this.pwdChange.old, this.pwdChange.new).subscribe(
            data => {
              this.snackBar.open('La contraseña ha sido cambiada correctamente', '', { duration: 3000});
              this.pwdChange = {old: '', new: '', new_again: ''};
              this.pwdChangeControl2 = new FormControl('', [Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]);
              this.pwdChangeControl1 = new FormControl('', [Validators.required]);
              this.pwdChangeControl3 = new FormControl('', [Validators.required]);
            }, error => {
              this.erroneusMessage = 'BAD_PWD';
              this.pwdChange = {old: '', new: '', new_again: ''};
              this.pwdChangeControl2 = new FormControl('', [Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}')]);
              this.pwdChangeControl1 = new FormControl('', [Validators.required]);
              this.pwdChangeControl3 = new FormControl('', [Validators.required]);
            }
          );
        }
      });
    }
    //
  }

  onDateSelected(event: IMyDateRangeModel) {

    if (event.formatted !== '') {

      const begginingYear = event.beginDate.year;
      const begginingMonth = event.beginDate.month;
      const begginningDay = event.beginDate.day;
      const endingYear = event.endDate.year;
      const endingMonth = event.endDate.month;
      const endingDay = event.endDate.day;

      const m1 = begginingMonth < 10 ? '0' + begginingMonth :  begginingMonth;
      const d1 = begginningDay < 10 ? '0' + begginningDay : begginningDay;
      const m2 = endingMonth < 10  ? '0' + endingMonth : endingMonth;
      const d2 = endingDay < 10 ? '0' + endingDay : endingDay;


      const dateA = begginingYear + '-' + m1 + '-' + d1 + 'T00:00:00.000Z';

      const dateB = endingYear + '-' + m2 + '-' + d2 + 'T23:59:59.000Z';

      this.elems[this.elems.length - 2] = dateA;

      this.elems[this.elems.length - 1] = dateB;

    } else {
      this.elems[this.elems.length - 1] = '';
      this.elems[this.elems.length - 2] = '';
    }
  }

  submit(): void {

    const objToRet = { };
    let i;

    if (this.permissionsService.permission === 'cliente') {
      objToRet['cliente'] =  JSON.parse(sessionStorage.getItem('currentUser')).username;
    }

    for ( i = 0; i < this.name_elems.length; i++ ) {
      if (this.elems[i] !== '') {

        switch ( this.name_elems[i] ) {
          case 'carretilla':
            objToRet['carretilla'] = this.elems[i];
            break;
          case 'cliente':
            objToRet['cliente'] =  this.elems[i];
            break;
          case 'pedido':
            objToRet['pedido'] = this.elems[i];
            break;
          case 'fecha_ini':
            objToRet['fecha_ini'] = { $gte: this.elems[i], $lte: this.elems[ i + 1 ] };
            break;
          case 'numero_serie':
            objToRet['hitos'] = { $elemMatch: { hitos_serie: { $elemMatch: { nombre_numero_serie: this.elems[i] } } } };
            break;
        }
      }

    }

    this.total = JSON.stringify(objToRet);
    this.videoService.searchVideos(objToRet).then(video => this.responseVideos = video );


    if (this.responseVideos && this.responseVideos.length !== 0) {
      this.showResponse = 'Videos encontrados: ';
    } else {
      this.showResponse = 'No hay videos disponibles con esos criterios';
    }

  }
}
