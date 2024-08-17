export interface DireccionResponse {
  exito: number;
  mensaje: string;
  data: Direccion[];
}

export interface Direccion {
  idDireccion: number;
  calle: string;
  colonia: string;
  municipio: string;
  numero: string;
  estado: string;
  cp: string;
  telefono: string;
}
