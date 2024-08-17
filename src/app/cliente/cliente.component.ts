import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteRequest } from './ClienteRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Direccion } from './Direccion';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CpResponse } from './CodigoPostal';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    SplitterModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    DialogModule,
    FloatLabelModule,
    ProgressSpinnerModule,
    DropdownModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [MessageService]
})
export default class ClienteComponent implements OnInit {

  // Propiedades para cliente y dirección
  cliente: ClienteRequest | null = null;
  nuevoCliente: ClienteRequest = {
    idCliente: 0,
    nombre: '',
    apellidos: '',
    telefono: ''
  };
  direc: Direccion | null = null;
  nuevaDireccion: Direccion = {
    idDireccion: 0,
    calle: '',
    colonia: '',
    municipio: '',
    numero: '',
    estado: '',
    cp: '',
    telefono: ''
  };
  // Para el código postal
  cpInfo: CpResponse | null = null;
  coloniasDisponibles: string[] = [];
  coloniaSeleccionada: string = '';

  // Herramientas para el html
  visible: boolean = false;
  loading: boolean = false;
  clienteExistente: boolean = false;
  direccionExistente: boolean = false;
  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
  showDialog() {
    this.visible = true;
  };
  isFormValid(): boolean {
    const cliente = this.nuevoCliente;
    const direccion = this.nuevaDireccion;
    // Verificar que los campos no estén vacíos (''), null o undefined.
    const isClienteValid = !!(cliente.nombre && cliente.apellidos && cliente.telefono);
    const isDireccionValid = !!(direccion.calle && direccion.numero && direccion.colonia && direccion.cp && direccion.estado && direccion.telefono);
    return isClienteValid && isDireccionValid;
  }



  telefonoError = false;
  nombreDisabled = true;
  apellidosDisabled = true;

  get telefono(): string {
    return this.nuevoCliente.telefono;
  }
  set telefono(value: string) {
    this.nuevoCliente.telefono = value;
    this.nuevaDireccion.telefono = value;
  }
  validateTelefono() {
    const telefonoLength = this.telefono.length || 0;
    this.telefonoError = telefonoLength !== 10;

    if (telefonoLength === 10) {
      this.checkTelefono();
    }
  }
  checkTelefono() {
    this.clienteService.getCliente(this.telefono).subscribe({
      next: (res) => {
        this.loading = true;
        if (res.exito === 1) {
          this.loading = false;
          this.showMessage('error', 'Número Registrado', 'Este número ya fue registrado, si crees que es un error favor de comunicarte al 3951185963.');
          this.visible = false; // Cerrar el diálogo

        } else if (res.exito === 0) {
          this.nombreDisabled = false;
          this.apellidosDisabled = false;
          this.loading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.showMessage('error', 'Error', 'Hubo un problema al verificar el número de teléfono.');
      }
    });
  }


  constructor(
    private clienteService: ClienteService,
    private messages: MessageService,
  ) { }

  ngOnInit(): void { }

  // Herramientas de las solicitudes
  get isTelefonoValid(): boolean {
    return this.telefono.length === 10 && /^[0-9]+$/.test(this.telefono);
  }
  private showMessage(severity: string, summary: string, detail: string): void {
    this.messages.clear();
    this.messages.add({ severity, summary, detail });
  }

  // HTTP de Cliente
  getCliente(): void {
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.getCliente(this.telefono).subscribe({
        next: (res) => {
          console.log(res.data);
          if (res.exito === 1) {
            this.cliente = res.data;
            localStorage.setItem('idCliente', res.data.idCliente.toString());
            this.showMessage('success', 'Datos', res.mensaje);
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
        }
      });
    } else {
      this.showMessage('error', 'Error', 'El número de teléfono debe tener 10 caracteres');
    }
  }
  agregarCliente(cliente: ClienteRequest): void {
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.posCliente(cliente).subscribe({
        next: (res) => {
          if (res.exito === 1) {
            this.cliente = res.data;
            this.showMessage('success', 'Cliente agregado', res.mensaje);
          } else {
            this.showMessage('error', 'Error', res.mensaje);
          }
          this.loading = false;
        },
        error: (error: string) => {
          this.loading = false;
          this.showMessage('error', 'Error', error);
        }
      });
    }
  }
  // HTTP de Direccion
  getDireccion(): void {
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.getDireccion(this.telefono).subscribe({
        next: (res) => {
          console.log(res.data);
          if (res.exito === 1) {
            if (res.data.length > 0) {
              this.direc = res.data[0]; // Asignar el primer elemento de la matriz
              this.showMessage('success', 'Datos', res.mensaje);
              localStorage.setItem('idDireccion', res.data[0].idDireccion.toString());
            } else {
              this.showMessage('info', 'Sin resultados', 'No se encontraron direcciones para el teléfono proporcionado.');
            }
          }
          this.loading = false;
        },
        error: (error: string) => {
          this.showMessage('error', 'Error', error);
        }
      });
    } else {
      this.showMessage('error', 'Error', 'El número de teléfono debe tener 10 caracteres numéricos');
    }
  }
  addDireccion(direccion: Direccion): void {
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.postDireccion(direccion).subscribe({
        next: (res) => {
          if (res.exito === 1) {
            this.showMessage('success', 'Direccion Agregada', res.mensaje);
          } else {
            this.showMessage('error', 'Error', res.mensaje);
          }
          this.loading = false;
        },
        error: (error: string) => {
          this.loading = false;
          this.showMessage('error', 'Error', error);
        }
      });
    }
  }
  //Http Codigo Postal
  onCpChange(): void {
    if (/^\d{5}$/.test(this.nuevaDireccion.cp)) {
      this.loading = true;
      this.clienteService.getCP(this.nuevaDireccion.cp).subscribe({
        next: (res) => {
          console.log(res.codigo_postal)
          if (!res.error) {
            this.cpInfo = res;
            this.nuevaDireccion.estado = res.codigo_postal.estado;
            this.nuevaDireccion.municipio = res.codigo_postal.municipio;
            this.coloniasDisponibles = res.codigo_postal.colonias;  // Guardar colonias en la lista
            this.coloniaSeleccionada = '';  // Reiniciar selección
            this.showMessage('success', 'Información del Código Postal', 'Datos obtenidos correctamente.');
          } else {
            this.showMessage('error', 'Error', 'No se pudo obtener información para el código postal proporcionado.');
            this.cpInfo = null;  // Limpiar la información si hay un error
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.showMessage('error', 'Error', 'Hubo un problema al obtener la información del código postal.');
        }
      });
    } else {
      this.showMessage('error', 'Error', 'El código postal debe tener 5 caracteres numéricos');
      this.cpInfo = null;  // Limpiar la información si el código postal no es válido
    }
  }
}
