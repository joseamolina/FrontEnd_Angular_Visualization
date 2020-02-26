export class Video {

  constructor(private id_video: string, private fecha_video: Date, private carretilla_video: string,
              private cliente_video: string, private pedido_video: string, private linea_pedido_video: any, private duracion_video: any) {
    this.fecha = fecha_video;
    this.id = id_video;
    this.carretilla = carretilla_video;
    this.cliente = cliente_video;
    this.pedido = pedido_video;
    this.linea_pedido = linea_pedido_video;
    this.duracion = duracion_video;
  }

  id: string;
  fecha: Date;
  carretilla: string;
  cliente: string;
  pedido: string;
  linea_pedido: string;
  public video_dom: any;
  duracion: number;

}
