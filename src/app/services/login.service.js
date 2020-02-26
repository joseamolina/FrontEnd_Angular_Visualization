"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var environment_1 = require("../../environments/environment");
var AuthenticationService = (function () {
    function AuthenticationService(http, permissionsService) {
        this.http = http;
        this.permissionsService = permissionsService;
    }
    AuthenticationService.prototype.login = function (username, password) {
        var _this = this;
        return this.http.post(environment_1.environment.apiUrl + 'login', { username: username, password: password })
            .map(function (user) {
            if (user && user.json().keycload) {
                _this.permissionsService.use(user.json().role);
                sessionStorage.setItem('currentUser', JSON.stringify({ username: username, keycload: user.json().keycload }));
            }
            return user;
        });
    };
    AuthenticationService.prototype.changePwd = function (_username, _old_pwd, _new_pwd) {
        console.log(_username, _old_pwd, _new_pwd);
        return this.http.post(environment_1.environment.apiUrl + 'changepwd', { username: _username, old_pwd: _old_pwd, new_pwd: _new_pwd })
            .map(function (contestacion) { return contestacion.json(); });
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable()
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
