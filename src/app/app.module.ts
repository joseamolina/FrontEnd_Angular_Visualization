import { BrowserModule } from '@angular/platform-browser';
import {NgModule, TemplateRef} from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {DialogSnapComponent} from './videos/dialogsnap.component';
import { VideosComponent } from './videos/videos.component';
import {HttpModule} from '@angular/http';
import {routing} from './app.routing';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from './services/login.service';
import {AlertService} from './services/alert.service';
import {AuthGuard} from './guards/auth.guards';
import {MatDialogRef, MatToolbarModule} from '@angular/material';
import {MaterialModule} from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule} from 'videogular2/buffering';
import { VgImaAdsModule } from 'videogular2/ima-ads';
import { VideoSearchService} from './services/videoSearch.service';
import { MomentModule } from 'angular2-moment';
import {CommonModule} from '@angular/common';
import {NgProgressModule} from 'ng2-progressbar';
import {VgStreamingModule} from 'videogular2/streaming';
import { NgxPaginationModule } from 'ngx-pagination';
import {BusquedaElemsService} from './services/busqueda-elems.service';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularDraggableModule} from 'angular2-draggable';
import {TranslatorPipe} from './modulo_internacionalizacion/translator.pipe';
import {DialogVideoComponent} from './videos/dialogvideo.component';
import {TRANSLATION_PROVIDERS} from './modulo_internacionalizacion/translations';
import {TranslateService} from './modulo_internacionalizacion/translate.service';
import {PermissionsService} from './permissions/permissions.service';
import {AdventenciaComponent} from './advertencia/adventencia.component';
import {Ng2DeviceDetectorModule} from "ng2-device-detector";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DialogVideoComponent,
    AdventenciaComponent,
    DialogSnapComponent,
    TranslatorPipe,
    VideosComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2AutoCompleteModule,
    MomentModule,
    Ng2DeviceDetectorModule.forRoot(),
    FormsModule,
    AngularDraggableModule,
    IonRangeSliderModule,
    NgxPaginationModule,
    MaterialModule,
    BrowserAnimationsModule,
    routing,
    MatToolbarModule,
    HttpModule,
    NgProgressModule,
    // FormControl,
    CommonModule,
    VgStreamingModule,
    VgCoreModule,
    VgImaAdsModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgImaAdsModule
  ],
  providers: [AuthenticationService, AlertService, AuthGuard, VideoSearchService, BusquedaElemsService, TRANSLATION_PROVIDERS, TranslateService, TranslatorPipe, PermissionsService ],
  entryComponents: [DialogVideoComponent, DialogSnapComponent, AdventenciaComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
