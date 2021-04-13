import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {VistaPreviaComponent} from '../vista-previa/vista-previa.component';
import { AgregarCarritoComponent } from '../agregar-carrito/agregar-carrito.component';
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.css']
})
export class ItemProductoComponent implements OnInit {
  producto : any;
  galleryImages: any;
  tallas = [];
  carritoAnterior = [];
  addProductoCarrito = [];
  cantidad =  1;
  usuario: any;
  condicionBotonFavorito: any;
  cantidadComentario: any;
  totalComentario: any;
  constructor(public router:Router,
              public dialog: MatDialog,
              private route_params: ActivatedRoute,
              private http: SendHttpData,
              private alertaS: AlertasService,
              private activatedRoute: ActivatedRoute,
              private ruta: Router,
              private loginGlobal: LoginGlobalService,
              private variablesGl: VariablesService) { }

  @Input() id: boolean;
  @Input() subtitle: string;
  @Input() image: string;
  @Input() title: string;
  @Input() price: string;
  @Input() nuevo: number;
  @Input() descuento: any;
  @Input() price_ant: string;
  @Input() small: boolean;
  @Input() showButtons: boolean;
  @Input() full_view: boolean;
  @Input() favorites: boolean;
  @Input() data:[];

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
    this.getProducts(this.id);
    if (this.showButtons) {
      this.jQuery();
    }

    this.galleryImages = [
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008//assets/img/productos/producto-interna.png",
        big: "/N-1008//assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      }
    ];
  }

  openVistaPrevia() {
    const dialogRef = this.dialog.open(VistaPreviaComponent, {
      width: '900px',
      data: {id: this.id}
    });
  }

  agregarABolsa() {
    const dialogRef = this.dialog.open(AgregarCarritoComponent, {
      width: '900px',
      data: {id: this.id}
    });
  }

  jQuery(){
    $('.content-item-product').hover(function(){
      $(this).children('.cont-btn-prod').css('display', 'flex');
      $(this).children('.item-product').addClass('item-shadow');
    },
    function(){
      $(this).children('.cont-btn-prod').css('display', 'none');
      $(this).children('.item-product').removeClass('item-shadow');
    });
  }

  getProducts(id) {
    if(this.http.cargandoProducto){
      return;
    }
    this.http.getProducto(id).subscribe(
      response => {
        this.producto = response;
        $('#detalle').html(response.descripcion_prod);
        $('blockquote').addClass('col-md-4');
        var gallery = [];
        response.imagenes.forEach(element => {
          var img = {
            small: element.img,
            medium: element.img,
            big: element.img
          }

          gallery.push(img);
        });
        this.galleryImages = gallery;
      },
      error => { console.log("error." + error); }
    );
    // this.http.httpGet('productos/' + id, null, false).subscribe(
    //   response => {
    //     this.producto = response;
    //     $('#detalle').html(response.descripcion_prod);
    //     $('blockquote').addClass('col-md-4');
    //     var gallery = [];
    //     response.imagenes.forEach(element => {
    //       var img = {
    //         small: element.img,
    //         medium: element.img,
    //         big: element.img
    //       }

    //       gallery.push(img);
    //     });
    //     this.galleryImages = gallery;
    //   },
    //   error => { console.log("error." + error); }
    // );

  }


  agregarProductosAlCarrito() {
    this.agregarABolsa();
    this.cantidad = 1;

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));

    if (this.cantidad > 0) {

      this.producto['cantidad'] = this.cantidad;
      this.addProductoCarrito.push(this.producto);

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
