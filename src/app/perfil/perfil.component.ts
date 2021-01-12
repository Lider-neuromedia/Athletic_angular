import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  myForm: FormGroup;
	hide = true;
  usuario: Perfil;
  constructor( private http: SendHttpData, private formBuilder: FormBuilder,) {



  }

  ngOnInit(): void {
     this.usuario = JSON.parse(localStorage.getItem('userAthletic')).id_cliente;
     if (this.usuario)
    console.log(this.usuario);
     this.listarPerfilUsuario(this.usuario);
  }

    listarPerfilUsuario(codigo) {
      this.http.httpGetParamt('clientes-visualizar', codigo).toPromise().then(respuesta => {
        console.log(respuesta);
        this.usuario = respuesta[`data`][0];
      }).catch(error => {
        console.log(error);
      });
    }

}

export interface Perfil {

  apellidos: null,
  email: null,
  estado: null,
  fecha_nacimiento: null,
  genero: null,
  nombres: null,
  telefono: null,
  password: null,
}
