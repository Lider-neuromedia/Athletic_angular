import { Component, OnInit } from '@angular/core';
import {VariablesService} from "./servicio/variable-global/variables.service";
import {AlertasService} from "./servicio/alertas/alertas.service";
import Swal from 'sweetalert2'
import {LoginGlobalService} from "./servicio/login-global/login-global.service";

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
  usuario: any;

  constructor(
    private variablesGl: VariablesService,
    private alertaS: AlertasService,
    private loginGlobal: LoginGlobalService,
    ) {}
  ngOnInit() {
    this.llamarDatoLocalesUsuario();
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

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
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
    })


  }



  vaciarBolsa() {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Vaciar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('athletic');
        this.variablesGl.changeMessage();
        this.valorTotal = 0;
      }
    })


  }


 /* vaciarBolsa() {
    localStorage.removeItem('athletic');
    this.variablesGl.changeMessage();
    this.valorTotal = 0;
  }*/

  aumentarDisminuir(data, indice, proceso) {

    this.carritoNuevo = JSON.parse(localStorage.getItem('athletic'));

    if (proceso === 1) {
      this.carritoNuevo[indice].cantidad++;


      const result = this.carritoNuevo[indice]['combinaciones'].filter(item => item.valor ==  this.carritoNuevo[indice].talla);
      console.log(this.carritoNuevo[indice].cantidad);

      if (this.carritoNuevo[indice].cantidad <= result[0]['cantidad']) {

      } else {
        this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario '+ result[0]['cantidad']);
        return;
      }
      console.log(result);

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

  confirmacion() {

    Swal.fire({
      icon: 'success',
      title: 'Listo...',
      text: 'sdfsbfdsbfdsbd',
      footer: ''
    });

  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }
}
