import { Component, OnInit } from '@angular/core';
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder} from "@angular/forms";
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-guardar-direcciones',
  templateUrl: './guardar-direcciones.component.html',
  styleUrls: ['./guardar-direcciones.component.css']
})
export class GuardarDireccionesComponent implements OnInit {
  cargarDirecciones: any;
  direccionEstado: any;
  usuario: any;
  constructor(    private variablesGl: VariablesService,
                  private alertaS: AlertasService,
                  private _formBuilder: FormBuilder,
                  private setHtpp: SendHttpData,
                  private ruta: Router,
                  private loginGlobal: LoginGlobalService) {
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
    this.cargarTodasLasDirecciones();
  }

  cargarTodasLasDirecciones() {
    const data = {
      cliente:  this.usuario.id_cliente
    }

    this.setHtpp.httpPost('listar-direcciones-pedido', data).toPromise().then(respuesta => {
      console.log(respuesta);
      this.cargarDirecciones = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })
  }


  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

  removerDirecciones(direccion) {
    const  data = {
      direccion: direccion
    };

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.setHtpp.httpPost('eliminar-direcciones', data).toPromise().then(respuesta => {
          console.log(respuesta[`data`]);
          this.alertaS.showToasterFull(respuesta[`data`]);
          this.cargarTodasLasDirecciones();
        }).catch(error => {

        });
      }
    })


  }

  editarDireccion(codigo) {
    console.log(codigo);
    this.ruta.navigate(['modificar-direcciones/', codigo])

  }


}
