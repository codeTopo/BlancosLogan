import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from './auth.service';
import { AuthRequest, LoginRequest, Respuestas } from './AuthRequest';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import ClienteComponent from '../cliente/cliente.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
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
    ReactiveFormsModule,
    DialogModule,
    ToastModule,
    ProgressBarModule,
    ClienteComponent,
    ScrollPanelModule,
    AvatarModule,
    InputTextModule,
    MessageModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[MessageService]
})
export default class HomeComponent implements OnInit {


  constructor(
    private authService: AuthService,
    private router: Router,
    private messages: MessageService,
  ) {}

  ngOnInit(): void {
  };

  onSubmit() {

  };

  // para navegar a los diferentes componentes
  goToProductos() {
    this.router.navigate(['/productos']);
  }
  //para cerrar sesion
  clearToken(): void {
    localStorage.clear()
    this.messages.add({ severity: 'info', summary: 'Sesión Cerrada', detail: 'Se cerró la sesión correctamente' });
  }
  //Elementos para los inputs
  Email: string | undefined;
  Password: string | undefined;
  passwordVisible: boolean = false;
  Confirmpassword:string | undefined;
  formValid: boolean = false;
  clearInputs() {
    this.Email = '';
    this.Password = '';
  };
  //herramientas del dialog y animacion
  visible: boolean = false;
  visibleAdd:boolean = false;
  barra:boolean= false;
  loading: boolean = false;
  visibleTer:boolean = false;
  showDialog() {
    this.visible = true;
  };
  dialogTerm(){
    this.visibleTer=true;
  };
  get loginDisabled(): boolean{

    const token = localStorage.getItem('Token')
    return token == null ;
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  };
  toggleNewUser(){
    this.visible=false;
    this.visibleAdd=true;
  };
  passwordHasMinLength(): boolean {
    return !!this.Password && this.Password.length >= 8;
  };
  passwordHasUppercase(): boolean {
    return !!this.Password && /[A-Z]/.test(this.Password);
  };
  passwordHasNumber(): boolean {
    return !!this.Password && /\d/.test(this.Password);
  };
  passwordHasSpecialChar(): boolean {
    return !!this.Password && /[@$!%*?&]/.test(this.Password);
  };
  passwordsMatching(): boolean {
    const passwordsMatch = this.Password === this.Confirmpassword && !!this.Password && !!this.Confirmpassword;
    const isPasswordValid = this.passwordHasMinLength() && this.passwordHasUppercase() && this.passwordHasNumber() && this.passwordHasSpecialChar();
    const emailFilled = !!this.Email;
    this.formValid = passwordsMatch && emailFilled && isPasswordValid;
    return passwordsMatch && isPasswordValid;
  };

  //solicitudes http
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
          localStorage.setItem('Email', this.Email!);
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
  Autentificar(){
    this.loading=true;
    const login : LoginRequest ={
      email:this.Email!,
      password:this.Password!,
      confirmpassword:this.Confirmpassword!
    };
    this.authService.login(login).subscribe({
      next:(res: Respuestas)=>{
        if(res.exito === 1){
          this.loginWithCredentials(this.Email!, this.Password!);

          this.messages.add({ severity: 'success', summary: 'Exito', detail: res.mensaje });
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: error.message });
      },
    })
  };
  loginWithCredentials(email: string, password: string) {
    const authRequest: AuthRequest = {
      email: email,
      password: password
    };
    this.authService.auth(authRequest).subscribe({
      next: (res: Respuestas) => {
        if (res.exito === 1) {
          this.messages.add({ severity: 'success', summary: 'Inicio de Sesión Exitosa', detail: res.mensaje });
          const token = res.data['token'];
          localStorage.setItem('Token', token);
          localStorage.setItem('Email', this.Email!);
          this.visibleAdd=false;
          this.clearInputs();
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.messages.add({ severity: 'error', summary: 'Error', detail: error.message });
      }
    });
  };

  //para el boton y mandar a whatsapp
  openWhatsApp() {
    const phoneNumber = '3951185963'; // Reemplaza con el número de teléfono deseado
    const message = 'Hola, tengo una consulta'; // El mensaje que deseas enviar
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

}
