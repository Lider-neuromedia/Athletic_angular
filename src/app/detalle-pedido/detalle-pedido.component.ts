import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {
  codigo: number;
  usuario: any;
  encabezado: any;
  detalle: any;
  url: any;

  constructor(
                  private alertaService: AlertasService,
                  private routeParams: ActivatedRoute,
                  private setHtpp: SendHttpData,
                  private loginGlobal: LoginGlobalService
                  ) {
    this.llamarDatoLocalesUsuario();
    this.codigo = this.routeParams.snapshot.params.id
    if(this.codigo) {
      this.getDetalleProductos();
    }
  }

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
  }

  getDetalleProductos()  {
        const  data = {
          codigo: this.codigo,
          cliente:  this.usuario.id_cliente
        }
        console.log(data);

        this.setHtpp.httpPost('detalle-producto-pedido', data).toPromise().then(respuesta => {
          console.log(respuesta);

          this.url = respuesta['ruta'];
          this.encabezado = respuesta['data'];
          this.detalle = respuesta['detalle'];

        }).catch(error => {
          console.log(error);
        });
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

}
