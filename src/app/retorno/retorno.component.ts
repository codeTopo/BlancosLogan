import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-retorno',
  standalone: true,
  imports:
  [
    CardModule,
    ButtonModule,
    DividerModule,
  ],
  templateUrl: './retorno.component.html',
  styleUrl: './retorno.component.scss'
})
export default class RetornoComponent {

  message: string = '';
  ventaId: string | null = null;
  collectionId: string | undefined;
  paymentId: string | undefined;



  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Lee el parámetro 'status' de la URL
    this.route.queryParams.subscribe(params => {
      const status = params['status'];
      console.log(params);
      this.collectionId = params['collection_id'];
      this.paymentId = params['payment_id'];

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

  clearCart() {
    localStorage.removeItem('concepto');
  }

  botLogan(){
    const storedVentaId = localStorage.getItem('ventaId');
    localStorage.removeItem('concepto');
    this.router.navigate(['/home']);
    this.clearCart();
    if (storedVentaId) {
      this.ventaId = storedVentaId;
    } else {
      this.ventaId = 'No hay ID de venta disponible';
    }
    const phoneNumber = environment.telefonoBot;
    const message = `mi folio es ${storedVentaId}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
