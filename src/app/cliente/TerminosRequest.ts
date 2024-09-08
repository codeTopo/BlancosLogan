export interface Terminos{
  idCliente : number,
  ArchivoVersion: string,
}

export interface TerminosResponse{
  exito:   number;
  mensaje: string;
  data:    Terminos;
}
