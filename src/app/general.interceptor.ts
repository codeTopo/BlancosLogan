import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const generalInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorResponse = {
        exito: 0,
        mensaje: '',
        data: null
      };

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorResponse.mensaje = `Error del cliente: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        errorResponse.mensaje = error.error?.mensaje || `Error del servidor: ${error.status}\nMensaje: ${error.message}`;
        errorResponse.data = error.error; // Este contiene el objeto Respuestas enviado por el servidor
      }
      console.error('Interceptor error:', errorResponse); // Log para verificar errores
      return throwError(() => errorResponse);
    })
  );
};
