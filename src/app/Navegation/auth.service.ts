import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable} from 'rxjs';
import { AuthRequest, LoginRequest, Respuestas } from './AuthRequest';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:100/api/users';

  constructor(private http: HttpClient) { }

  auth(auth: AuthRequest): Observable<Respuestas> {
    const url =`${this.url}/validar`
    return this.http.post<Respuestas>(url, auth, httpOptions);
  };

  login(login: LoginRequest):Observable<Respuestas>{
    const url =`${this.url}/agregar`;
    return this.http.post<Respuestas>(url, login, httpOptions);
  };
}
