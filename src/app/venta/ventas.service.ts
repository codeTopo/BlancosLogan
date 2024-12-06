import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VentaRequest, VentaResponse } from './VentaRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

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
  }

  addVenta(venta: VentaRequest): Observable<VentaResponse> {
    return this.http.post<VentaResponse>(`/prepago/agregar`, venta, this.getHttpOptions());
  }
}
