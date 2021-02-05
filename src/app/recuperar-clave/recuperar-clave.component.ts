import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SendHttpData } from '../tools/SendHttpData';
import {MyErrorStateMatcher} from "../login/login.component";
import {GlobalVarService} from "../common/global-var.service";
import {Router} from "@angular/router";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import * as $ from "jquery";
@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent implements OnInit {
  hide = true;
  data: any;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  // Register
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private formBuilder: FormBuilder,
              public globalVar: GlobalVarService,
              private http: SendHttpData,
              public router: Router,
              private alertaS: AlertasService,
              private loginGlobal: LoginGlobalService) {
  }

  ngOnInit(): void {
    $('body, html').animate({
      scrollTop: '0px'
    }, 300);


    this.data =
      {
        email: null,
        codigo: null,
      };
  }

  recuperarClave() {
    console.log(this.data)
    let acumular = "";
    let longitud = 6;

    for (let i = 0; i < longitud; i++) {
       acumular +=  Math.floor(Math.random() * 7)
    }

    console.log(acumular);
    this.data.codigo = acumular;
    console.log(this.data)
    this.http.httpPost('recuperar-clave', this.data).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.alertaS.showToasterFull(respuesta[`mensaje`]);
      } else {
        this.alertaS.showToasterWarning(respuesta[`mensaje`]);
      }
      console.log(respuesta);
    }).catch(error => {
      console.log(error);
    });
  }


  getErrorMessageLogin() {
    if (this.email.hasError('required')) {
      return 'El campo es requerido.';
    }
    if (this.email.hasError('email')) {
      return 'Debe ser en formato email';
    }
    if (this.password.hasError('password')) {
      return 'Debe ser en formato email';
    }
  }

}

