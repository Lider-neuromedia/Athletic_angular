import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SendHttpData } from '../tools/SendHttpData';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {VistaPreviaComponent} from '../vista-previa/vista-previa.component';
import {ActivatedRoute, Router} from "@angular/router";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";
import * as $ from "jquery";
import {AgregarCarritoComponent} from "../agregar-carrito/agregar-carrito.component";

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  disenoHome = {
    sesion_1 : [],
    sesion_2 : [],
    sesion_3 : [],
    sesion_4 : [],
    sesion_5 : [],
    sesion_6 : [],
    sesion_7 : [],
    sesion_8 : [],
    sesion_9 : [],
    sesion_10 : [],
    sesion_11 : [],
    sesion_12 : [],
    sesion_13 : [],
    sesion_14 : [],
    sesion_15 : [],
    sesion_16 : [],
    sesion_17 : [],
    sesion_18 : [],
    sesion_19 : [],
  };


  minValue: number = 0;
  maxValue: number = 300000;
  options: Options = {
    floor: 0,
    ceil: 500000
  };
  estadoProducto: any;
  page_size: number = 10;
  page_number: number = 1;
  pages: any;
  productos = [];
  marcas = [];
  filter_marcas = [];
  filter_categorias = [];
  filter_precio = '[]';
  filter_estadoPrducto = [];
  filter_dscuentoPrducto = [];
  filter_order = null;
  categorias_prin = [];
  filtros = null;
  filtros_check = [];
  view_active = 1;
  cantidad = 1;
  id_prd_vstaprev : any = 21;
  checkMarcas: any;
  carritoAnterior = [];
  addProductoCarrito = [];
  usuario: any;
  condicionBotonFavorito: any;
  todas:  any;
  talla: any;
  opcionSeleccionado: any;
  infoExtraer: any;
  imagenCategorias: any;
  descuentosProductos: any;
  codigoFiltro: any;
  dataImagenesBanner: any;
  constructor(
    private http: SendHttpData,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private alertaS: AlertasService,
    private ruta: Router,
    private loginGlobal: LoginGlobalService,
    private variablesGl: VariablesService,
    private favorito: FavoritosService
  ) {
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {

    localStorage.removeItem('favoritos');
    this.getDisenoHome();
    this.activatedRoute.params.subscribe(value => {

      this.codigoFiltro = value.id;

      if (value.id) {
        this.llamarMarcasUrl(value.id);

      }
      this.checkMarcas = value.marca;
      this.getProducts();
    });

    if (!this.codigoFiltro) {
      this.getProducts();
    }


    this.getCategories();
    this.getMarcas();

    if (this.codigoFiltro == '05') {
        this.filter_estadoPrducto = [1]
        this.setFilter();
    }
    // this.getFiltersValue();

    this.estadoProducto = [
      {
        id: 1,
        nombre: 'Nuevo'
      },
      {
        id: 2,
        nombre: 'Normal'
      },
    ];

    this.descuentosProductos = [
      {
        id: 1,
        nombre: 'Si'
      }, {
        id: 2,
        nombre: 'No'
      }
    ];
  }

  listarCategoriasBaner(val) {
    this.http.httpGet('categorias-productos-banner').toPromise().then(respuesta => {
      this.dataImagenesBanner = respuesta['data'];
       let dataFinal =  this.dataImagenesBanner.filter(datos => datos.id_categoria  == val);
      this.imagenCategorias = dataFinal[0]['img'];
    });


  }

  llamarMarcasUrl(id) {

    this.listarCategoriasBaner(id);

    this.http.httpGetParamt('categorias-productos', id).toPromise().then(respuesta => {
      this.infoExtraer = respuesta[`data`]['codigo_cat'];

      this.infoExtraer = this.infoExtraer.substring(0, 3);

      if (this.infoExtraer == 'H01') {
        this.changeCategorie(true, 2);
        this.filter_estadoPrducto = null;
      }else if (this.infoExtraer == 'M02') {
        this.changeCategorie(true, 11);
        this.filter_estadoPrducto = null;
      }else if (this.infoExtraer == 'K03') {
        this.changeCategorie(true, 19);
        this.filter_estadoPrducto = null;
      }
    }).catch(error => {
      console.log(error);
    });

  }

  // Cambio de vistas
  changeView(view){
    this.view_active = view;
  }

  // Productos
  getProducts(filter = null) {
    this.http.httpGet('productos').subscribe(
      response => {
        this.productos = response;
        this.calcularPaginas();
        this.calculoProductoResenia(this.productos['id_producto']);
      },
      error => { console.error("error." + error); }
    );
  }

  // Marcas
  getMarcas() {
    this.http.httpGet('marcas').subscribe(
      response => {
        var data = response.marcas;
        this.marcas = data;
      },
      error => { console.log("error." + error); }
    );
  }

  changeMarca($event, id) {

    if ($event.checked) {
      if (this.filter_marcas == null) {
        this.filter_marcas = [id];
      } else {
        this.filter_marcas.push(id);
      }
    } else {
      for (let i = 0; i < this.filter_marcas.length; i++) {
        if (this.filter_marcas[i] == id) {
          this.filter_marcas.splice(i, 1);
        }
      }
    }
    this.addPrice();
    this.setFilter();
  }

  // Categorias
  getCategories() {
    this.http.httpGet('categorias').subscribe(
      response => {
        var data = response.categorias;
        var categorias = [];
        data.forEach((element) => {
          if (element.id_parent == 1) {
            categorias.push({ id_categoria: element.id_categoria, name_cat: element.name_cat });
          }
        });
        this.categorias_prin = categorias;
      },
      error => { console.log("error." + error); }
    );
  }

  changeCategorie($event, id) {

    this.listarCategoriasBaner(id);


    if ($event.checked) {
      if (this.filter_categorias == null) {
        this.filter_categorias = [id];
      } else {
        this.filter_categorias.push(id);
      }
    } else {
      for (let i = 0; i < this.filter_categorias.length; i++) {
        if (this.filter_categorias[i] == id) {
          this.filter_categorias.splice(i, 1);
        }
      }
    }
    this.addPrice();
    this.setFilter();
  }

  // Precio
  addPrice() {
    var filter = "[" + this.minValue + "," + (this.maxValue+1) + "]";
    this.filter_precio = filter;
    this.setFilter();
  }

  clearPrice(){
    this.minValue = 0;
    this.maxValue = 300000;
    this.filter_precio = "[]";
    this.getProducts();
  }

  // Ordenar precios de mayor a menor o viceversa.
  orderPrice(val) {
    if (val.target.value != '') {
      this.filter_order = val.target.value;
    }else{
      this.filter_order = null;
    }
    this.setFilter();
  }

  // Filtros
  setFilter(){ // cambiar filtros
    let filtro: any;
    let data: any;

    if (this.filter_order != null) {
      // params += "&orderProd=" + this.filter_order;
      data = {
        marcas: this.filter_marcas,
        categorias: this.filter_categorias,
        estado: this.filter_estadoPrducto,
        precio: this.filter_precio,
        orderProd: this.filter_order,
        descuento: this.filter_dscuentoPrducto,
        combinaciones: null,
      }
    } else {
      data = {
        marcas: this.filter_marcas,
        categorias: this.filter_categorias,
        estado: this.filter_estadoPrducto,
        precio: this.filter_precio,
        orderProd: '',
        descuento: this.filter_dscuentoPrducto,
        combinaciones: null,
      }
    }

    //var params = "?marcas=["+ this.filter_marcas +"]&categorias=["+ this.filter_categorias+"]&precio="+this.filter_precio;
   /*var params = "?marcas=["+
      this.filter_marcas +"]&categorias=["+
      this.filter_categorias+ "]&estado=["+
      this.filter_estadoPrducto
      + "]&precio="+this.filter_precio;

    if (this.filter_order != null) {
      params += "&orderProd=" + this.filter_order;
    }*/

    this.http.httpPost('filters' , data).subscribe(
      response => {
        this.productos = response;
        this.calcularPaginas();
      },
      error => {

      }
    );
  }

  //Cantidad vista previa
  changeCantidad(sum){
    if (sum) {
      this.cantidad = this.cantidad + 1;
    }else{
      if (this.cantidad > 1) {
        this.cantidad = this.cantidad - 1;
      }
    }
  }

  /*
    PAGINACION
  */
  // Cambia la cantidad de productos a mostrar.
  changePaginate(value) {
    this.page_size = value;
    this.page_number = 1;
    this.calcularPaginas();
  }

  // Calcula las paginas totales que existen.
  calcularPaginas() {
    var cant_pages = Math.ceil(this.productos.length / this.page_size);

    this.pages = {
      first_page : 1,
      last_page : cant_pages,
      max_pages : 6
    }
    // this.pages = cant_pages;
  }

  // Cambia de pagina.
  changePage(page, left = null, right = null) {
    if (page != null) {
      this.page_number = page;
      // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
      var ultimo_tramo = this.pages.last_page - 5;
      var first_page : any;
      // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
      if (this.page_number >= ultimo_tramo) {
        first_page = ultimo_tramo;
      }else{
        first_page = this.page_number;
      }
      this.pages = {
        first_page : first_page,
        last_page : this.pages.last_page,
        max_pages : 6
      }
    }

    if (left) {
      var total_pages = Math.ceil(this.productos.length / this.page_size);
      if (this.page_number > 1 && this.page_number <= total_pages) {
        this.page_number = this.page_number - 1;
        // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
        var ultimo_tramo = this.pages.last_page - 5;
        var first_page : any;
        // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
        if (this.page_number >= ultimo_tramo) {
          first_page = ultimo_tramo;
        }else{
          first_page = this.page_number;
        }

        this.pages = {
          first_page : first_page,
          last_page : this.pages.last_page,
          max_pages : 6
        }
      }
    }

    if (right) {
      var total_pages = Math.ceil(this.productos.length / this.page_size);
      if (this.page_number < total_pages) {
        this.page_number = this.page_number + 1;
        // ultimas 6 paginas restantes. Se le resta 5 porque no se cuenta el mismo.
        var ultimo_tramo = this.pages.last_page - 5;
        var first_page : any;
        // Si la pagina a ver es mayor o igual al ultimo tramo de paginas restantes. Se planta en el ultimo tramo.
        if (this.page_number >= ultimo_tramo) {
          first_page = ultimo_tramo;
        }else{
          first_page = this.page_number;
        }
        this.pages = {
          first_page : first_page,
          last_page : this.pages.last_page,
          max_pages : 6
        }

      }
    }

    $('body, html').animate({
      scrollTop: '0px'
    }, 300);

  }


  agregarProductosAlCarrito(producto) {

    if (!this.opcionSeleccionado) {
      this.alertaS.showToasterError('Debes seleccionar una talla');
      return;
    }

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));

    if (this.cantidad > 0) {

      producto['cantidad'] = this.cantidad;
      producto['talla'] = this.opcionSeleccionado;
      producto['precio'] = producto['precio_descuento']?producto['precio_descuento'] : producto['precio_impuesto'];
      this.addProductoCarrito.push(producto);

      if (this.addProductoCarrito) {
        if (this.carritoAnterior) {
        } else {
          this.carritoAnterior = [];
        }

        this.carritoAnterior.push(producto);
        localStorage.setItem('athletic', JSON.stringify(this.carritoAnterior));
      }


      this.addProductoCarrito = [];
      this.cantidad = 1;

      this.alertaS.showToasterFull(`Articulo Agregado Corectamente`);


    } else {
      this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidad}`);
    }
    this.variablesGl.changeMessage();
    this.agregarABolsa(producto['id_producto']);
  }


  agregarProductoFavorito(producto) {
    const data = {
      usuario: this.usuario.id_cliente,
      producto: producto.id_producto
    };

    this.http.httpPost('agregar-productos-favorito', data).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.favorito.changeMessage();
        this.alertaS.showToasterFull(`Articulo agregado a favoritos`);
      }
    }).catch(error => {

    })
  }

  ingresar() {
    this.ruta.navigate(['login-movil']);
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }


  calculoProductoResenia(producto) {

    const data = {
      producto: producto
    };
    this.http.httpPost('pintar-calculo-por-productos', data).toPromise().then(respuesta => {
      this.todas  = respuesta['todas'];


    }).catch(error =>{

    })
  }

  checkearTalla(evento) {
      this.opcionSeleccionado = evento;
  }
  agregarABolsa(producto) {
    const dialogRef = this.dialog.open(AgregarCarritoComponent, {
      width: '900px',
      data: {id: producto}
    });
  }

  productosNuevos($event, estado) {


    if ($event.checked) {
      if (this.filter_estadoPrducto == null) {
        this.filter_estadoPrducto = [estado];
      } else {
        this.filter_estadoPrducto.push(estado);
      }
    } else {
      for (let i = 0; i < this.filter_estadoPrducto.length; i++) {
        if (this.filter_estadoPrducto[i] == estado) {
          this.filter_estadoPrducto.splice(i, 1);
        }
      }
    }
    this.addPrice();
    this.setFilter();
  }

  productosDescuentos($event, estado) {


    if ($event.checked) {
      if (this.filter_dscuentoPrducto == null) {
        this.filter_dscuentoPrducto = [estado];
      } else {
        this.filter_dscuentoPrducto.push(estado);
      }
    } else {
      for (let i = 0; i < this.filter_dscuentoPrducto.length; i++) {
        if (this.filter_dscuentoPrducto[i] == estado) {
          this.filter_dscuentoPrducto.splice(i, 1);
        }
      }
    }
    this.addPrice();
    this.setFilter();
  }


  getDisenoHome(){
    this.http.httpGet('disenoHome').subscribe(
      response => {
        this.disenoHome = response['sesion_19'];
      },
      error => {
        console.error("Error en el diseño.");
      }
    );
  }
}
