import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CpResponse } from './CodigoPostal';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CodipoPostalService {

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

  constructor(private http: HttpClient) { }

  getCP(cp: string): Observable<CpResponse> {
    if (!/^\d{5}$/.test(cp)) {
      throw new Error('El código postal tiene que tener 5 caracteres numéricos');
    }
    // URL directa hacia el servicio
    const apiUrl = `https://api.tau.com.mx/dipomex/v1/codigo_postal?cp=${cp}`;
    return this.http.get<CpResponse>(apiUrl, {
      headers: {
        'APIKEY': environment.apiKeyCp
      }
    });
  }
}
