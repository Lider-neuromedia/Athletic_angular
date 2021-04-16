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
import { ClassGetter } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})

export class DetalleProductoComponent implements OnInit {

  producto : any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  imagenesView: any;
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
  opcionSeleccionado = null;
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
  mostrarZoom: boolean;
  imagenCambbiar: string;
  tallasDelProductoFiltradas: any;
  returnEstadoProducto: boolean;
  almacenColores: any;
  almacenTalals: any[];
  coloralCarrito: any;
  combinacionesTemporales: any[] = [];
  productoTemp: any;
  dattos = [];
  stockTotal: number;
  bandera: boolean;

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

    this.returnEstadoProducto = true;
    localStorage.removeItem('favoritos');
    this.imagenCambbiar = '';
    document.getElementById('myresult').style.display = 'none';

    this.mostrarZoom = false;

    $('body, html').animate({
      scrollTop: '0px'
    }, 300);

    this.activatedRoute.params.subscribe(value => {
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

  }

  // Productos
  getProducts(id) {
    this.http.httpGet('productos/' + id, null, false).subscribe(
      async response => {
        this.producto = response;
        this.almacenColores = response.combinaciones
       // this.almacenTalals = response.combinacionesTallas
        //await  this.validarEstadodelProducto();
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

        this.tallasDelProductoFiltradas = this.producto['combinaciones'];
        //const result = this.producto['combinaciones'].filter(item => item.valor == talla);
        this.galleryImages = gallery;
        this.imagenesView = response.imagenes;
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
    if (!this.opcionSeleccionado || this.opcionSeleccionado == '' || this.opcionSeleccionado == null) {
      this.alertaS.showToasterError('Debes seleccionar una talla');
      return;
    }
    if(JSON.parse(localStorage.getItem('athletic'))){
      this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    }else{
      this.carritoAnterior = [];
    }
    
    console.log(this.carritoAnterior);

    if (this.verTalalsAgotadas(this.cantidadProductos, this.producto['id_producto'], this.opcionSeleccionado)) {
      if (this.cantidadProductos > 0) {
        this.producto['talla'] = this.opcionSeleccionado;
        // this.producto['cantidad'] = this.producto['cantidad'];
        this.producto['color'] = this.coloralCarrito[0]['variation'][0]['valor'];
        this.producto['imagen_destacada'] = this.coloralCarrito[0]['imagenes'][0];
        // console.log(this.coloralCarrito);
        
        this.combinacionesTemporales.push(this.coloralCarrito[0]);
        this.producto['combinacionesTemporales'] = this.combinacionesTemporales;
        let i = 0;
        console.log(this.addProductoCarrito);
        if(this.carritoAnterior?.length > 0){
          console.log("existe");
          this.carritoAnterior.forEach(item => {
            console.log(item);
            console.log(this.producto);
            if( item.color == this.producto.color && item.talla == this.producto.talla){
              this.carritoAnterior[i] = this.producto;
              console.log(i);
              console.log(this.producto);
              this.bandera = true;
              return;
            }
            i++;
          })
        }
        // }else{
        //   console.log("No existe");
        //     this.carritoAnterior.push(this.producto);
        //    this.bandera = false;
        // }    
        if(!this.bandera){
          console.log("No existe");
            this.carritoAnterior.push(this.producto);
        }
        console.log(this.carritoAnterior);
        console.log(this.producto);
          if (this.carritoAnterior) {
          } else {
            // this.carritoAnterior = [];
          }
          // this.carritoAnterior.push(this.producto);  
          localStorage.setItem('athletic', JSON.stringify(this.carritoAnterior));
        }


        // this.addProductoCarrito = [];
        this.bandera = false;
        this.cantidadProductos = 1;

        this.alertaS.showToasterFull(`Articulo Agregado Correctamente`);


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
      this.http.httpPost('valirdar-agregado-favorito', data).toPromise().then(respuesta => {

        this.condicionBotonFavorito = respuesta[`data`];

      }).catch(error => {

      });
    }

  }
  ingresar() {

      localStorage.setItem('favoritos', JSON.stringify(this.producto.id_producto))

    this.ruta.navigate(['login-movil']);
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
          let contado = 0;
          for (let i = 1; i <= this.cantidadComentario[0]['cantidad']; i++) {
            contado++;
          }
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
    this.ruta.navigate(['login-movil']);
  }

  listarProductosRelacionados(codigo) {
    const data = {
      producto: codigo
    };

    this.http.httpPost('listar-productos-relacionados', data).toPromise().then(respuesta => {
      this.carouselDescatadosUno = respuesta[`data`];
      this.url = respuesta[`ruta`];
    });
  }

  checkColores(event) {
    this.returnEstadoProducto = true;
    // this.producto['combinaciones'].forEach(element => {
    //   const variacion = [];
    //   variacion.push(element.variation[1]);
    //   this.almacenTalals = variacion;
      
    // });
    // filter(item => item.valor_id == event);
    this.coloralCarrito = this.producto['combinaciones'].filter(item => item.variation[0].valor_id == event);
    this.almacenTalals = this.coloralCarrito[0]['variation']
    console.log(this.coloralCarrito);
    console.log(this.almacenTalals);
    console.log(this.producto);
    console.log(event);
    // console.log(this.coloralCarrito[1]['variation']?.valor);


    if (event && this.almacenTalals.length == 0) {
      console.log('esta vacio', this.almacenTalals.length);
      this.returnEstadoProducto = false;
    }
    let imagenSeleccionada = [];
    imagenSeleccionada.push({
      img: this.coloralCarrito[0]['imagenes'][0]
    }) 
    this.imagenesView = imagenSeleccionada;
    console.log(this.imagenesView);

  }

  checkearTalla(evento) {
    this.opcionSeleccionado = evento;
  }



  verTalalsAgotadas(cantidad: number, producto: number, talla: string) {

    //Filtro cual es la talla del producto que estan comprando
    let result;
    console.log(talla);
    this.producto['combinaciones'].forEach(element => {
      const variacion = [];
      variacion.push(element.variation[1]);
      result = variacion.filter(item => item?.valor == talla)
      // result = variacion;
      
    });
    console.log(result);
    console.log(producto);
    console.log(this.producto);
    // this.producto['combinacionesTallas'].filter(item => item.valor == talla);
    //luego que obtengo los datos de la base de datos valido que si la cantidad que estan comprando es menor o igual a la que tengo
    //En la base de datos lo deje permitir comprando de lo contrario nooooooooo podra
    if(!this.producto['combinaciones']){
    if (cantidad <= this.producto['cantidad']) {
      console.log("Sin combinaciones");
      cantidad -= this.producto['cantidad'];
        this.dattos.push({
          producto: producto,
          atributo: result[0]?.id_atributo_value,
          cantidad: cantidad,
          cantidadTotal: this.producto['cantidad'],
          id_stock: result[0]?.destallestock_codigo,
      });
      this.producto['stock'] = this.dattos;
      return true;
    //Si esta corecta la cantida le devuelvo true al carrito de compras
    }else {
      this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+ result[0]?.cantidad);
      return false;
      //De lo contrario devuelvo false y le digo que la cantidad maxima debe ser la que tengo en  la base de datos
    }

    /*cantidad: 12
    id_atributo_group: 2
    id_atributo_value: 16
    id_combinacion: 1349
    precio: null
    sku: null
    valor: "40"*/
  }else{
    console.log("Con combinaciones");
    let dattos = {};
    let index = 0;
    if(cantidad <= this.coloralCarrito[0].cantidad){      
      for (const i of this.dattos) {
      if(this.coloralCarrito[0].id == i.id){
        if(cantidad <= i.cantidadTemp){
          cantidad += i.cantidad
          this.dattos[index] = {
            id: this.coloralCarrito[0].id,
            producto: producto,
            cantidad: cantidad,
            cantidadTemp: this.coloralCarrito[0].cantidad - cantidad,
            cantidadTotal: this.coloralCarrito[0].cantidad
        };
        this.producto['stock'] = this.dattos;
        return true;
        }else{
        this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+ this.coloralCarrito[0].cantidad);
        return false;
        }
        
      }
      index++;
    }
    this.dattos.push({
      id: this.coloralCarrito[0].id,
      producto: producto,
      cantidad: cantidad,
      cantidadTemp: this.coloralCarrito[0].cantidad - cantidad,
      cantidadTotal: this.coloralCarrito[0].cantidad
  });
    this.producto['stock'] = this.dattos;
    return true;
    }else{
      this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+ this.coloralCarrito[0].cantidad);
      return false;
    }
  }
  }

