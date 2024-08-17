import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from './auth.service';
import { AuthRequest, Respuestas } from './AuthRequest';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import ClienteComponent from '../cliente/cliente.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ToolbarModule,
    ButtonModule,
    RouterModule,
    FloatLabelModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ProgressBarModule,
    ClienteComponent,
    ScrollPanelModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[MessageService]
})
export default class HomeComponent implements OnInit {

  ngOnInit() { }

  constructor(private authService: AuthService, private router: Router,private messages: MessageService) {}

  // para navegar a los diferentes componentes
  goToProductos() {
    this.router.navigate(['/productos']);
  }

  //para cerrar sesion
  clearToken(): void {
    localStorage.clear
    this.messages.add({ severity: 'info', summary: 'Sesión Cerrada', detail: 'Se cerró la sesión correctamente' });
  }
  //Elementos para los inputs
  Email: string | undefined;
  Password: string | undefined;
  clearInputs() {
    this.Email = '';
    this.Password = '';
  }

  //herramientas del dialog y animacion
  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }
  barra:boolean= false;
  loading: boolean = false;

  login() {
    this.loading = true;
    const authRequest: AuthRequest = {
      email: this.Email!,
      password: this.Password!
    };
    this.authService.auth(authRequest).subscribe({
      next: (res: Respuestas) => {
        if (res.exito === 1) {
          this.messages.add({ severity: 'success', summary: 'Inicio de Sesion Exitosa', detail: res.mensaje });
          const token = res.data['token'];
          localStorage.setItem('Token', token);
          this.visible = false;
          this.clearInputs();
          console.log('Login successful:', res);
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    });
  };

  openWhatsApp() {
    const phoneNumber = '3951185963'; // Reemplaza con el número de teléfono deseado
    const message = 'Hola, tengo una consulta'; // El mensaje que deseas enviar
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

}
