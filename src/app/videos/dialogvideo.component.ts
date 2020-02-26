/*
    @Author: José Ángel Molina
    @Date: January 2018
    @Company: 720tecSLL

 */
import {AfterViewInit, Component, HostListener, Inject, ViewChild} from '@angular/core';
import {Video} from '../model/Video';
import {IonRangeSliderComponent} from 'ng2-ion-range-slider';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {BusquedaElemsService} from '../services/busqueda-elems.service';
import {TranslatorPipe} from '../modulo_internacionalizacion/translator.pipe';
import {DialogSnapComponent} from './dialogsnap.component';
import {environment} from "../../environments/environment";
import {Ng2DeviceService} from "ng2-device-detector";

@Component({
  templateUrl: 'dialogvideo.component.html',
  styleUrls: ['dialogvideo.component.css']
})

export class DialogVideoComponent implements AfterViewInit {


  // Internacionalizacion var change
  cambio_estrat = true;

  valueVolumRight;

  /*
      Caracteristicas enviadas video.
   */
  croping;
  varAvance;
  video_obj: Video; // objeto que guarda el video(todos los valores)
  time_progress;    // Muestra el tiempo en valores absolutos

  @ViewChild('sliderElement') sliderElement: IonRangeSliderComponent;
  @ViewChild('barraTiempo') barraTiempo;

  /*
     HITOS
   */
  condicion = 'video_completo';        // Indica si se está tratando un video completo, o una linea de pedido
  milestones = [];
  chinchetas_hitos = [];
  time_total: Date;
  fechas_milisegundos = {fecha_inicio: null, fecha_final: null, segundo_ant: null, segundo_post: null};

  /*
    Variables en si del video(cambios durante su ejecución)
   */
  id_play_pause = 'play_arrow';     // Muestra el icono play-pause
  id_volume = 'volume_down';        // Muestra icono volumen
  icon_full_screen = 'fullscreen';  // Muestra icono pantalla completa
  marginSpacer = '-5px';
  displayScreenShotButton = false;
  speedVideo = ['1', '2', '4', '8'];
  indexSpeedVideo = '1';
  fin_video_total;
  percentage_time_rep;
  muestraInfogeneral;
  hora_inicio_escala_video: Date;
  hora_final_escala_video: Date;
  fragmentoEjecutable;

  contestacion_recorte = null;
  estaRecortando= false;

  condAccesoBarraHito = true;

  distRelBarra;

  // Booleano indica si el puntero ha sido agarrado
  iscaugth= false;

  /*
      Texto de advertencia de contenido
   */
  visibilidad_texto_video = [];
  muestra_texto_video = 'inherit';
  indice_contenido = 0;

  pointer_events_barra;
  color_milestones;

  color_barra = 'grey';
  escalas = [];

  carga_hito = {hitos: null, indice: null};

  instante_recorte = {instante_inicial: '', instante_final: 0};

  divWidth;


  @HostListener('window:resize') onResize() {

    this.varAvance = (( this.varAvance * this.barraTiempo.nativeElement.offsetWidth ) / this.distRelBarra ) - 2.5;
    this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
  }


