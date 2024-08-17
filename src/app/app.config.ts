import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import{provideAnimations} from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors, } from '@angular/common/http';
import { generalInterceptor } from './general.interceptor';


export const appConfig: ApplicationConfig = {
  providers:
  [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([generalInterceptor]), withFetch()),
  ]
};
