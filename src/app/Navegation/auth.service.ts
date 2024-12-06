import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { AuthRequest, LoginRequest, ResCarr, Respuestas } from './AuthRequest';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  auth(auth: AuthRequest): Observable<Respuestas> {

    return this.http.post<Respuestas>('/users/validar', auth, httpOptions);
  };
  login(login: LoginRequest):Observable<Respuestas>{
    return this.http.post<Respuestas>('/users/agregar', login, httpOptions);
  };
  carrusel(): Observable<ResCarr>{
    return this.http.get<ResCarr>('/carrusel', this.getHttpOptions())
  }
  isLoggedIn(): boolean {
    // Verifica si existe el token en el localStorage
    return !!localStorage.getItem('Token');
  }
}
