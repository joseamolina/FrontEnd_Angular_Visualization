"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var material_1 = require("@angular/material");
var DialogSnapComponent = (function () {
    function DialogSnapComponent(dialogRefSnap, data, busqElem) {
        var _this = this;
        this.dialogRefSnap = dialogRefSnap;
        this.data = data;
        this.busqElem = busqElem;
        this.apiUrl = environment_1.environment.apiUrl;
        console.log(environment_1.environment);
        this.busqElem.screenShotVideo(data._pedido, data._fecha, data._sec).then(function (url) { return _this.imagen = _this.apiUrl + url; });
    }
    DialogSnapComponent.prototype.close = function () {
        this.dialogRefSnap.close();
    };
    DialogSnapComponent.prototype.onNoClick = function () {
        this.dialogRefSnap.close();
    };
    return DialogSnapComponent;
}());
DialogSnapComponent = __decorate([
    core_1.Component({
        templateUrl: 'dialogsnap.component.html',
        styleUrls: []
    }),
    __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
], DialogSnapComponent);
exports.DialogSnapComponent = DialogSnapComponent;