  getPagination(url: string): void{
    this.http.httpGetPaginar(url).toPromise().then(response => {
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
      }

    });
  }

  eliminarFavvoritos() {

    const data = {
      usuario: this.usuario.id_cliente,
      producto: this.producto.id_producto
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

  ocultarZoom() {
    document.getElementById('myresult').style.display = 'none';
  }


  imageZoom(imgID, resultID) {
    document.getElementById('myresult').style.display = 'block';
    this.mostrarZoom = true;
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      /*prevent any other actions that may occur when moving over the image:*/
      e.preventDefault();
      /*get the cursor's x and y positions:*/
      pos = getCursorPos(e);
      /*calculate the position of the lens:*/
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      /*prevent the lens from being positioned outside the image:*/
      if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
      if (x < 0) {x = 0;}
      if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
      if (y < 0) {y = 0;}
      /*set the position of the lens:*/
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      /*display what the lens "sees":*/
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /*get the x and y positions of the image:*/
      a = img.getBoundingClientRect();
      /*calculate the cursor's x and y coordinates, relative to the image:*/
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /*consider any page scrolling:*/
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }

  }

  cambiarImagen(imagen) {

    this.imagenCambbiar = imagen;
  }


  getUrlImage(url: string) {
    return `url('${url}')`;
  }

/*
  validarEstadodelProducto() {
      this.returnEstadoProducto = this.producto['combinaciones'].reduce((item1, item2) => {
        return item1 + item2.cantidad;
      }, 0);
  }*/

}
