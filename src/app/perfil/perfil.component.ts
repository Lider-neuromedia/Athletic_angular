import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {Router} from "@angular/router";
import {GlobalVarService} from "../common/global-var.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
	hide = true;
  usuario: Perfil;
  dataUser: any;
  confirmarClave: string;
  constructor( private http: SendHttpData, private formBuilder: FormBuilder,
               private alertaS: AlertasService,
               private setHtpp: SendHttpData,
               private ruta: Router,
               public globalVar: GlobalVarService,
               private loginGlobal: LoginGlobalService) {

    this.llamarDatoLocalesUsuario();

  }

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
    this.usuario = {
      password: null,
      clave: null,
      genero: null,
      fecha_nacimiento: null,
      email: null,
      apellidos: null,
      nombres: null,
      estado: null,
      telefono: null,
      cliente: null,

    }
     this.listarPerfilUsuario();
  }

    listarPerfilUsuario() {

      console.log( this.dataUser);
      this.http.httpGetParamt('clientes-visualizar', this.dataUser.id_cliente).toPromise().then(respuesta => {
        console.log(respuesta);
        this.usuario.cliente = respuesta[`data`].id_cliente;
        this.usuario.password = respuesta[`data`].clave;
        this.usuario.email = respuesta[`data`].email;
        this.usuario.genero = respuesta[`data`].genero;
        this.usuario.nombres = respuesta[`data`].nombres;
        this.usuario.apellidos = respuesta[`data`].apellidos;
        this.usuario.fecha_nacimiento = respuesta[`data`].fecha_nacimiento;


        console.log(this.usuario);
      }).catch(error => {
        console.log(error);
      });
    }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.dataUser = response;
    });

  }

  actualizarPerfil() {

    console.log(this.confirmarClave, this.usuario.password)

    if ((this.confirmarClave && this.usuario.password) && (this.confirmarClave !== this.usuario.password)) {

      this.alertaS.showToasterWarning('La información de los campos contraseñas debens er iguales');
      return;
    }

    this.usuario.clave =  this.usuario.password;
    // console.log(this.usuario);
    this.setHtpp.httpPost('actualizar-cliente', this.usuario).toPromise().then(respuesta => {
      console.log(respuesta)

      if (respuesta['estado']) {
        this.alertaS.showToasterFull(respuesta['mensaje'])
      }else {
        this.alertaS.showToasterWarning(respuesta['mensaje'])
      }
    }).catch(error => {

    });

  }

}




export interface Perfil {

  apellidos: string,
  email: string,
  estado: string,
  fecha_nacimiento: string,
  genero: string,
  nombres: string,
  telefono: string,
  password: string,
  clave: string,
  cliente: number;
}
