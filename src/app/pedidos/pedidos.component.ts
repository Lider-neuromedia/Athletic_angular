import { Component, OnInit } from '@angular/core';
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder} from "@angular/forms";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  usuario: any;
  pedidos: any;
  rutaPedido: any;
  url: any;
  constructor(    private variablesGl: VariablesService,
                  private alertaS: AlertasService,
                  private _formBuilder: FormBuilder,
                  private setHtpp: SendHttpData,
                  private ruta: Router,
                  private loginGlobal: LoginGlobalService) {

    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
    this.listarMisPedidos();
    localStorage.removeItem('favoritos');
  }


  listarMisPedidos() {
    const data = {
      cliente: this.usuario.id_cliente
    }
    this.setHtpp.httpPost('listar-mis-pedido', data).toPromise().then(respuesta=> {
      console.log(respuesta);
      this.pedidos = respuesta[`data`];
      this.rutaPedido = respuesta[`ruta`];
    }).catch(error => {

    })
  }


  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

  detallePedido(codigo) {
    this.ruta.navigate(['detalle-pedido/', codigo])
  }
}
