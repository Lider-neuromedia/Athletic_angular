import { Component, OnInit } from '@angular/core';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {NgxGalleryImage, NgxGalleryOptions} from "ngx-gallery-9";

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

  constructor( private alertaS: AlertasService,
               private variablesGl: VariablesService) { }

  ngOnInit(): void {
  }


  agregarProductosAlCarrito() {
    console.log(this.cantidad,  this.producto );

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    console.log(this.carritoAnterior);

    if (this.cantidad > 0) {

      this.producto['cantidad'] = this.cantidad;
      this.addProductoCarrito.push(this.producto);
      console.log(this.addProductoCarrito);

      if (this.addProductoCarrito) {
        if (this.carritoAnterior) {
        } else {
          this.carritoAnterior = [];
        }

        this.carritoAnterior.push(this.producto);
        localStorage.setItem('athletic', JSON.stringify(this.carritoAnterior));
      }


      this.addProductoCarrito = [];
      this.cantidad = 1;

      this.alertaS.showToasterFull(`Articulo Agregado Corectamente`);


    } else {
      this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidad}`);
    }
    this.variablesGl.changeMessage();
  }

}