  constructor(public dialogRef: MatDialogRef<DialogVideoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public busqueda_elems_service: BusquedaElemsService,
              public dialogSnap: MatDialog, public transPipe: TranslatorPipe,
              public deviceService: Ng2DeviceService) {

    // Poner el volumen ajustado al param del video


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

  cargaInfoTextoVideo() {
      let asignacion = 0;

      this.visibilidad_texto_video.push({indice: asignacion++, s1: 0, s2: 1 ,
        texto: this.transPipe.transform('INICIO', true) + this.video_obj.pedido + ', ' +
        this.transPipe.transform('HORA', true) + this.calculo_Tiempo(0)});

      for (let i = 0; i < this.carga_hito.hitos.length; i++ ) {
        this.visibilidad_texto_video.push({indice: asignacion++, s1: this.carga_hito.hitos[i].s_inicio - 1,
          s2: this.carga_hito.hitos[i].s_inicio + 1,
          texto: this.transPipe.transform('INICIO', true) + this.carga_hito.hitos[i].nombre_linea_pedido + ', '  +
          this.transPipe.transform('HORA', true) + this.calculo_Tiempo(this.carga_hito.hitos[i].s_inicio)});

        for (let j = 0; j < this.carga_hito.hitos[i].hitos_serie.length - 1; j++) {
          this.visibilidad_texto_video.push({indice: asignacion++, s1: this.carga_hito.hitos[i].hitos_serie[j].s_final - 1,
            s2: this.carga_hito.hitos[i].hitos_serie[j].s_final + 1, texto: this.transPipe.transform('PULSACION', true) +
            this.carga_hito.hitos[i].hitos_serie[j].nombre_numero_serie + ', ' + this.transPipe.transform('HORA', true) +
            this.calculo_Tiempo(this.carga_hito.hitos[i].s_final)});
        }

        this.visibilidad_texto_video.push({indice: asignacion++, s1: this.carga_hito.hitos[i].s_final - 1,
          s2: this.carga_hito.hitos[i].s_final + 1, texto: this.transPipe.transform('FINAL', true) +
          this.carga_hito.hitos[i].nombre_linea_pedido + this.transPipe.transform('Y_PULS', true) + ', ' +
          this.transPipe.transform('HORA', true) + this.calculo_Tiempo(this.carga_hito.hitos[i].s_final)});
      }
  }

  accedeChincheta(segundo_empezar, indice_linea_pedido, indice_serie) {

    if (this.condicion === 'video_completo') { this.accedeHito(indice_linea_pedido); }

    this.video_obj.video_dom.currentTime = indice_serie;
    if (this.video_obj.video_dom.paused) {
      this.varAvance = (((indice_serie - this.percentage_time_rep) / this.fragmentoEjecutable ) * this.distRelBarra ) - 2.5;
    }
  }

  cambioBoolTranslate(new_var) {
    this.cambio_estrat = new_var;
  }

  accedeVideoCompleto() {

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
    this.fechas_milisegundos.segundo_ant = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime ) + 2000;
    this.fechas_milisegundos.segundo_post = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime ) + 2000;

    this.hora_final_escala_video = this.time_total;
    this.hora_inicio_escala_video = this.video_obj.fecha;
    this.sliderElement.update({min: this.hora_inicio_escala_video.getTime(), max: this.hora_final_escala_video.getTime(),
      from: this.fechas_milisegundos.segundo_ant, to: this.fechas_milisegundos.segundo_post});
    const min_frac = (this.time_total.getTime() - this.video_obj.fecha.getTime()) / 8;
    this.posicionarScala(min_frac);
    if (this.video_obj.video_dom.paused) {
      this.varAvance = (((this.video_obj.video_dom.currentTime - this.percentage_time_rep) / this.fragmentoEjecutable) * this.distRelBarra ) - 2.5;
    }

