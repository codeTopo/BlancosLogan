import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CpResponse } from './CodigoPostal';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CodipoPostalService {

  constructor(private http: HttpClient) { }

  getCP(cp: string): Observable<CpResponse> {
    if (!/^\d{5}$/.test(cp)) {
      throw new Error('El código postal tiene que tener 5 caracteres numéricos');
    }
    const apiUrl = `/api?cp=${cp}`;
    return this.http.get<CpResponse>(apiUrl, {
      headers: {
        'APIKEY': environment.apiKeyCp
      }
    });
  }
}
