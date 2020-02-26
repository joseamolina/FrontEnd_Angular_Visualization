"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/startWith");
var Cliente_1 = require("../model/Cliente");
var Carretilla_1 = require("../model/Carretilla");
require("jquery");
var Video_1 = require("../model/Video");
var dialogvideo_component_1 = require("./dialogvideo.component");
var adventencia_component_1 = require("../advertencia/adventencia.component");
var VideosComponent = (function () {
    function VideosComponent(videoService, dialog, busquedaElems, authService, permissionsService) {
        this.videoService = videoService;
        this.dialog = dialog;
        this.busquedaElems = busquedaElems;
        this.authService = authService;
        this.permissionsService = permissionsService;
        // Internacionalizacion var change
        this.cambio_estrat = true;
        this.muestraCardUser = false;
        // Controles para el autocompletado de los formularios
        this.myControlClientes = new forms_1.FormControl();
        this.myControlCarretillas = new forms_1.FormControl();
        this.myControlUsers = new forms_1.FormControl();
        // Parameters to search available
        this.dates_available = [];
        this.clientes_available = [];
        this.carretillas_available = [];
        this.selectionValue = '';
        this.userToDelete = '';
        this.users_founded = [];
        this.pwdChange = { old: '', new: '' };
        this.emailFormControl = new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.email]);
        this.elems = ['', '', '', '', '', ''];
        this.name_elems = ['cliente', 'pedido', 'carretilla', 'numero_serie', 'fecha_ini'];
        this.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        // Controlador de la fecha (parametros y busqueda)
        this.placeHolderTxt = 'Selecciona una fecha';
        this.myDateRangePickerOptions = {
            dateFormat: 'dd/mm/yyyy',
            dayLabels: { su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab' },
            monthLabels: { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
                7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' },
            showClearBtn: true,
            enableDates: this.dates_available,
            showSelectDateText: true,
            disableSince: { day: this.date.getDate(), month: this.date.getMonth() + 1, year: this.date.getFullYear() },
            sunHighlight: true,
            markCurrentDay: true,
            width: '83%'
        };
    }
    VideosComponent.prototype.ngOnDestroy = function () {
        this.authService.logout();
    };
    VideosComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.permissionsService.permission === 'admin') {
            this.busquedaElems.busquedaUsers().then(function (resp) {
                _this.users_founded = resp;
            });
            this.users_filtered = this.myControlUsers.valueChanges.startWith(null)
                .map(function (user) { return user && typeof user === 'object' ? user.username : user; })
                .map(function (user) { return user ? _this.filterUser(user) : _this.users_founded.slice(); });
        }
        this.busquedaElems.busquedaInicial().then(function (resp) { return _this.computeElems(resp); });
        if (this.permissionsService.permission === 'cliente') {
            this.videoService.searchClientVideos(JSON.parse(sessionStorage.getItem('currentUser')).
                username).then(function (video) { return _this.responseVideos = video; });
        }
        else {
            this.videoService.searchAllVideos().then(function (video) { return _this.responseVideos = video; });
            this.filteredClients = this.myControlClientes.valueChanges.startWith(null)
                .map(function (cliente) { return cliente && typeof cliente === 'object' ? cliente.name : cliente; })
                .map(function (name) { return name ? _this.filter(name) : _this.clientes_available.slice(); });
        }
        this.filteredCarretillas = this.myControlCarretillas.valueChanges.startWith(null)
            .map(function (carretilla) { return carretilla && typeof carretilla === 'object' ? carretilla.name : carretilla; })
            .map(function (name) { return name ? _this.filterCarretillas(name) : _this.carretillas_available.slice(); });
        this.model = JSON.parse(sessionStorage.getItem('currentUser'));
    };
    VideosComponent.prototype.cambioBoolTranslate = function (new_var) {
        this.cambio_estrat = new_var;
    };
    VideosComponent.prototype.visualizarUser = function () {
        this.muestraCardUser = true;
    };
    VideosComponent.prototype.openAdvDialog = function (_mensaje_adv) {
        var dialogRef = this.dialog.open(adventencia_component_1.AdventenciaComponent, {
            width: '50%',
            data: { mensaje: _mensaje_adv }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
            }
            else {
            }
        });
    };
    VideosComponent.prototype.computeElems = function (message) {
        var simp_dates = message['dates_found'];
        for (var i = 0; i < simp_dates.length; i++) {
            var myDate = new Date(simp_dates[i]);
            this.dates_available.push({ year: myDate.getFullYear(), month: myDate.getMonth() + 1, day: myDate.getDate() });
        }
        if (this.permissionsService.permission !== 'cliente') {
            var simp_clientes = message['clientes'];
            for (var i = 0; i < simp_clientes.length; i++) {
                var cliente = new Cliente_1.Cliente(simp_clientes[i]);
                this.clientes_available.push(cliente);
            }
        }
        var simp_carretillas = message['carretillas_found'];
        for (var i = 0; i < simp_carretillas.length; i++) {
            var carretilla = new Carretilla_1.Carretilla(simp_carretillas[i]);
            this.carretillas_available.push(carretilla);
        }
    };
    VideosComponent.prototype.filterCarretillas = function (name) {
        return this.carretillas_available.filter(function (carretilla) { return carretilla.name.toLowerCase().indexOf(name.toLowerCase()) === 0; });
    };
    VideosComponent.prototype.filter = function (name) {
        return this.clientes_available.filter(function (cliente) { return cliente.name.toLowerCase().indexOf(name.toLowerCase()) === 0; });
    };
    VideosComponent.prototype.filterUser = function (username) {
        return this.users_founded.filter(function (user) { return user.username.toLowerCase().indexOf(username.toLowerCase()) === 0; });
    };
    VideosComponent.prototype.displayFn = function (cliente) {
        return cliente ? cliente : cliente.name;
    };
    VideosComponent.prototype.displayFn_carretillas = function (carretilla) {
        return carretilla ? carretilla : carretilla.name;
    };
    VideosComponent.prototype.displayFn_users = function (user) {
        return user ? user : user.username;
    };
    VideosComponent.prototype.openDialog = function (dato_video, event, index) {
        var video = new Video_1.Video(dato_video._id, new Date(dato_video.fecha_ini), dato_video.carretilla, dato_video.cliente, dato_video.pedido, dato_video.hitos, dato_video.duracion);
        var dialogRef = this.dialog.open(dialogvideo_component_1.DialogVideoComponent, {
            width: '50%',
            // height: '72%',
            data: {
                // (String 'video_completo') v (JSON<linea_pedido>)
                start: event,
                // (int index) v (null)
                indice: index,
                // Whole video
                vid: video,
                src: environment_1.environment.apiUrl + 'accessMedia/' + dato_video.pedido + '/' + dato_video.fecha_ini,
                type: 'video/mp4'
            }
        });
    };
    VideosComponent.prototype.changePwd = function () {
        var _this = this;
        this.authService.changePwd(JSON.parse(sessionStorage.getItem('currentUser')).username, this.pwdChange.old, this.pwdChange.new).subscribe(function (data) {
        }, function (error) {
            _this.erroneusMessage = 'BAD_PWD';
        });
        this.pwdChange = { old: '', new: '' };
    };
    VideosComponent.prototype.onDateSelected = function (event) {
        if (event.formatted !== '') {
            var begginingYear = event.beginDate.year;
            var begginingMonth = event.beginDate.month;
            var begginningDay = event.beginDate.day;
            var endingYear = event.endDate.year;
            var endingMonth = event.endDate.month;
            var endingDay = event.endDate.day;
            var m1 = begginingMonth < 10 ? '0' + begginingMonth : begginingMonth;
            var d1 = begginningDay < 10 ? '0' + begginningDay : begginningDay;
            var m2 = endingMonth < 10 ? '0' + endingMonth : endingMonth;
            var d2 = endingDay < 10 ? '0' + endingDay : endingDay;
            var dateA = begginingYear + '-' + m1 + '-' + d1 + 'T00:00:00.000Z';
            var dateB = endingYear + '-' + m2 + '-' + d2 + 'T23:59:59.000Z';
            this.elems[this.elems.length - 2] = dateA;
            this.elems[this.elems.length - 1] = dateB;
        }
        else {
            this.elems[this.elems.length - 1] = '';
            this.elems[this.elems.length - 2] = '';
        }
    };
    VideosComponent.prototype.submit = function () {
        var _this = this;
        var objToRet = {};
        var i;
        for (i = 0; i < this.name_elems.length; i++) {
            if (this.elems[i] !== '') {
                switch (this.name_elems[i]) {
                    case 'carretilla':
                        objToRet['carretilla'] = this.elems[i];
                        break;
                    case 'cliente':
                        if (this.permissionsService.permission === 'cliente') {
                            objToRet['cliente'] = JSON.parse(sessionStorage.getItem('currentUser')).username;
                        }
                        else {
                            objToRet['cliente'] = this.elems[i];
                        }
                        break;
                    case 'pedido':
                        objToRet['pedido'] = this.elems[i];
                        break;
                    case 'fecha_ini':
                        objToRet['fecha_ini'] = { $gte: this.elems[i], $lte: this.elems[i + 1] };
                        break;
                    case 'numero_serie':
                        objToRet['hitos'] = { $elemMatch: { hitos_serie: { $elemMatch: { nombre_numero_serie: this.elems[i] } } } };
                        break;
                }
            }
        }
        this.total = JSON.stringify(objToRet);
        this.videoService.searchVideos(objToRet).then(function (video) { return _this.responseVideos = video; });
        if (this.responseVideos && this.responseVideos.length !== 0) {
            this.showResponse = 'Videos encontrados: ';
        }
        else {
            this.showResponse = 'No hay videos disponibles con esos criterios';
        }
    };
    return VideosComponent;
}());
VideosComponent = __decorate([
    core_1.Component({
        selector: 'app-videos',
        templateUrl: './videos.component.html',
        styleUrls: ['./videos.component.css']
        // providers: [FORM_PROVIDERS]
    })
], VideosComponent);
exports.VideosComponent = VideosComponent;
