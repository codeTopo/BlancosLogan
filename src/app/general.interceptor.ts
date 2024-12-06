import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';


export const generalInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedUrl = req.url;

  // Verificar si la URL ya comienza con 'http' o '/api'
  if (!req.url.startsWith('http') && !req.url.startsWith('/api')) {
    modifiedUrl = `${environment.apiUrl}${req.url}`; // Concatenar la URL base solo si es necesario
  }

  const modifiedReq = req.clone({
    url: modifiedUrl
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorResponse = {
        exito: 0,
        mensaje: '',
        data: null
      };

      if (error.error instanceof ErrorEvent) {
        errorResponse.mensaje = `Error del cliente: ${error.error.message}`;
      } else {
        errorResponse.mensaje = error.error?.mensaje || `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
        errorResponse.data = error.error;
      }

      console.error('Interceptor error:', errorResponse);
      return throwError(() => errorResponse);
    })
  );
};
