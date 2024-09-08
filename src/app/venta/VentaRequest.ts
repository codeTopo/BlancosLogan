export interface VentaRequest{
  idCliente:number,
  idDireccion:number;
  email:string;
  pedido: Concepto[];
}

export interface Concepto {
  idConcepto: number; // Este campo es requerido
  idProducto: number;
  cantidad: number;
}


export interface VentaResponse {
  exito: number;
  mensaje: string;
  data: {
    idPrePago: string;
    urlPago: string;
  };
}
