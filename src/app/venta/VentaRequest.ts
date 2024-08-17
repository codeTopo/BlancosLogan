export interface VentaRequest{
  idCliente:number,
  idDireccion:number;
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
    venta: {
      idVenta: number;
      idCliente: number;
      idDireccion: number;
      total: number;
    };
  };
}
