"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var BusquedaElemsService = (function () {
    function BusquedaElemsService(http) {
        this.http = http;
    }
    BusquedaElemsService.prototype.busquedaClientes = function () {
        return this.http.get(environment_1.environment.apiUrl + 'media').toPromise().then(function (response) { return response.json(); });
    };
    BusquedaElemsService.prototype.busquedaLineaPedidos = function () {
        return this.http.get(environment_1.environment.apiUrl + 'media').toPromise().then(function (response) { return response.json(); });
    };
    BusquedaElemsService.prototype.busquedaPedidos = function () {
        return this.http.get(environment_1.environment.apiUrl + 'media').toPromise().then(function (response) { return response.json(); });
    };
    BusquedaElemsService.prototype.busquedaInicial = function () {
        return this.http.get(environment_1.environment.apiUrl + 'trt').toPromise().then(function (response) { return response.json(); });
    };
    BusquedaElemsService.prototype.recorteVideo = function (pedido_vid, fecha_vid, instante_recorte) {
        instante_recorte.pedido = pedido_vid;
        instante_recorte.fecha = fecha_vid;
        return this.http.post(environment_1.environment.apiUrl + 'recorte', instante_recorte).toPromise()
            .then(function (response) { return response.status === 200 ? response.text() : response.text(); });
    };
    BusquedaElemsService.prototype.screenShotVideo = function (_fecha, _pedido, _Sec) {
        return this.http.post(environment_1.environment.apiUrl + 'takeScreenShot/' + _Sec, { fecha: _fecha, pedido: _pedido }).toPromise()
            .then(function (response) { return response.status === 200 ? response.text() : response.text(); });
    };
    BusquedaElemsService.prototype.busquedaUsers = function () {
        return this.http.get(environment_1.environment.apiUrl + 'users').toPromise().then(function (response) { return response.json(); });
    };
    return BusquedaElemsService;
}());
BusquedaElemsService = __decorate([
    core_1.Injectable()
], BusquedaElemsService);
exports.BusquedaElemsService = BusquedaElemsService;
