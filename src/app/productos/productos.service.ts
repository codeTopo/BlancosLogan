import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdRes } from './ProductoRequest';



@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private url = 'http://localhost:100/api/productos';

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

  getProductos(): Observable<ProdRes> {
    return this.http.get<ProdRes>(this.url, this.getHttpOptions());
  }
}
