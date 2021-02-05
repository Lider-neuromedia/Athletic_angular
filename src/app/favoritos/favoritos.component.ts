import { Component, OnInit } from '@angular/core';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery-9";
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  producto : any;
  descuento;
  prod = [];
  cantidad = 1;
  precio;
  carritoAnterior = [];
  addProductoCarrito = [];
  usuario: any;
  misFavoritos: any;
  dominio: any;

  constructor( private alertaS: AlertasService,
               private http: SendHttpData,
               private ruta: Router,
               private loginGlobal: LoginGlobalService,
               private variablesGl: VariablesService,
               private favoritoSe: FavoritosService) {
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {

    this.listarFavoritos();
  }


  agregarProductosAlCarrito(codigo) {
    console.log( codigo);
    this.ruta.navigate(['detalle-producto/',codigo])
  }

  listarFavoritos() {
    const data = {
      codigo: this.usuario.id_cliente
    }
    this.http.httpPost('listar-mis-favoritos', data).toPromise()
      .then(respuesta => {
          this.misFavoritos = respuesta[`data`];
          this.dominio = respuesta[`dominio`];
          console.log( this.misFavoritos);
         console.log( this.dominio);
      }).catch(error => {

    });

  }

  eliminarDeFavoritos(favorito) {
    const data = {
      codigo: favorito
    }

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

        this.http.httpPost('eliminar-mis-favoritos', data).toPromise()
          .then(respuesta => {

            this.alertaS.showToasterWarning(respuesta[`data`]);
            this.favoritoSe.changeMessage();
            this.listarFavoritos();
          }).catch(error => {

        });
      }
    })

  }


  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

}
