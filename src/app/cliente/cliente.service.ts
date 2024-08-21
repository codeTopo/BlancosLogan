import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteRequest, Respons } from './ClienteRequest';
import { Direccion, DireccionResponse } from './Direccion';
import { CpResponse } from './CodigoPostal';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url = 'http://localhost:100/api';


  constructor(private http: HttpClient) { }

  private getHttpOptions() {
    let token = '';
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      token = localStorage.getItem('Token') || '';
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`

      })
    };
  };

  //clientes
  getCliente(telefono: string): Observable<Respons> {
    if (!/^\d{10}$/.test(telefono)) {
      throw new Error('El número de teléfono debe tener 10 caracteres numéricos');
    }
    const url = `${this.url}/clientes/${telefono}`;
    return this.http.get<Respons>(url, this.getHttpOptions());
  };
  posCliente(cliente:ClienteRequest):Observable<Respons>{
    const url = `${this.url}/clientes/agregar`;
    return this.http.post<Respons>(url, cliente, this.getHttpOptions());
  };
  //direccion
  getDireccion(telefono: string): Observable<DireccionResponse> {
    if (!/^\d{10}$/.test(telefono)) {
      throw new Error('El número de teléfono debe tener 10 caracteres numéricos');
    }
    const url = `${this.url}/direccion/${telefono}`;
    return this.http.get<DireccionResponse>(url, this.getHttpOptions());
  };
  postDireccion(direccion:Direccion):Observable<DireccionResponse>{
    const url= `${this.url}/direccion/agregar `;
    return this.http.post<DireccionResponse>(url, direccion, this.getHttpOptions());
  };
  putDireccion(direccion:Direccion):Observable<DireccionResponse>{
    const id = localStorage.getItem('idDireccion');
    if (!id) {
      return new Observable<DireccionResponse>(observer => {
        observer.error('No se encontró el ID de la dirección en el almacenamiento local');
      });
    }
    const url= `${this.url}/direccion/${id}`;
    return this.http.put<DireccionResponse>(url, direccion, this.getHttpOptions())
  };
  //codigo post
  getCP(cp: string): Observable<CpResponse> {
    // Validación para asegurar que el código postal tiene 5 dígitos
    if (!/^\d{5}$/.test(cp)) {
      throw new Error('El código postal tiene que tener 5 caracteres numéricos');
    }
    // URL fija según la documentación
    const url = `api?cp=${cp}`;
    // Hacer la solicitud GET, enviando el código postal como parámetro
    return this.http.get<CpResponse>(url, {
      headers: {
        'APIKEY': '7b65f2b63c31d8f06709349c1f9d2092af6cfe48'  // Reemplaza con tu API key
      }
    });
  };

}
