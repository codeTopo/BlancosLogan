export interface AuthRequest{
  email:string;
  password:string;
};

export interface Respuestas{
  exito:number;
  mensaje:string;
  data: any;
};

export interface LoginRequest{
  email:string;
  password:string;
  confirmpassword:string;
}

export interface ResCarr{
  exito:number;
  mensaje:string;
  data: Carrusel[];
};

export interface Carrusel{
  imagen:string
}
