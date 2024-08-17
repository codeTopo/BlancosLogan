import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Producto } from '../productos/ProductoRequest';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { VentasService } from './ventas.service';
import { VentaRequest, VentaResponse } from './VentaRequest';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';


@Component({
  selector: 'app-venta',
  standalone: true,
  imports:
  [
    CommonModule,
    RouterModule,
    ButtonModule,
    TableModule,
    ToastModule,
    DialogModule,
    DividerModule,
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss',
  providers: [MessageService]
})
export default class VentaComponent implements OnInit {
  concepto: Producto[] = [];
  loading: boolean = false;
  ventaDisabled= true;
  ventaId: number | null = null;
  displayDialog: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router:Router,
    private ventasService: VentasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.ProductLocalStorage();
    this.updateVentaDisabled();
  }
  goHome() {
    this.router.navigate(['/home']);
  };
  goProduc(){
    this.router.navigate(['/productos'])
  }
  ProductLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedProducts = localStorage.getItem('concepto');
      if (storedProducts) {
        this.concepto = JSON.parse(storedProducts);
      }
    }
  };
  private updateVentaDisabled(): void {
    this.ventaDisabled = this.totalAmount < 1500;
  }
  get totalAmount(): number {
    return this.concepto.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
  };

  openWhatsApp() {
    const phoneNumber = '3951185963'; // Reemplaza con el número de teléfono deseado
    const idCliente = localStorage.getItem('idCliente') || 'Cliente'; // Recupera el ID del cliente o un valor predeterminado
    const ventaId = this.ventaId ? this.ventaId.toString() : 'No disponible'; // Asegúrate de que el número de venta esté disponible
    const message = `Hola! Soy ${idCliente}, mi número de venta es ${ventaId}.`; // Mensaje personalizado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
  }



  eliminarProducto(id: number): void {
    this.concepto = this.concepto.filter(product => product.idProducto !== id);
    localStorage.setItem('concepto', JSON.stringify(this.concepto));
    this.messageService.add({
      severity: 'success',
      summary: 'Producto Eliminado',
      detail: 'El producto ha sido eliminado con éxito.'
    });
    this.updateVentaDisabled();
  };

  agregarVenta(): void {
    const idCliente = Number(localStorage.getItem('idCliente'));
    const idDireccion = Number(localStorage.getItem('idDireccion'));
    // Verificar si los valores se recuperaron correctamente
    if (isNaN(idCliente) || isNaN(idDireccion)) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Datos de cliente o dirección no disponibles.' });
      this.router.navigate(['/home']);
      return;
    }
    const ventaRequest: VentaRequest = {
      idCliente: idCliente,
    idDireccion: idDireccion,
      pedido: this.concepto.map(producto => ({
        idConcepto: 0, // Asigna un valor por defecto si no lo tienes disponible
        idProducto: producto.idProducto,
        cantidad: producto.cantidad
      }))
    };
    this.loading = true;
    this.ventasService.addVenta(ventaRequest).subscribe({
      next: (response: VentaResponse) => {
        if (response.exito === 1) {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.mensaje });
          this.concepto = []; // Limpiar el carrito
          localStorage.removeItem('concepto');
          this.updateVentaDisabled();
          this.ventaId = response.data.venta.idVenta; this.displayDialog = true;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.mensaje });
        }
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al procesar la venta.' });
        this.loading = false;
      }
    });
  }

}
