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
var material_1 = require("@angular/material");
var dialogsnap_component_1 = require("./dialogsnap.component");
var environment_1 = require("../../environments/environment");
var DialogVideoComponent = (function () {
    function DialogVideoComponent(dialogRef, data, busqueda_elems_service, dialogSnap, transPipe) {
        // Poner el volumen ajustado al param del video
        this.dialogRef = dialogRef;
        this.data = data;
        this.busqueda_elems_service = busqueda_elems_service;
        this.dialogSnap = dialogSnap;
        this.transPipe = transPipe;
        // Internacionalizacion var change
        this.cambio_estrat = true;
        /*
           HITOS
         */
        this.condicion = 'video_completo'; // Indica si se está tratando un video completo, o una linea de pedido
        this.milestones = [];
        this.chinchetas_hitos = [];
        this.fechas_milisegundos = { fecha_inicio: null, fecha_final: null, segundo_ant: null, segundo_post: null };
        /*
          Variables en si del video(cambios durante su ejecución)
         */
        this.id_play_pause = 'play_arrow'; // Muestra el icono play-pause
        this.id_volume = 'volume_down'; // Muestra icono volumen
        this.icon_full_screen = 'fullscreen'; // Muestra icono pantalla completa
        this.marginSpacer = '-5px';
        this.displayScreenShotButton = false;
        this.speedVideo = ['1', '2', '4', '8'];
        this.indexSpeedVideo = '1';
        this.contestacion_recorte = null;
        this.estaRecortando = false;
        // Booleano indica si el puntero ha sido agarrado
        this.iscaugth = false;
        /*
            Texto de advertencia de contenido
         */
        this.visibilidad_texto_video = [];
        this.muestra_texto_video = 'inherit';
        this.indice_contenido = 0;
        this.color_barra = 'grey';
        this.escalas = [];
        this.carga_hito = { hitos: null, indice: null };
        this.instante_recorte = { instante_inicial: '', instante_final: 0 };
        // Carga el objeto del video y su metadata
        this.video_obj = data.vid;
        // Carga los hitos(lineas de pedido) tanto si se accede desde una linea de pedido en concreto como del video completo
        this.carga_hito.hitos = data.vid.linea_pedido;
        this.cargaInfoTextoVideo();
        // Carga el indice tan solo si se accede desde una linea de pedido
        if (data.start !== 'video_completo') {
            this.condicion = 'linea_pedido';
            this.carga_hito.indice = data.indice;
        }
    }
    DialogVideoComponent.prototype.onResize = function () {
        this.varAvance = ((this.varAvance * this.barraTiempo.nativeElement.offsetWidth) / this.distRelBarra) - 2.5;
        this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
    };
    DialogVideoComponent.prototype.cargaInfoTextoVideo = function () {
        var asignacion = 0;
        this.visibilidad_texto_video.push({ indice: asignacion++, s1: 0, s2: 1,
            texto: this.transPipe.transform('INICIO', true) + this.video_obj.pedido + ', ' +
                this.transPipe.transform('HORA', true) + this.calculo_Tiempo(0) });
        for (var i = 0; i < this.carga_hito.hitos.length; i++) {
            this.visibilidad_texto_video.push({ indice: asignacion++, s1: this.carga_hito.hitos[i].s_inicio - 1,
                s2: this.carga_hito.hitos[i].s_inicio + 1,
                texto: this.transPipe.transform('INICIO', true) + this.carga_hito.hitos[i].nombre_linea_pedido + ', ' +
                    this.transPipe.transform('HORA', true) + this.calculo_Tiempo(this.carga_hito.hitos[i].s_inicio) });
            for (var j = 0; j < this.carga_hito.hitos[i].hitos_serie.length - 1; j++) {
                this.visibilidad_texto_video.push({ indice: asignacion++, s1: this.carga_hito.hitos[i].hitos_serie[j].s_final - 1,
                    s2: this.carga_hito.hitos[i].hitos_serie[j].s_final + 1, texto: this.transPipe.transform('PULSACION', true) +
                        this.carga_hito.hitos[i].hitos_serie[j].nombre_numero_serie + ', ' + this.transPipe.transform('HORA', true) +
                        this.calculo_Tiempo(this.carga_hito.hitos[i].s_final) });
            }
            this.visibilidad_texto_video.push({ indice: asignacion++, s1: this.carga_hito.hitos[i].s_final - 1,
                s2: this.carga_hito.hitos[i].s_final + 1, texto: this.transPipe.transform('FINAL', true) +
                    this.carga_hito.hitos[i].nombre_linea_pedido + this.transPipe.transform('Y_PULS', true) + ', ' +
                    this.transPipe.transform('HORA', true) + this.calculo_Tiempo(this.carga_hito.hitos[i].s_final) });
        }
    };
    DialogVideoComponent.prototype.accedeChincheta = function (segundo_empezar, indice_linea_pedido, indice_serie) {
        if (this.condicion === 'video_completo') {
            this.accedeHito(segundo_empezar, indice_linea_pedido);
        }
        this.video_obj.video_dom.currentTime = indice_serie;
        if (this.video_obj.video_dom.paused) {
            this.varAvance = (((indice_serie - this.percentage_time_rep) / this.fragmentoEjecutable) * this.distRelBarra) - 2.5;
        }
    };
    DialogVideoComponent.prototype.cambioBoolTranslate = function (new_var) {
        this.cambio_estrat = new_var;
    };
    DialogVideoComponent.prototype.accedeVideoCompleto = function () {
        this.muestraInfogeneral = '';
        this.carga_hito.indice = null;
        this.color_milestones = 'blue';
        this.color_barra = 'grey';
        this.condicion = 'video_completo';
        this.fragmentoEjecutable = this.video_obj.duracion;
        this.percentage_time_rep = 0;
        this.fin_video_total = this.video_obj.duracion;
        this.time_total = new Date((this.video_obj.duracion * 1000) + (this.video_obj.fecha.getTime()));
        this.setMilesStones(this.video_obj.linea_pedido, this.video_obj.duracion, this.percentage_time_rep, false);
        this.fechas_milisegundos.fecha_final = this.time_total.getTime();
        this.fechas_milisegundos.fecha_inicio = this.video_obj.fecha.getTime();
        this.fechas_milisegundos.segundo_ant = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime) + 2000;
        this.fechas_milisegundos.segundo_post = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime) + 2000;
        this.hora_final_escala_video = this.time_total;
        this.hora_inicio_escala_video = this.video_obj.fecha;
        this.sliderElement.update({ min: this.hora_inicio_escala_video.getTime(), max: this.hora_final_escala_video.getTime(),
            from: this.fechas_milisegundos.segundo_ant, to: this.fechas_milisegundos.segundo_post });
        var min_frac = (this.time_total.getTime() - this.video_obj.fecha.getTime()) / 8;
        this.posicionarScala(min_frac);
        if (this.video_obj.video_dom.paused) {
            this.varAvance = (((this.video_obj.video_dom.currentTime - this.percentage_time_rep) / this.fragmentoEjecutable) * this.distRelBarra) - 2.5;
        }
        this.pointer_events_barra = 'all';
    };
    DialogVideoComponent.prototype.posicionarScala = function (min_frac) {
        var n_hitos_scala = 9;
        var posicion = 0;
        var incremento_px = 0;
        var incremento_px_punto = 0;
        var setter;
        this.escalas = [];
        for (var i = 0; i < n_hitos_scala; i++) {
            if (i === 0) {
                setter = this.hora_inicio_escala_video;
            }
            else {
                if (i === n_hitos_scala - 1) {
                    setter = this.hora_final_escala_video;
                }
                else {
                    setter = new Date(this.hora_inicio_escala_video.getTime() + min_frac * i);
                }
            }
            this.escalas.push({ posicion_hora: posicion + '%', incremento_px: incremento_px + 'px',
                incremento_px_punto: incremento_px_punto + 'px', posicion_punto: posicion + '%', setter: setter });
            posicion += 12.5;
            incremento_px += 50;
            incremento_px_punto += 2;
        }
    };
    DialogVideoComponent.prototype.accedeHito = function (hito_sent, index) {
        if (index !== null) {
            this.carga_hito.indice = index;
        }
        this.condicion = 'linea_pedido';
        this.color_barra = 'blue';
        this.video_obj.video_dom.currentTime = hito_sent.s_inicio;
        this.time_total = new Date((this.video_obj.duracion * 1000) + (this.video_obj.fecha.getTime()));
        this.muestraInfogeneral = hito_sent.nombre_linea_pedido;
        var durLPedido = hito_sent.s_final - hito_sent.s_inicio;
        this.hora_inicio_escala_video = new Date(this.video_obj.fecha.getTime() + hito_sent.s_inicio * 1000);
        this.hora_final_escala_video = new Date(this.video_obj.fecha.getTime() + hito_sent.s_final * 1000);
        this.percentage_time_rep = hito_sent.s_inicio;
        this.fechas_milisegundos.fecha_final = this.time_total.getTime();
        this.fechas_milisegundos.fecha_inicio = this.video_obj.fecha.getTime();
        this.fechas_milisegundos.segundo_ant = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime) + 2000;
        this.fechas_milisegundos.segundo_post = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime) + 2000;
        this.sliderElement.update({ min: this.hora_inicio_escala_video.getTime(), max: this.hora_final_escala_video.getTime(),
            from: this.fechas_milisegundos.segundo_ant, to: this.fechas_milisegundos.segundo_post });
        this.fragmentoEjecutable = durLPedido;
        this.color_milestones = 'blue';
        var min_frac = (this.hora_final_escala_video.getTime() - this.hora_inicio_escala_video.getTime()) / 8;
        this.posicionarScala(min_frac);
        this.setMilesStones(hito_sent.hitos_serie, durLPedido, this.percentage_time_rep, true);
        this.fechas_milisegundos.fecha_final = this.time_total.getTime();
        this.fechas_milisegundos.fecha_inicio = this.video_obj.fecha.getTime();
        this.color_milestones = '#DBE97B';
        this.fin_video_total = hito_sent.s_final;
        this.pointer_events_barra = 'none';
    };
    DialogVideoComponent.prototype.accedeSigHito = function (event) {
        var indice_poner = this.carga_hito.indice;
        if (event.path[2].id === 'derecha_paso') {
            if (Number(indice_poner) !== (this.carga_hito.hitos.length - 1)) {
                indice_poner++;
            }
        }
        else {
            if (Number(indice_poner) !== 0) {
                indice_poner--;
            }
        }
        this.accedeHito(this.carga_hito.hitos[indice_poner], indice_poner);
    };
    /*
      Iniciación de todos los parámetros necesarios para la ejecución del video
     */
    DialogVideoComponent.prototype.ngAfterViewInit = function () {
        this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
        var video_conn = document.querySelector('video');
        this.video_obj.video_dom = video_conn;
        this.croping = document.getElementById('cropperter');
        this.croping.style.display = 'none';
    };
    DialogVideoComponent.prototype.cargaDurVideo = function () {
        this.setVarVolum();
        this.video_obj.duracion = this.video_obj.video_dom.duration;
        if (this.condicion === 'video_completo') {
            this.accedeVideoCompleto();
        }
        else {
            this.accedeHito(this.carga_hito.hitos[this.carga_hito.indice], null);
        }
    };
    /*
  
     */
    DialogVideoComponent.prototype.setMilesStones = function (hitos, duracion_video_total, resto_porcentage_video, isFullVideo) {
        var cumm_chinchetas = 10;
        var cummulative = 0;
        this.milestones = [];
        this.chinchetas_hitos = [];
        for (var i = 0; i < hitos.length; i++) {
            var h1 = ((hitos[i].s_inicio - resto_porcentage_video) * 100) / duracion_video_total;
            var h2 = ((hitos[i].s_final - resto_porcentage_video) * 100) / duracion_video_total;
            if (isFullVideo) {
                console.log('full video');
                this.chinchetas_hitos.push({
                    indice: i,
                    indice_serie: hitos[i].s_final,
                    hito_chincheta: hitos[i],
                    seg: ((hitos[i].s_final - this.percentage_time_rep) * 100) / duracion_video_total,
                    resta: cumm_chinchetas
                });
                cumm_chinchetas += 20;
            }
            else {
                for (var x = 0; x < hitos[i].hitos_serie.length; x++) {
                    this.chinchetas_hitos.push({
                        indice: i,
                        hito_chincheta: hitos[i],
                        indice_serie: hitos[i].hitos_serie[x].s_final,
                        seg: ((hitos[i].hitos_serie[x].s_final - this.percentage_time_rep) * 100) / duracion_video_total,
                        resta: cumm_chinchetas
                    });
                    cumm_chinchetas += 20;
                }
            }
            var left = h1 - cummulative;
            var width = h2 - h1;
            this.milestones.push({ left: left + '%', width: width, nombre: hitos[i] });
            // this.chinchetas_hitos.push({seg: ''});
            cummulative += width;
        }
    };
    /*
        Se encarga de recortar el espacio de tiempo del video que se ha querido
     */
    DialogVideoComponent.prototype.crop_video = function () {
        var _this = this;
        this.estaRecortando = true;
        this.busqueda_elems_service.recorteVideo(this.video_obj.pedido, this.obtenFecha(this.video_obj.fecha), this.instante_recorte).
            then(function (recorte_link) { return _this.contestacion_recorte = environment_1.environment.apiUrl + recorte_link; });
    };
    DialogVideoComponent.prototype.setTiemposRecorte = function (event) {
        this.instante_recorte.instante_inicial = this.calculo_Tiempo_Relativo((event.from - this.video_obj.fecha.getTime()) / 1000);
        this.instante_recorte.instante_final = (event.to - event.from) / 1000;
    };
    DialogVideoComponent.prototype.changeTextCrop = function () {
        this.estaRecortando = false;
    };
    DialogVideoComponent.prototype.changeIconSpeed = function (event) {
        this.video_obj.video_dom.playbackRate = event;
        this.indexSpeedVideo = event;
    };
    DialogVideoComponent.prototype.obtenFecha = function (fecha) {
        var mes = (fecha.getMonth() + 1) < 10 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
        var dia = (fecha.getDate()) < 10 ? '0' + fecha.getDate() : fecha.getDate();
        var dateString = fecha.getFullYear() + '_' + mes + '_' + dia;
        return dateString;
    };
    /*
        Se encarga de poner la pantalla completa del video
     */
    DialogVideoComponent.prototype.fullScreen = function () {
        if (this.icon_full_screen === 'fullscreen') {
            this.dialogRef.updateSize('100%', '100%');
            this.varAvance = ((this.varAvance * this.barraTiempo.nativeElement.offsetWidth) / this.distRelBarra) - 2.5;
            this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
            this.icon_full_screen = 'fullscreen_exit';
        }
        else {
            this.dialogRef.updateSize('55%');
            this.varAvance = ((this.varAvance * this.barraTiempo.nativeElement.offsetWidth) / this.distRelBarra) - 2.5;
            this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
            this.icon_full_screen = 'fullscreen';
        }
    };
    /*
      Ir al marco anterior del video, dependiendo si se quiere hacia delante o hacia detrás.
     */
    DialogVideoComponent.prototype.goFrameBack = function (event) {
        if (!this.video_obj.video_dom.paused) {
            this.video_obj.video_dom.pause();
        }
        this.id_play_pause = 'play_arrow';
        if (event.path[0].id === 'delante') {
            if (!(this.percentage_time_rep !== 0 && Math.floor(this.video_obj.video_dom.currentTime) >= this.fin_video_total)) {
                this.video_obj.video_dom.currentTime += 0.25;
            }
        }
        else {
            if (this.video_obj.video_dom.currentTime > this.hora_inicio_escala_video.getTime()) {
                this.video_obj.video_dom.currentTime -= 0.25;
            }
        }
    };
    /*
        Se encarga de mover el puntero que indica el tiempo
     */
    DialogVideoComponent.prototype.updateProgreso = function (event) {
        console.log(this.video_obj.video_dom.currentTime);
        if (!(this.percentage_time_rep !== 0 && Math.floor(this.video_obj.video_dom.currentTime) >= this.fin_video_total)) {
            var modified = true;
            for (var element_j = 0; element_j < this.visibilidad_texto_video.length; element_j++) {
                if (Math.floor(event.target.currentTime) >= Math.floor(this.visibilidad_texto_video[element_j].s1)
                    && Math.floor(event.target.currentTime) < Math.floor(this.visibilidad_texto_video[element_j].s2)) {
                    this.indice_contenido = element_j;
                    this.muestra_texto_video = 'inherit';
                    modified = false;
                }
            }
            if (modified) {
                this.muestra_texto_video = 'hidden';
            }
            var percentage = ((event.target.currentTime - this.percentage_time_rep) / this.fragmentoEjecutable) * 100;
            this.varAvance = ((percentage / 100) * this.distRelBarra) - 2.5;
            this.time_progress = this.calculo_Tiempo(event.target.currentTime);
        }
        else {
            this.video_obj.video_dom.pause();
            this.id_play_pause = 'play_arrow';
        }
    };
    /*
        Pasa a string el tiempo en valor absoluto de hh:mm:ss
     */
    DialogVideoComponent.prototype.calculo_Tiempo = function (segundos_totales) {
        segundos_totales += (this.video_obj.fecha.getUTCSeconds() +
            +this.video_obj.fecha.getUTCMinutes() * 60 + this.video_obj.fecha.getUTCHours() * 3600);
        segundos_totales = Math.floor(segundos_totales);
        var horas = Math.floor(segundos_totales / 3600);
        var minutos = Math.floor((segundos_totales - (horas * 3600)) / 60);
        var segundos = segundos_totales - (horas * 3600) - (minutos * 60);
        var horas_s = (horas < 10) ? '0' + horas : horas;
        var min_s = (minutos < 10) ? '0' + minutos : minutos;
        var seg_s = (segundos < 10) ? '0' + segundos : segundos;
        return horas_s + ':' + min_s + ':' + seg_s;
    };
    DialogVideoComponent.prototype.calculo_Tiempo_Relativo = function (segundos_totales) {
        var horas = Math.floor(segundos_totales / 3600);
        var minutos = Math.floor((segundos_totales - (horas * 3600)) / 60);
        var segundos = segundos_totales - (horas * 3600) - (minutos * 60);
        var horas_s = (horas < 10) ? '0' + horas : horas;
        var min_s = (minutos < 10) ? '0' + minutos : minutos;
        var seg_s = (segundos < 10) ? '0' + segundos : segundos;
        return horas_s + ':' + min_s + ':' + seg_s;
    };
    // Salta al clickar
    DialogVideoComponent.prototype.gtr1 = function () {
        this.iscaugth = false;
    };
    // al desclickar
    DialogVideoComponent.prototype.gtr2 = function () {
        this.iscaugth = true;
    };
    DialogVideoComponent.prototype.moverPosicion = function (event) {
        if (this.condicion === 'linea_pedido') {
            var anchuraBarra = this.barraTiempo.nativeElement.offsetWidth;
            var porcPuntero = (event.offsetX * 100) / anchuraBarra;
            var tiempo = ((porcPuntero / 100) * this.fragmentoEjecutable) + this.percentage_time_rep;
            this.video_obj.video_dom.currentTime = tiempo;
        }
    };
    // al mover
    DialogVideoComponent.prototype.gtr3 = function (event) {
        if (this.iscaugth && this.condicion === 'linea_pedido') {
            var anchuraBarra = this.barraTiempo.nativeElement.offsetWidth;
            var porcPuntero = (event.offsetX * 100) / anchuraBarra;
            var tiempo = ((porcPuntero / 100) * this.fragmentoEjecutable) + this.percentage_time_rep;
            this.video_obj.video_dom.currentTime = tiempo;
        }
    };
    /*
        Se encarga de pausar o playear el video
     */
    DialogVideoComponent.prototype.playPause = function () {
        if (this.percentage_time_rep !== 0 && Math.floor(this.video_obj.video_dom.currentTime) > Math.floor(this.fin_video_total)) {
            this.video_obj.video_dom.pause();
            this.id_play_pause = 'play_arrow';
        }
        else {
            if (this.video_obj.video_dom.paused) {
                this.video_obj.video_dom.play();
                this.id_play_pause = 'pause';
            }
            else {
                this.video_obj.video_dom.pause();
                this.id_play_pause = 'play_arrow';
            }
        }
    };
    DialogVideoComponent.prototype.onEnded = function () {
        this.id_play_pause = 'autorenew';
    };
    /*
        Se encarga de mostrar u ocultar el recortador
     */
    DialogVideoComponent.prototype.cropper = function () {
        if (this.croping.style.display === 'none') {
            this.video_obj.video_dom.pause();
            this.sliderElement.update({ from: this.video_obj.video_dom.currentTime - 1, to: this.video_obj.video_dom.currentTime + 1 });
            this.marginSpacer = -4 + '%';
            this.croping.style.display = 'block';
            this.displayScreenShotButton = true;
        }
        else {
            this.marginSpacer = 0 + '%';
            this.croping.style.display = 'none';
            this.displayScreenShotButton = false;
        }
    };
    /*
        Se encarga de subir o bajar el volumen
     */
    DialogVideoComponent.prototype.changeVolume = function (event) {
        this.video_obj.video_dom.volume = event.value / 100;
        this.setVolumen(event.value);
    };
    DialogVideoComponent.prototype.setVarVolum = function () {
        this.valueVolumRight = this.video_obj.video_dom.volume * 100;
        this.setVolumen(this.valueVolumRight);
    };
    DialogVideoComponent.prototype.setVolumen = function (value_volum) {
        if (value_volum === 0) {
            this.id_volume = 'volume_off';
        }
        else {
            if (value_volum <= 33 && 0 < value_volum) {
                this.id_volume = 'volume_mute';
            }
            else {
                if (value_volum <= 66 && 33 < value_volum) {
                    this.id_volume = 'volume_down';
                }
                else {
                    this.id_volume = 'volume_up';
                }
            }
        }
    };
    /*
        Se encarga de tomar una foto al video (screenshot)
     */
    DialogVideoComponent.prototype.snap = function () {
        this.video_obj.video_dom.pause();
        var dialogRef = this.dialogSnap.open(dialogsnap_component_1.DialogSnapComponent, {
            data: {
                _fecha: this.obtenFecha(this.video_obj.fecha),
                _pedido: this.video_obj.pedido,
                _sec: this.calculo_Tiempo_Relativo(Number(this.video_obj.video_dom.currentTime))
            }
        });
    };
    DialogVideoComponent.prototype.close = function () {
        this.dialogRef.close();
    };
    DialogVideoComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    return DialogVideoComponent;
}());
__decorate([
    core_1.ViewChild('sliderElement')
], DialogVideoComponent.prototype, "sliderElement", void 0);
__decorate([
    core_1.ViewChild('barraTiempo')
], DialogVideoComponent.prototype, "barraTiempo", void 0);
__decorate([
    core_1.HostListener('window:resize')
], DialogVideoComponent.prototype, "onResize", null);
DialogVideoComponent = __decorate([
    core_1.Component({
        templateUrl: 'dialogvideo.component.html',
        styleUrls: ['dialogvideo.component.css']
    }),
    __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA))
], DialogVideoComponent);
exports.DialogVideoComponent = DialogVideoComponent;
