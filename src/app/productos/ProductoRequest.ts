export interface ProdRes {
  exito:   number;
  mensaje: string;
  data:    Producto[];
}

export interface Producto {
  idProducto:  number;
  nombre:      string;
  descripcion: string;
  precio:      number;
  ubicacion:   null | string;
  cantidad:    number;
}
