import { Component, OnInit } from '@angular/core';
import {VariablesService} from "./servicio/variable-global/variables.service";
import {AlertasService} from "./servicio/alertas/alertas.service";
import Swal from 'sweetalert2'
import {LoginGlobalService} from "./servicio/login-global/login-global.service";
import { Subscription } from 'rxjs';
import { element } from 'protractor';

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
  valorTotal: number = 0;
  carritoNuevo = [];
  usuario: any;
  arrayIndex: any;

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
      console.log(this.carritoAnterior);
      this.valorTotal = 0;
      this.valorTotalPedido();
      // this.miCarritoCompraContador();
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
    let i = 0;
    if (valorTotalLista) {
      valorTotalLista.reduce((item1, item2) => {
        console.log(item2);
        if(item2.combinaciones.length > 0){
          item2.combinaciones.forEach(element => {
            if(item2.id_combinacion == element.id){
              this.valorTotal = this.valorTotal + (element.stock.cantidad * element.precio);
              console.log(item2.id_combinacion);
              console.log(item1);
              console.log(element.id);
              console.log(this.valorTotal);
              return;
            }
          });
          
        }else{
          this.valorTotal = this.valorTotal + (item2.stock.cantidad * item2.precio);
        }
      }, 0);
    }
    console.log(this.valorTotal);
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
        let i = 0;
        console.log(JSON.parse(this.carrito));
        console.log(data);
        console.log(co);
        console.log(dataCarrito);
        dataCarrito.forEach(element1 => {
          if(element1.id_combinacion){
            if(element1.id_combinacion == data.id_combinacion){
              // console.log(element1.color);
              // console.log(data.color);
              return;
            }
          }else{
            if(element1.id_producto == element1.id_producto){
              return;
            }
          }
          
          i++;
        });

        dataCarrito.splice(i, 1);
        localStorage.setItem('athletic', JSON.stringify(dataCarrito));
        localStorage.setItem('producto-borrado', JSON.stringify(data));
        this.variablesGl.changeMessage();
        // this.llamarDatoLocales();
        let datos = 'Articulo removido del Carrito de Compras ';
        this.alertaS.showToasterWarning(datos);

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
    let i = 0;
    this.carritoNuevo = JSON.parse(localStorage.getItem('athletic'));
    if(data.combinaciones.length > 0){
      data.combinaciones.forEach(element => {
        if(data.id_combinacion == element.id){
          if(element.stock.cantidad < element.cantidad && proceso === 1){
            element.stock.cantidad++;
            element.stock.cantidadTemp--;
          }else if(element.stock.cantidad > 1 && proceso === 0){
              element.stock.cantidad--;
              element.stock.cantidadTemp++;
          }
        }
      });
    }else{
      console.log(data.id_producto);
      console.log(data.stock.producto);
      if(data.id_producto == data.stock.producto){
        if(data.stock.cantidad < data.cantidad && proceso === 1){
          console.log("subir cantidad");
          data.stock.cantidad++;
          data.stock.cantidadTemp--;
        }else if(data.stock.cantidad > 1 && proceso === 0){
          console.log("bajar cantidad");
          data.stock.cantidad--;
          data.stock.cantidadTemp++;
        }
      }
    }
    this.carritoNuevo.forEach(element => {
      if(data.id_combinacion){
      if(element.id_combinacion == data.id_combinacion){
        this.carritoNuevo[i] = data;
        console.log(data);
        console.log(this.carritoNuevo);
      }
    }else{
      if(data.id_producto == element.id_producto){
        this.carritoNuevo[i] = data;
        console.log(data);
        console.log(this.carritoNuevo);
      }
    }
    i++;
    })
    localStorage.setItem('athletic', JSON.stringify(this.carritoNuevo));
    this.variablesGl.changeMessage();
  //  console.log(this.carritoNuevo);
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
