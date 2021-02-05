import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SendHttpData} from '../tools/SendHttpData';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery-9';
import * as $ from 'jquery';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {MatDialog} from '@angular/material/dialog';
import {ComentarioProductoComponent} from "../comentario-producto/comentario-producto.component";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})

export class DetalleProductoComponent implements OnInit {

  producto : any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  descuento;
  valor_ant;
  precio_desc;
  productos_relac = [];
  prod = [];
  cantidad = 1;
  cantidadProductos: number = 1;
  tallas = [];
  precio;
  carritoAnterior = [];
  addProductoCarrito = [];
  usuario: any;
  condicionBotonFavorito: any;
  cantidadComentario: any;
  totalComentario: any;
  uno: number;
  dos: number;
  tres: number;
  cuatro: number;
  cinco: number;
  todas: number;

  tamanio1: number;
  tamanio2: number;
  tamanio3: number;
  tamanio4: number;
  tamanio5: number;


  color1: any;
  color2: any;
  color3: any;
  color4: any;
  color5: any;

  texto: any;
  colorTexto: any;
  unicaValoracion: any;
  url: any;
  opcionSeleccionado: any;
  carouselDescatadosUno: any;

  currentPage: any;
  firstPageUrl: any;
  lastPage: any;
  lastPageUrl: any;
  nextPageUrl: any;
  prevPageUrl: any;
  to: any;
  total: number = 1;
  cantidadPagina: number = 1;

  constructor(
    public dialog: MatDialog,
    private route_params: ActivatedRoute,
    public router: Router,
    private http: SendHttpData,
    private alertaS: AlertasService,
    private activatedRoute: ActivatedRoute,
    private ruta: Router,
    private favoritoSe: FavoritosService,
    private loginGlobal: LoginGlobalService,
    private variablesGl: VariablesService,
    private favorito: FavoritosService) {

    this.llamarDatoLocalesUsuario();
  }


  goDescripcion(){
    $('html, body').animate({
      scrollTop: $('#godescripcion').offset().top - 80
    },1000)
  }

  goDetalle(){
    $('html, body').animate({
      scrollTop: $('#godetalle').offset().top - 80
    },1000)
  }

  goValoracion(){
    $('html, body').animate({
      scrollTop: $('#govaloracion').offset().top - 80
    },1000)
  }

  goSugerencias(){
    $('html, body').animate({
      scrollTop: $('#gosugerencias').offset().top - 80
    },1000)
  }

  /*
   * Carrusel productos primeros productos destacados 4 columnas
   */
  /*carouselDescatadosUno = [
    {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/tres.jpg',"descuento":true},
    {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/tres.jpg',"descuento":false},
    {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":true}
  ];*/

  optionSlideDestacados = {
    items: 5,
    dots: false,
    nav: true
  }

  optionCarouselSlide = {
    // items: 3,
    dots: true,
    nav: true
  }

