"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Video = (function () {
    function Video(id_video, fecha_video, carretilla_video, cliente_video, pedido_video, linea_pedido_video, duracion_video) {
        this.id_video = id_video;
        this.fecha_video = fecha_video;
        this.carretilla_video = carretilla_video;
        this.cliente_video = cliente_video;
        this.pedido_video = pedido_video;
        this.linea_pedido_video = linea_pedido_video;
        this.duracion_video = duracion_video;
        this.fecha = fecha_video;
        this.id = id_video;
        this.carretilla = carretilla_video;
        this.cliente = cliente_video;
        this.pedido = pedido_video;
        this.linea_pedido = linea_pedido_video;
        this.duracion = duracion_video;
    }
    return Video;
}());
exports.Video = Video;
