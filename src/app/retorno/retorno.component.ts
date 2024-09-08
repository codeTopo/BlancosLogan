import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-retorno',
  standalone: true,
  imports:
  [
    CardModule,
    ButtonModule,
  ],
  templateUrl: './retorno.component.html',
  styleUrl: './retorno.component.scss'
})
export default class RetornoComponent {

  message: string = '';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Lee el parámetro 'status' de la URL
    this.route.queryParams.subscribe(params => {
      const status = params['status'];

      switch (status) {
        case 'success':
          this.message = '¡La transacción fue exitosa!';
          this.clearCart();
          break;
        case 'failure':
          this.message = 'Hubo un problema con la transacción.';
          break;
        case 'pending':
          this.message = 'La transacción está pendiente.';
          break;
        default:
          this.message = 'Estado desconocido.';
          break;
      }
    });
  };

  goHome() {
    this.router.navigate(['/home']);
  };

  clearCart() {
    // Limpiar el carrito y eliminar el concepto del local storage
    localStorage.removeItem('concepto');
    console.log('Carrito limpiado y concepto eliminado del local storage.');
  }
}
