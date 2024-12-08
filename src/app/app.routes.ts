import { Routes } from '@angular/router';


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
  },
  {
    path:'venta',
    loadComponent:()=> import('./venta/venta.component'),
  },
  {
    path:'retorno',
    loadComponent:()=> import('./retorno/retorno.component')
  }
];
