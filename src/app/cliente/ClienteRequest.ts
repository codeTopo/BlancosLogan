export interface Respons {
  exito:   number;
  mensaje: string;
  data:    ClienteRequest;
}

export interface ClienteRequest {
  idCliente: number;
  nombre:    string;
  apellidos: string;
  telefono:  string;
}