  ngOnInit(): void {

    $('body, html').animate({
      scrollTop: '0px'
    }, 300);

    this.activatedRoute.params.subscribe(value => {
     console.log(value);
      this.getProducts(value.id);
      this.calculoProductoResenia(value.id);
      this.cargarLosComentarios(value.id);
      this.listarProductosRelacionados(value.id);
    });

    this.getProducts(this.route_params.snapshot.params.id);
    this.validarFavoritos(this.route_params.snapshot.params.id);
    this.cargarLosComentarios(this.route_params.snapshot.params.id);
    this.calculoProductoResenia(this.route_params.snapshot.params.id);
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

    this.color1 = '#b3aeae';
    this.color2 = '#b3aeae';
    this.color3 = '#b3aeae';
    this.color4 = '#b3aeae';
    this.color5 = '#b3aeae';
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
    console.log(productos);
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
        console.log(this.producto);
        this.producto.precio = Math.round(this.producto.precio)
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
      this.cantidadProductos = this.cantidadProductos + 1;
    }else{
      if (this.cantidadProductos > 1) {
        this.cantidadProductos = this.cantidadProductos - 1;
      }
    }
  }

  agregarProductosAlCarrito() {
    console.log(this.cantidadProductos, this.producto);
    if (!this.opcionSeleccionado) {
      this.alertaS.showToasterError('Debes seleccionar una talla');
      return;
    }

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    console.log(this.carritoAnterior);

    if (this.cantidadProductos > 0) {
      this.producto['talla'] = this.opcionSeleccionado;
      this.producto['cantidad'] = this.cantidadProductos;
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
      this.cantidadProductos = 1;

      this.alertaS.showToasterFull(`Articulo Agregado Corectamente`);


    } else {
      this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidadProductos}`);
    }
    this.variablesGl.changeMessage();
  }



  agregarProductoFavorito() {
    const data = {
      usuario: this.usuario.id_cliente,
      producto: this.producto.id_producto
    };

    this.http.httpPost('agregar-productos-favorito', data).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.favorito.changeMessage();
        this.alertaS.showToasterFull(`Articulo agregado a favoritos`);
        this.validarFavoritos(this.producto.id_producto);
      }
    }).catch(error => {

    })


    console.log(this.producto, data);
  }


  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }


  validarFavoritos(producto) {
    if (this.usuario) {
      const data = {
        usuario: this.usuario.id_cliente,
        producto: producto
      };
      console.log(data);
      this.http.httpPost('valirdar-agregado-favorito', data).toPromise().then(respuesta => {

        this.condicionBotonFavorito = respuesta[`data`];

      }).catch(error => {

      });
    }

  }
  ingresar() {
    this.ruta.navigate(['login']);
  }

  openDialog() {

    const dialogRef = this.dialog.open(ComentarioProductoComponent, {
      width: '700px',
      data: {datos: this.producto}
    });

    dialogRef.afterClosed().subscribe(art => {
      if (art != undefined)
        console.log(art);
    });

  }


  cargarLosComentarios(producto) {
    if (this.usuario) {

      this.favoritoSe.currentMessage.subscribe(response => {
        this.http.httpGetParamt('pintar-comentarios-por-productos', producto).toPromise().then(respuesta => {
          this.cantidadComentario = respuesta['cantidad'];
          this.totalComentario = respuesta['comentarios']['data'];

          this.currentPage = respuesta[`comentarios`][`current_page`];
          this.firstPageUrl = respuesta[`comentarios`][`first_page_url`];
          this.lastPage = respuesta[`comentarios`][`last_page`];
          this.lastPageUrl = respuesta[`comentarios`][`last_page_url`];
          this.nextPageUrl = respuesta[`comentarios`][`next_page_url`];
          this.prevPageUrl = respuesta[`comentarios`][`prev_page_url`];
          this.to = respuesta[`comentarios`][`to`];
          this.total = respuesta[`comentarios`][`total`];
          this.cantidad = respuesta[`comentarios`][0];
          console.log(this.total, this.cantidad, this.totalComentario, this.to)
          let contado = 0;
          for (let i = 1; i <= this.cantidadComentario[0]['cantidad']; i++) {
            contado++;
            console.log(i);
          }
          console.log(contado);
          console.log(this.cantidadComentario[0]['cantidad']);
          console.log(this.totalComentario);
          console.log(this.cantidadComentario.length);
        }).catch(error => {

        });
      });
    }
  }

  calculoProductoResenia(producto) {

    const data = {
      producto: producto
    };



      this.favoritoSe.currentMessage.subscribe(response => {
        this.http.httpPost('pintar-calculo-por-productos', data).toPromise().then(respuesta => {
          console.log(respuesta);
          this.uno = respuesta['uno'];
          this.dos = respuesta['dos'];
          this.tres = respuesta['tres'];
          this.cuatro = respuesta['cuatro'];
          this.cinco = respuesta['cinco'];
          this.todas = respuesta['todas'];


          this.tamanio1 = respuesta['todas']['todas'] ? respuesta['uno']['uno'] / respuesta['todas']['todas'] * 100 : 0;
          this.tamanio2 = respuesta['todas']['todas'] ? respuesta['dos']['dos'] / respuesta['todas']['todas'] * 100 : 0;
          this.tamanio3 = respuesta['todas']['todas'] ? respuesta['tres']['tres'] / respuesta['todas']['todas'] * 100 : 0;
          this.tamanio4 = respuesta['todas']['todas'] ? respuesta['cuatro']['cuatro'] / respuesta['todas']['todas'] * 100 : 0;
          this.tamanio5 = respuesta['todas']['todas'] ? respuesta['cinco']['cinco'] / respuesta['todas']['todas'] * 100 : 0;

          console.log(this.tamanio1, this.tamanio2, this.tamanio3, this.tamanio4, this.tamanio5)

          if (this.tamanio1 > 99) {
            this.tamanio1 = 100;
          }
          if (this.tamanio2 > 99) {
            this.tamanio2 = 100;
          }
          if (this.tamanio3 > 99) {
            this.tamanio3 = 100;
          }
          if (this.tamanio4 > 99) {
            this.tamanio4 = 100;
          }
          if (this.tamanio5 > 99) {
            this.tamanio5 = 100;
          }
        }).catch(error => {

        });
      });
  }

  autenticarse() {
    this.ruta.navigate(['login']);
  }

  listarProductosRelacionados(codigo) {
    const data = {
      producto: codigo
    };

    this.http.httpPost('listar-productos-relacionados', data).toPromise().then(respuesta => {
      console.log(respuesta);

      this.carouselDescatadosUno = respuesta[`data`];
      this.url = respuesta[`ruta`];

      console.log(this.carouselDescatadosUno, this.url)
    });
  }

  checkearTalla(evento) {
    console.log(evento);
    this.opcionSeleccionado = evento;
  }

  getPagination(url: string): void{
    console.log(url);
    this.http.httpGetPaginar(url).toPromise().then(response => {
      console.log(response);
      if (response[`comentarios`]){
        this.totalComentario  = response[`comentarios`][`data`];
        this.currentPage  = response[`comentarios`][`current_page`];
        this.firstPageUrl = response[`comentarios`][`first_page_url`];
        this.lastPage = response[`comentarios`][`last_page`];
        this.lastPageUrl = response[`comentarios`][`last_page_url`];
        this.nextPageUrl = response[`comentarios`][`next_page_url`];
        this.prevPageUrl = response[`comentarios`][`prev_page_url`];
        this.to = response[`comentarios`][`to`];
        this.total = response[`comentarios`][`total`];
        this.cantidad = response[`comentarios`][0];
        console.log( this.total, this.cantidad, this.totalComentario,  this.to )
      }

    });
  }

  eliminarFavvoritos() {

    const data = {
      usuario: this.usuario.id_cliente,
      producto: this.producto.id_producto
    }
    console.log(data);
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

        this.http.httpPost('eliminar-mis-favoritos-detalle-producto', data).toPromise()
          .then(respuesta => {

            this.alertaS.showToasterWarning(respuesta[`data`]);
            this.favoritoSe.changeMessage();
            this.validarFavoritos(this.producto.id_producto);
          }).catch(error => {

        });
      }
    })

  }

}
