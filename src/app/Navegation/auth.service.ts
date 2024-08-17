import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable} from 'rxjs';
import { AuthRequest, Respuestas } from './AuthRequest';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:100/api/users/validar';

  constructor(private http: HttpClient) { }

  auth(auth: AuthRequest): Observable<Respuestas> {
    return this.http.post<Respuestas>(this.url, auth, httpOptions);
  }
}
