import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteRequest } from './ClienteRequest';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Direccion, DireccionResponse } from './Direccion';
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
import { CheckboxModule } from 'primeng/checkbox';
import { Terminos } from './TerminosRequest';

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
    CheckboxModule,
  ],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
  providers: [MessageService]
})
export default class ClienteComponent implements OnInit {

  // Propiedades para cliente y dirección en get
  telefono: string = '';
  cliente: ClienteRequest | null = null;
  direc: Direccion | null = null;
  //modelos para post
  nuevoCliente: ClienteRequest = {
    idCliente: 0,
    nombre: '',
    apellidos: '',
    telefono: ''
  };
  nuevaDireccion: Direccion = {
    idDireccion: 0 ,
    calle: '',
    colonia: '',
    municipio: '',
    numero: '',
    estado: '',
    cp: '',
    telefono: ''
  };


  //disables Cliente y direccion
  telefonoPost: string = '';
  telefonoError: boolean = false;
  nombreDisabled: boolean = true;
  apellidosDisabled: boolean = true;
  codigopostalDisabled:boolean=true;
  telefonoDisabled: boolean = false;
  terminosAceptados: boolean = false;
  // Para el código postal
  cpInfo: CpResponse | null = null;
  coloniasDisponibles: string[] = [];
  coloniaSeleccionada: string = '';

  // Herramientas para el html
  visible: boolean = false;
  loading: boolean = false;
  visibleEdit:boolean=false;


  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 4000);
  };
  //funciones para los dialgos y mensajes
  showDialog() {
    this.visible = true;
  };
  showDialogP(){
    this.visibleEdit = true;
  };
  get isButtonDisabled(): boolean {
    const idCliente = localStorage.getItem('idCliente');
    const idDireccion = localStorage.getItem('idDireccion');
    const token = localStorage.getItem('Token')
    if (!token) {
      return true;
    }
    return idCliente !== null && idDireccion !== null;
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messages.clear();
    this.messages.add({ severity, summary, detail });
  };

  constructor(
    private clienteService: ClienteService,
    private messages: MessageService
  ) { }


  isFormComplete(): boolean {
    return (
      this.nuevoCliente.nombre.trim() !== '' &&
      this.nuevoCliente.apellidos.trim() !== '' &&
      this.nuevoCliente.telefono.trim() !== '' &&
      this.nuevaDireccion.cp.trim() !== '' &&
      this.nuevaDireccion.estado.trim() !== '' &&
      this.nuevaDireccion.municipio.trim() !== '' &&
      this.nuevaDireccion.colonia.trim() !== '' &&
      this.nuevaDireccion.calle.trim() !== '' &&
      this.nuevaDireccion.numero.trim() !== ''
    );
  }

  ngOnInit(): void { }

  // Herramientas para el telefono
  get isTelefonoValid(): boolean {
    const telefono = this.nuevoCliente.telefono;
    return telefono.length === 10 && /^[0-9]+$/.test(telefono);
  }
  //herramienta para editar
  get telefonoValid():boolean{
    const telefono = this.telefono
    return telefono.length === 10 && /^[0-9]+$/.test(telefono);
  }
  //funcion para validar el telefono
  validateTelefono(): void {
    const telefono = this.nuevoCliente.telefono;
    // Verifica si el número tiene exactamente 10 dígitos antes de proceder
    if (telefono.length === 10 && this.isTelefonoValid) {
      this.loading = true;
      this.telefonoError = false;
      this.telefonoDisabled = false;
      this.clienteService.getCliente(telefono).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.exito === 1) {
            console.log('El número ya existe en la base de datos');
            this.nombreDisabled = true;
            this.apellidosDisabled = true;
            this.telefonoDisabled = true;
            this.showMessage('error', 'Número Registrado', 'Este número ya fue registrado, si crees que es un error favor de comunicarte al 3951185963.');
            this.visible = false;
          } else if (res.exito === 0) {
            this.nombreDisabled = false;
            this.apellidosDisabled = false;
            this.codigopostalDisabled =false;
            this.telefonoDisabled = true;
          };
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          this.showMessage('error', 'Error', 'Hubo un problema al verificar el número de teléfono.');
        },
      });
    } else {
      this.nombreDisabled = true;
      this.apellidosDisabled = true;
      this.telefonoDisabled = false;
    };
  };

  // HTTP de Cliente
  getCliente(): void {
    if (this.telefonoValid) {
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
  };
  agregarCliente(): void {
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.posCliente(this.nuevoCliente).subscribe({
        next: (res) => {
          if (res.exito === 1) {
            localStorage.setItem('idCliente', res.data.idCliente.toString());
            this.terminosAcept(res.data.idCliente, 'Beta.01');
            this.showMessage('success', 'Cliente agregado', res.mensaje);
          } else {
            this.showMessage('error', 'Error', res.mensaje);
          };
          this.loading = false;
        },
        error: (error: string) => {
          this.loading = false;
          this.showMessage('error', 'Error', error);
        },
      });
    }
  };
  // HTTP de Direccion
  getDireccion(): void {
    if (this.telefonoValid) {
      this.loading = true;
      this.clienteService.getDireccion(this.telefono).subscribe({
        next: (res) => {
          console.log(res.data);
          if (res.exito === 1) {
            if (res.data.length > 0 && res.data[0]) {
              this.direc = res.data[0];
              this.showMessage('success', 'Datos', res.mensaje);
              localStorage.setItem('idDireccion', this.direc.idDireccion!.toString());
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
  };
  postDireccion(direccion: Direccion): void {
    direccion.telefono = this.nuevoCliente.telefono;
    if (this.isTelefonoValid) {
      this.loading = true;
      this.clienteService.postDireccion(direccion).subscribe({
        next: (res) => {
          if (res.exito === 1) {
            if (res.data.length > 0 && res.data[0]) {
              this.direc = res.data[0];
              localStorage.setItem('idDireccion', this.direc.idDireccion!.toString());
              this.showMessage('success', 'Direccion Agregada', res.mensaje);
            } else {
              this.showMessage('info', 'Sin resultados', 'No se encontraron direcciones en la respuesta.');
            }
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
  };
  putDireccion(): void {
    const direccion: Direccion = {
      idDireccion: 0,
      calle: this.nuevaDireccion.calle,
      colonia: this.nuevaDireccion.colonia,
      municipio: this.nuevaDireccion.municipio,
      numero: this.nuevaDireccion.numero,
      estado: this.nuevaDireccion.estado,
      cp: this.nuevaDireccion.cp,
      telefono: '1234567890'
    };
    this.clienteService.putDireccion(direccion).subscribe({
      next: (res: DireccionResponse) => {
        if (res.exito === 1) {
          this.showMessage('success', 'Dirección actualizada', res.mensaje);
        } else {
          this.showMessage('error', 'Error', res.mensaje);
        }
      },
      error: (error: string) => {
        this.showMessage('error', 'Error', error);
      }
    });
  };
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
      this.cpInfo = null;  // Limpiar la información si el código postal no es válido
    }
  };
  terminosAcept(idCliente: number, ArchivoVersion: string): void {
    const terminos: Terminos = {
      idCliente: idCliente,
      ArchivoVersion: ArchivoVersion
    };
      this.clienteService.postTerm(terminos).subscribe({
        next: (res) => {
          if (res.exito === 1) {
            this.showMessage('success', 'Términos Aceptados', res.mensaje);
          } else {
            this.showMessage('error', 'Error', res.mensaje);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.showMessage('error', 'Error', 'Hubo un problema al enviar los términos.');
        }
      });
  }

}
