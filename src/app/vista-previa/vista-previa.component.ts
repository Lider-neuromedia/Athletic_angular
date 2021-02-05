import { Component, OnInit, Inject } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { SendHttpData } from '../tools/SendHttpData';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AgregarCarritoComponent} from "../agregar-carrito/agregar-carrito.component";

export interface DialogData {
  id: any;
}

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.css']
})

export class VistaPreviaComponent implements OnInit {
  opcionSeleccionado: any;
  constructor(public dialogRef: MatDialogRef<VistaPreviaComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public router : Router,
              private http: SendHttpData,
              private  alertaS: AlertasService,
              public dialog: MatDialog,
              private route_params: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              private ruta: Router,
              private loginGlobal: LoginGlobalService,
              private variablesGl: VariablesService
  ) { }
  producto : any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  descuento;
  valor_ant;
  precio_desc;
  productos_relac = [];
  prod = [];
  cantidad = 1;
  tallas = [];
  carritoAnterior = [];
  addProductoCarrito = [];
  usuario: any;
  condicionBotonFavorito: any;
  cantidadComentario: any;
  totalComentario: any;
  url: any;

  carouselDescatadosUno:any = [];
  optionSlideDestacados:any = [];

  ngOnInit(): void {

    this.galleryImages = [
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
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
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      }
    ];

    // this.galleryImages = [
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   }
    // ];

    this.carouselDescatadosUno = [
      {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/tres.jpg',"descuento":true},
      {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/tres.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":true}
    ];

    this.optionSlideDestacados = {
      items: 5,
      dots: false,
      nav: true
    }

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '100%',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.getProducts(this.data.id);
    this.listarProductosRelacionados(this.data.id)
  }

  async getDataProdRelac(id){
    return await this.http.httpGet('products/' + id, null, false).toPromise().then(
      response => {
        var producto = response.product;
        var prod_relac = {
          id : producto.id,
          name : producto.name[0]['value'],
          img : this.http.getImageProduct(producto.id, producto.id_default_image)
        }

        return prod_relac;
      },
      error => {

      });
  }

  getProductsRelac(products){
    var productos = [];
    products.forEach((element, index) => {
      this.getDataProdRelac(element.id).then(
        response => {
          if ((index + 1) == 5) {
            this.prod.push(response);
            productos.push(this.prod);
            this.prod = [];
          }else{
            if (products.length == (index + 1)) {
              productos.push(this.prod);
            }
            this.prod.push(response);
          }
        }
      );
    });
    this.productos_relac = productos;
  }

  getProductValue(tallas){
    var values = [];
    tallas.forEach(element => {
      this.http.httpGet('product_option_values/' + element.id, null, false).subscribe(
        response => {
          var data = response.product_option_value;
          if (data.id_attribute_group == 5) {
            var value = {
              id: data.id,
              name: data.name[0]['value']
            };
            values.push(value);
          }
        },
        error => { console.log("error." + error); }
      );
    });
    this.tallas = values;
    console.log(this.tallas);
  }

  // Productos
  getProducts(id) {
    this.http.httpGet('productos/' + id, null, false).subscribe(
      response => {
        this.producto = response;
        console.log( this.producto );
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
  }

  changeCantidad(sum){
    if (sum) {
      this.cantidad = this.cantidad + 1;
    }else{
      if (this.cantidad > 1) {
        this.cantidad = this.cantidad - 1;
      }
    }
  }

  /*agregarProductosAlCarrito() {
    this.alertaS.showToasterFull('Articulo Agregado Corectamente');

    if (this.cantidad > 0) {
      this.alertaS.showToasterFull('Articulo Agregado Corectamente');
    } else {
      this.alertaS.showToasterError('Debes agregar Minimo un producto');
    }
  }*/

  agregarProductosAlCarrito() {

    if (!this.opcionSeleccionado) {
      this.alertaS.showToasterError('Debes seleccionar una talla');
      return;
    }

    console.log(this.cantidad,  this.producto );

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    console.log(this.carritoAnterior);

    if (this.cantidad > 0) {
      this.producto['talla'] = this.opcionSeleccionado;
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

    this.onNoClick();
    } else {
      this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidad}`);
    }
    this.variablesGl.changeMessage();
    this.agregarABolsa(this.producto['id_producto']);
  }

  listarProductosRelacionados(codigo) {
    const  data = {
      producto: codigo
    };

    this.http.httpPost('listar-productos-relacionados', data).toPromise().then(respuesta => {
      console.log(respuesta);

      this.carouselDescatadosUno = respuesta[`data`];
      this.url = respuesta[`ruta`];

      console.log( this.carouselDescatadosUno , this.url )
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkearTalla(evento) {
    console.log(evento);
    this.opcionSeleccionado = evento;
  }

  agregarABolsa(producto) {
    const dialogRef = this.dialog.open(AgregarCarritoComponent, {
      width: '900px',
      data: {id: producto}
    });
  }
}