    this.pointer_events_barra = 'all';
  }

  posicionarScala(min_frac) {
    const n_hitos_scala = 9;

    let posicion = 0;
    let incremento_px = 0;
    let incremento_px_punto = 0;
    let setter;

    this.escalas = [];

    for (let i = 0; i < n_hitos_scala; i++) {

      if (i === 0) {
        setter = this.hora_inicio_escala_video;
      } else {

        if (i === n_hitos_scala - 1) {
            setter = this.hora_final_escala_video;
        } else {
            setter = new Date(this.hora_inicio_escala_video.getTime() + min_frac * i);
        }

      }
        this.escalas.push({posicion_hora: posicion + '%', incremento_px: incremento_px + 'px',
          incremento_px_punto: incremento_px_punto + 'px',  posicion_punto: posicion + '%', setter: setter });
        posicion += 12.5;
        incremento_px += 50;
        incremento_px_punto += 2;
    }
  }



  accedeHito(index) {

    const hito_sent = this.carga_hito.hitos[index];

    if (index !== null ) { this.carga_hito.indice = index; }

    this.condicion = 'linea_pedido';
    this.color_barra = 'blue';



    this.time_total = new Date((this.video_obj.duracion * 1000) + (this.video_obj.fecha.getTime()));
    this.muestraInfogeneral = hito_sent.nombre_linea_pedido;
    const durLPedido = hito_sent.s_final - hito_sent.s_inicio;
    this.hora_inicio_escala_video = new Date(this.video_obj.fecha.getTime() + hito_sent.s_inicio * 1000);
    this.hora_final_escala_video = new Date(this.video_obj.fecha.getTime() + hito_sent.s_final * 1000);
    this.percentage_time_rep = hito_sent.s_inicio;

    this.fechas_milisegundos.fecha_final = this.time_total.getTime();
    this.fechas_milisegundos.fecha_inicio = this.video_obj.fecha.getTime();

    this.fechas_milisegundos.segundo_ant = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime ) + 2000;
    this.fechas_milisegundos.segundo_post = (this.fechas_milisegundos.fecha_inicio + this.video_obj.video_dom.currentTime ) + 2000;

    this.sliderElement.update({min: this.hora_inicio_escala_video.getTime(), max: this.hora_final_escala_video.getTime(),
      from: this.fechas_milisegundos.segundo_ant, to: this.fechas_milisegundos.segundo_post});
    this.fragmentoEjecutable = durLPedido;
    this.color_milestones = 'blue';
    const min_frac = (this.hora_final_escala_video.getTime() - this.hora_inicio_escala_video.getTime()) / 8;
    this.posicionarScala(min_frac);

    this.setMilesStones(hito_sent.hitos_serie, durLPedido, this.percentage_time_rep, true);

    this.fechas_milisegundos.fecha_final = this.time_total.getTime();
    this.fechas_milisegundos.fecha_inicio = this.video_obj.fecha.getTime();
    this.color_milestones = '#DBE97B';

    this.fin_video_total = hito_sent.s_final;

    this.pointer_events_barra = 'none';
    this.video_obj.video_dom.currentTime = hito_sent.s_inicio;
  }

  accedeSigHito(event) {

    let ejecucion = '';

    console.log(event);
    switch (this.deviceService.getDeviceInfo().browser) {
      case 'chrome':
        ejecucion = event.path[2].id;
        break;
      case 'safari':
        ejecucion = event.target.lastChild.parentElement.offsetParent.id;
        break;
      case 'firefox':
        ejecucion = event.target.id;
        break;
    }

    let indice_poner = this.carga_hito.indice;

    if (ejecucion === 'derecha_paso') {

      if (Number(indice_poner) !== (this.carga_hito.hitos.length - 1)) { indice_poner++; this.accedeHito(indice_poner);}

    } else {

      if (Number(indice_poner) !== 0) { indice_poner--; this.accedeHito(indice_poner);}

    }
  }

  /*
    Iniciación de todos los parámetros necesarios para la ejecución del video
   */
  ngAfterViewInit() {

    this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;

    const video_conn = document.querySelector('video');
    this.video_obj.video_dom = video_conn;
    this.croping = document.getElementById('cropperter');
    this.croping.style.display = 'none';
  }

  cargaDurVideo() {


    this.setVarVolum();

    this.video_obj.duracion = this.video_obj.video_dom.duration;

    if (this.condicion === 'video_completo') {
      this.accedeVideoCompleto();

    } else {

      this.accedeHito(this.carga_hito.indice);
    }
  }

  visualizaHito(i) {
      this.condAccesoBarraHito = this.condicion === 'video_completo' ? false : true;
      this.accedeHito(i);
  }

  /*

   */
  setMilesStones(hitos: any, duracion_video_total: number, resto_porcentage_video: number, isFullVideo: boolean): any {


    let cumm_chinchetas = 10;

    let cummulative = 0;
    this.milestones = [];
    this.chinchetas_hitos = [];

    for (let i = 0; i < hitos.length; i++) {

      const h1 = ((hitos[i].s_inicio - resto_porcentage_video) * 100) / duracion_video_total;
      const h2 = ((hitos[i].s_final - resto_porcentage_video) * 100) / duracion_video_total;

      if (isFullVideo) {
        this.chinchetas_hitos.push({
          indice: i,
          indice_serie: hitos[i].s_final,
          hito_chincheta: hitos[i],
          nombre_chincheta: hitos[i].nombre_numero_serie,
          seg: ((hitos[i].s_final - this.percentage_time_rep) * 100 ) / duracion_video_total,
          resta: cumm_chinchetas
        });
        cumm_chinchetas += 20;
      } else {

        for (let x = 0; x < hitos[i].hitos_serie.length; x++) {

          this.chinchetas_hitos.push({
            indice: i,
            hito_chincheta: hitos[i],
            indice_serie: hitos[i].hitos_serie[x].s_final,
            nombre_chincheta: hitos[i].hitos_serie[x].nombre_numero_serie,
            seg: ((hitos[i].hitos_serie[x].s_final - this.percentage_time_rep) * 100 ) / duracion_video_total,
            resta: cumm_chinchetas
          });

          cumm_chinchetas += 20;
        }

      }

      const left = h1 - cummulative;
      const width = h2 - h1;
      this.milestones.push({left: left + '%', width: width, nombre: hitos[i]});

      // this.chinchetas_hitos.push({seg: ''});
      cummulative += width;

    }

  }

  /*
      Se encarga de recortar el espacio de tiempo del video que se ha querido
   */
  crop_video() {

    if (this.instante_recorte.instante_inicial !== '') {

      this.contestacion_recorte = null;
      this.estaRecortando = true;

      this.busqueda_elems_service.recorteVideo(this.video_obj.pedido, this.obtenFecha(this.video_obj.fecha), this.instante_recorte).then(recorte_link => this.contestacion_recorte = environment.apiUrl + recorte_link);
    }
  }

  setTiemposRecorte(event) {
    this.instante_recorte.instante_inicial = this.calculo_Tiempo_Relativo((event.from - this.video_obj.fecha.getTime()) / 1000 );
    this.instante_recorte.instante_final = ( event.to - event.from ) / 1000;

  }

  changeTextCrop() {
    this.estaRecortando = false;

  }

  changeIconSpeed(event) {
    this.video_obj.video_dom.playbackRate = event;
    this.indexSpeedVideo = event;
  }

  obtenFecha(fecha: Date): string {
    const mes = (fecha.getMonth() + 1) < 10 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
    const dia = (fecha.getDate()) < 10 ? '0' + fecha.getDate() : fecha.getDate();
    const dateString = fecha.getFullYear() + '_' + mes + '_' + dia;

    return dateString;
  }

  /*
      Se encarga de poner la pantalla completa del video
   */
  fullScreen() {

    if (this.icon_full_screen === 'fullscreen') {
      this.dialogRef.updateSize('100%', '100%');
      this.varAvance = (( this.varAvance * this.barraTiempo.nativeElement.offsetWidth ) / this.distRelBarra ) - 2.5;
      this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;
      this.icon_full_screen = 'fullscreen_exit';
    } else {

      this.dialogRef.updateSize('55%');
      this.varAvance = (( this.varAvance * this.barraTiempo.nativeElement.offsetWidth ) / this.distRelBarra ) - 2.5;
      this.distRelBarra = this.barraTiempo.nativeElement.offsetWidth;

      this.icon_full_screen = 'fullscreen';
    }

  }

  /*
    Ir al marco anterior del video, dependiendo si se quiere hacia delante o hacia detrás.
   */
  goFrameBack(event) {
    let ejecucion = '';
    console.log(event);
    switch (this.deviceService.getDeviceInfo().browser) {
      case 'chrome':
        ejecucion = event.path[0].id;
        break;
      case 'safari':
        ejecucion = event.target.id;
        break;
      case 'firefox':
        ejecucion = event.target.id;
        break;
    }

    if ( !this.video_obj.video_dom.paused ) {
      this.video_obj.video_dom.pause();

    }

    this.id_play_pause = 'play_arrow';
    if (ejecucion === 'delante') {
      if ( !(this.percentage_time_rep !== 0 && Math.floor(this.video_obj.video_dom.currentTime ) >= this.fin_video_total ) ) {
          this.video_obj.video_dom.currentTime += 0.25;
      }
    } else {

      if ( this.video_obj.video_dom.currentTime > (this.hora_inicio_escala_video.getTime() - this.video_obj.fecha.getTime()) / 1000 )  {
        this.video_obj.video_dom.currentTime -= 0.25;
      }
    }
  }

  /*
      Se encarga de mover el puntero que indica el tiempo
   */
  updateProgreso(event) {

    if ( !(this.percentage_time_rep !== 0 && Math.floor(this.video_obj.video_dom.currentTime ) >= this.fin_video_total ) ) {

      let modified = true;

      for (let element_j = 0; element_j < this.visibilidad_texto_video.length; element_j++) {

        if ( Math.floor(this.video_obj.video_dom.currentTime) >= Math.floor(this.visibilidad_texto_video[element_j].s1)
          && Math.floor(this.video_obj.video_dom.currentTime) < Math.floor(this.visibilidad_texto_video[element_j].s2) ) {
          this.indice_contenido = element_j;
          this.muestra_texto_video = 'inherit';
          modified = false;
        }
      }

      if (modified) { this.muestra_texto_video = 'hidden'; }

      const percentage = ((this.video_obj.video_dom.currentTime - this.percentage_time_rep) / this.fragmentoEjecutable) * 100;
      this.varAvance = (( percentage / 100 ) * this.distRelBarra ) - 2.5;
      this.time_progress = this.calculo_Tiempo(this.video_obj.video_dom.currentTime);


    } else {
      this.video_obj.video_dom.pause();
      this.id_play_pause = 'play_arrow';
    }


  }

  /*
      Pasa a string el tiempo en valor absoluto de hh:mm:ss
   */
  calculo_Tiempo(segundos_totales) {

    segundos_totales += (this.video_obj.fecha.getUTCSeconds() +
      + this.video_obj.fecha.getUTCMinutes() * 60 + this.video_obj.fecha.getUTCHours() * 3600);
    segundos_totales = Math.floor(segundos_totales);
    const horas = Math.floor(segundos_totales / 3600);
    const minutos = Math.floor(( segundos_totales - (horas * 3600)) / 60);
    const segundos = segundos_totales - (horas * 3600) - (minutos * 60);
    const horas_s = (horas < 10) ? '0' + horas : horas;
    const min_s = (minutos < 10) ? '0' + minutos : minutos;
    const seg_s = (segundos < 10) ? '0' + segundos : segundos;
    return horas_s + ':' + min_s + ':' + seg_s;
  }

  calculo_Tiempo_Relativo(segundos_totales) {
    const horas = Math.floor(segundos_totales / 3600);
    const minutos = Math.floor(( segundos_totales - (horas * 3600)) / 60);
    const segundos = segundos_totales - (horas * 3600) - (minutos * 60);
    const horas_s = (horas < 10) ? '0' + horas : horas;
    const min_s = (minutos < 10) ? '0' + minutos : minutos;
    const seg_s = (segundos < 10) ? '0' + segundos : segundos;
    return horas_s + ':' + min_s + ':' + seg_s;
  }

  moverPosicion(event) {

    if (this.condAccesoBarraHito) {
      const anchuraBarra = this.barraTiempo.nativeElement.offsetWidth;
      const porcPuntero = (event.offsetX * 100) / anchuraBarra;
      const tiempo = ((porcPuntero / 100) * this.fragmentoEjecutable) + this.percentage_time_rep;

      this.video_obj.video_dom.currentTime = tiempo;
    } else {
      this.condAccesoBarraHito = true;
    }

  }

  // al mover
  gtr3(event) {


    if (this.iscaugth && this.condicion === 'linea_pedido') {

      const anchuraBarra = this.barraTiempo.nativeElement.offsetWidth;
      const porcPuntero = (event.offsetX * 100) / anchuraBarra;
      const tiempo = ((porcPuntero / 100) * this.fragmentoEjecutable) + this.percentage_time_rep;

      this.video_obj.video_dom.currentTime = tiempo;
    }
  }

  /*
      Se encarga de pausar o playear el video
   */
  playPause() {

      if (this.video_obj.video_dom.paused && this.croping.style.display === 'none') {

          if ( !(this.percentage_time_rep !== 0 && Math.floor( this.video_obj.video_dom.currentTime ) >= Math.floor( this.fin_video_total )) ) {
              this.video_obj.video_dom.play();
              this.id_play_pause = 'pause';
          }

      } else {
        this.video_obj.video_dom.pause();
        this.id_play_pause = 'play_arrow';
      }
  }

  /*
      Se encarga de mostrar u ocultar el recortador
   */
  cropper() {

    if (this.croping.style.display === 'none') {

      this.video_obj.video_dom.pause();
      this.sliderElement.update({from: this.video_obj.video_dom.currentTime - 1, to: this.video_obj.video_dom.currentTime + 1});


      this.marginSpacer = -4 + '%';
      this.croping.style.display = 'block';
      this.displayScreenShotButton = true;
    } else {
      this.marginSpacer = 0 + '%';
      this.croping.style.display = 'none';
      this.displayScreenShotButton = false;
    }
  }

  /*
      Se encarga de subir o bajar el volumen
   */
  changeVolume(event) {
    this.video_obj.video_dom.volume = event.value / 100;
    this.setVolumen(event.value);
  }

  setVarVolum() {
    this.valueVolumRight = this.video_obj.video_dom.volume * 100;
    this.setVolumen(this.valueVolumRight);
  }

  setVolumen(value_volum) {

        if (value_volum === 0) {
          this.id_volume = 'volume_off';
        } else {
          if (value_volum <= 33 && 0 < value_volum ) {
            this.id_volume = 'volume_mute';
          } else {
            if ( value_volum <= 66 && 33 < value_volum ) {
              this.id_volume = 'volume_down';
            } else {
              this.id_volume = 'volume_up';
            }
          }
        }
  }

  /*
      Se encarga de tomar una foto al video (screenshot)
   */
  snap(): void {

    this.video_obj.video_dom.pause();
    const dialogRef = this.dialogSnap.open(DialogSnapComponent, {
      data: {
        _fecha: this.obtenFecha( this.video_obj.fecha),
        _pedido: this.video_obj.pedido,
        _sec: this.calculo_Tiempo_Relativo( Number(this.video_obj.video_dom.currentTime) )
      }
    });
  }


  close() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
