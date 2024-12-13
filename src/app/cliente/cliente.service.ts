import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteRequest, Respons } from './ClienteRequest';
import { Direccion, DireccionResponse } from './Direccion';
import { CpResponse } from './CodigoPostal';
import { Terminos, TerminosResponse } from './TerminosRequest';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

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
    const url = `/clientes/${telefono}`;
    return this.http.get<Respons>(url, this.getHttpOptions());
  };
  posCliente(cliente:ClienteRequest):Observable<Respons>{
    return this.http.post<Respons>('/clientes/agregar', cliente, this.getHttpOptions());
  };
  //direccion
  getDireccion(telefono: string): Observable<DireccionResponse> {
    if (!/^\d{10}$/.test(telefono)) {
      throw new Error('El número de teléfono debe tener 10 caracteres numéricos');
    }
    return this.http.get<DireccionResponse>(`/direccion/${telefono}`, this.getHttpOptions());
  };
  postDireccion(direccion:Direccion):Observable<DireccionResponse>{
    return this.http.post<DireccionResponse>('/direccion/agregar', direccion, this.getHttpOptions());
  };
  putDireccion(direccion:Direccion):Observable<DireccionResponse>{
    const id = localStorage.getItem('idDireccion');
    if (!id) {
      return new Observable<DireccionResponse>(observer => {
        observer.error('No se encontró el ID de la dirección en el almacenamiento local');
      });
    }
    return this.http.put<DireccionResponse>( `/direccion/${id}`, direccion, this.getHttpOptions())
  };
  //codigo post
  getCP(cp: string): Observable<CpResponse> {
    if (!/^\d{5}$/.test(cp)) {
      throw new Error('El código postal tiene que tener 5 caracteres numéricos');
    }
    return this.http.get<CpResponse>(`/api?cp=${cp}`, {
      headers: {
        'APIKEY': environment.apiKeyCp
      }
    });
  };
  //terminos
  postTerm(terminos:Terminos):Observable<TerminosResponse>{
    return this.http.post<TerminosResponse>('/terminos/agregar',terminos, this.getHttpOptions())
  };

}
