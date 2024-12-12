import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductosService } from './productos.service';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Producto } from './ProductoRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Subscription } from 'rxjs';
import { InputNumberModule } from 'primeng/inputnumber';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports:
  [
    CommonModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    RouterModule,
    VirtualScrollerModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ScrollingModule,
    ReactiveFormsModule,
    DialogModule,
    InputNumberModule,
    FormsModule,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss',
  providers: [MessageService]
})
export default class ProductosComponent  implements OnInit , OnDestroy {

  environment = environment;
  title = 'Productos'
  products: Producto[] = [];
  filteredProducts: Producto[] = [];
  loading: boolean = false;
  error: boolean = false;
  searchControl: FormControl = new FormControl('');
  displayDialog: boolean = false;
  selectedProduct?: Producto;
  counter: number = 1;
  selectedProducts: Producto[] = [];
  bagCount: number = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router:Router,
    private productosService:ProductosService,
    private messages: MessageService,
    private primengConfig: PrimeNGConfig
  ){}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.fetchProductos();
    this.loadProductStorage();
    this.subscriptions.add(
      this.searchControl.valueChanges.subscribe((value) => {
        this.filterProducts(value);
      })
    );
  };
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Limpia las suscripciones
  }
  //clases para navegacion
  goHome() {
    this.router.navigate(['/home']);
  };
  goVenta(){
    this.router.navigate(['/venta'])
  };
  //filtrar por nombre
  filterProducts(searchTerm: string) {
    if (!searchTerm) {
      this.filteredProducts = this.products; // Si no hay término de búsqueda, mostrar todos los productos
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
  //solicitud http
  fetchProductos() {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: (res) => {
        if (res.exito === 1) {
          console.log(res.data)
          this.products = res.data;
          this.filteredProducts = this.products;
          this.messages.add({ severity: 'success', summary: 'Productos Cargados', detail: res.mensaje });
        } else {
          this.messages.add({ severity: 'error', summary: 'Error', detail: res.mensaje });
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
      }
    });
  }
  //seleccionador de producto
  showDialog(product: Producto) {
    this.selectedProduct = product;
    this.displayDialog = true;
  }
  //herramientas para el contador y total
  increment() {
    this.counter++;
  }
  decrement() {
    if (this.counter > 1) {
      this.counter--;
    }
  }
  calculateTotal(): number {
    if (this.selectedProduct) {
      return this.selectedProduct.precio * this.counter;
    }
    return 0;
  }
  //agregar producto al carrito
  addToCart() {
    if (this.selectedProduct) {
      this.selectedProducts.push({ ...this.selectedProduct, cantidad: this.counter });
      this.displayDialog = false;
      this.messages.add({ severity: 'success', summary: 'Producto Agregado con Exito' });
      this.ProductsToLocalStorage();
      this.updateBagCount();
    }
  }
  //lista del local storage y el conteo en el carrito
  ProductsToLocalStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('concepto', JSON.stringify(this.selectedProducts));
    }
  }
  loadProductStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProducts = localStorage.getItem('concepto');
      if (storedProducts) {
        this.selectedProducts = JSON.parse(storedProducts);
        this.updateBagCount();
      }
    }
  }
  updateBagCount() {
    this.bagCount = this.selectedProducts.reduce((count, product) => count + (product.cantidad || 1), 0);
  }
}
