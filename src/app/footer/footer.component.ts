import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import Swal from 'sweetalert2'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    filtro: any;
  usuario = null;
  constructor(
    private http: SendHttpData,
    private  alerta: AlertasService,
    private loginGlobal: LoginGlobalService,
    ) { }

  ngOnInit(): void {

    this.filtro  = {
      suscripcion_email: null,
      suscripcion_enviado: 0,
      terminos_condiciones: null
    }
    this.llamarDatoLocalesUsuario();
  }


  crearSuscripcion() {

    if (!this.filtro.suscripcion_email ) {
      this.alerta.showToasterWarning('Ingresar tu correo electrónico');
      return;
    }

    if (!this.filtro.terminos_condiciones) {
      this.alerta.showToasterWarning('Debes declarar que leiste los terminos y condiciones');
      return;
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(String(this.filtro.suscripcion_email).toLowerCase()))

    if (!re.test(String(this.filtro.suscripcion_email).toLowerCase())) {
      this.alerta.showToasterWarning('Debes ingresar un correo electrónico valido');
      return;
    }

    this.http.httpPost('crear-suscripcion-tienda', this.filtro).toPromise().then(respuesta => {
      console.log(respuesta);

      if (respuesta[`estado`] === 1) {
        this.alerta.showToasterWarning(respuesta[`data`]);
      }


      if (respuesta[`estado`] === 2) {
        //this.alerta.showToasterFull(respuesta[`data`]);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: respuesta[`data`],
          showConfirmButton: false,
          timer: 5000
        })
      }
    }).catch(error => {
      console.log(error);
    })

  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
      //this.contadorFavoritos();
    });

  }


}
