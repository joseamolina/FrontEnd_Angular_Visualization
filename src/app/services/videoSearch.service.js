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
require("rxjs/add/operator/toPromise");
var VideoSearchService = (function () {
    function VideoSearchService(http) {
        this.http = http;
    }
    VideoSearchService.prototype.searchVideos = function (habilities) {
        return this.http.post(environment_1.environment.apiUrl + 'consultMedia', habilities).toPromise()
            .then(function (response) { return response.json(); });
    };
    VideoSearchService.prototype.searchAllVideos = function () {
        return this.http.get(environment_1.environment.apiUrl + 'media').toPromise().then(function (response) { return response.json(); });
    };
    VideoSearchService.prototype.searchClientVideos = function (cliente) {
        return this.http.get(environment_1.environment.apiUrl + 'media/' + cliente).toPromise().then(function (response) { return response.json(); });
    };
    return VideoSearchService;
}());
VideoSearchService = __decorate([
    core_1.Injectable()
], VideoSearchService);
exports.VideoSearchService = VideoSearchService;
