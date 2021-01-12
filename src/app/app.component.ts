import { Component, OnInit } from '@angular/core';
import {VariablesService} from "./servicio/variable-global/variables.service";
import {AlertasService} from "./servicio/alertas/alertas.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Athletic';
  bolsa = false;
  carrito: any;
  carritoAnterior: any;
  cantidadCarrito = 0;
  valorTotal: number;
  carritoNuevo = [];

  constructor(private variablesGl: VariablesService, private alertaS: AlertasService) {}
  ngOnInit() {
    this.llamarDatoLocales();
    this.miCarritoCompraContador();

  }

  openBolsa($event){
    this.bolsa = $event;
  }


  llamarDatoLocales() {

    this.variablesGl.currentMessage.subscribe(response => {
      this.carritoAnterior = response;
      this.valorTotalPedido();
      this.miCarritoCompraContador();
    });
  }

  miCarritoCompraContador() {

    if (this.carritoAnterior) {
      this.carritoAnterior.forEach(respuesta => {
        this.cantidadCarrito += 1;
      });
    }

  }



  valorTotalPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    if (valorTotalLista) {
      this.valorTotal = valorTotalLista.reduce((item1, item2) => {
        return item1 + (item2.cantidad * item2.precio);
      }, 0);
    }
    return this.valorTotal;

  }



  quitarItemCarrito(data, co) {

    this.carrito = localStorage.getItem('athletic');
    let dataCarrito = JSON.parse(this.carrito);
    let i = dataCarrito.indexOf(data);

    dataCarrito.splice(co, 1);


    localStorage.setItem('athletic', JSON.stringify(dataCarrito));
    this.llamarDatoLocales();
    let datos = 'Articulo removido del Carrito de Compras ';
    this.alertaS.showToasterWarning(datos);

    this.variablesGl.changeMessage();
  }

  vaciarBolsa() {
    localStorage.removeItem('athletic');
    this.variablesGl.changeMessage();
    this.valorTotal = 0;
  }

  aumentarDisminuir(data, indice, proceso) {

    this.carritoNuevo = JSON.parse(localStorage.getItem('athletic'));

    if (proceso === 1) {
      this.carritoNuevo[indice].cantidad++;
    } else {
      if (this.carritoNuevo[indice].cantidad > 1) {
        this.carritoNuevo[indice].cantidad--;
      } else {
        let datos = 'Articulo agregado a la canasta no puede ser menor a 1 unidad';
        this.alertaS.showToasterWarning(datos);
      }

    }

    localStorage.setItem('athletic', JSON.stringify(this.carritoNuevo));
    this.variablesGl.changeMessage();
 //   console.log(this.carritoNuevo);

  }

}
