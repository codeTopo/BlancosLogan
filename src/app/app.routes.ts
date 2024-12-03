import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'/home',
    pathMatch:"full"
  },
  {
    path:'home',
    loadComponent:()=> import('./Navegation/home.component'),

  },
  {
    path:'productos',
    loadComponent:()=> import('./productos/productos.component'),
    canActivate:[authGuard]
  },
  {
    path:'venta',
    loadComponent:()=> import('./venta/venta.component'),
    canActivate:[authGuard]
  },
  {
    path:'retorno',
    loadComponent:()=> import('./retorno/retorno.component')
  }
];
