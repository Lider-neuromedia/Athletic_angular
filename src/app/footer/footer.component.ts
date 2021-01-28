import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    filtro: any;
  constructor(private http: SendHttpData, private  alerta: AlertasService) { }

  ngOnInit(): void {

    this.filtro  = {
      suscripcion_email: null,
      suscripcion_enviado: 0,
    }
  }


  crearSuscripcion() {

    this.http.httpPost('crear-suscripcion-tienda', this.filtro).toPromise().then(respuesta => {
      console.log(respuesta);

      if (respuesta[`estado`] === 1) {
        this.alerta.showToasterWarning(respuesta[`data`]);
      }


      if (respuesta[`estado`] === 2) {
        this.alerta.showToasterFull(respuesta[`data`]);
      }
    }).catch(error => {
      console.log(error);
    })

  }
}
