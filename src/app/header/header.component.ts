import {Component, EventEmitter, HostListener, Output, Renderer2} from '@angular/core';
import {SendHttpData} from '../tools/SendHttpData';
import {Router} from '@angular/router';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() openBolsa = new EventEmitter<boolean>();
  dataProductos: any;
  nameProducto: any;
  categorias = [];
  categorias_prin: any[];
  sub_categorias = null;
  categoria_select = null;
  usuario = null;
  scrolled = 1;
  disenoMenu = {
    column_1: [],
    column_2: []
  };
  carrito: any;
  carritoAnterior: any;
  cantidadCarrito: number = 0;
  favoritosCantidad: number;
  cantidadProductoReales: any;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const numb = window.scrollY;
    if (numb >= 50) {
      this.scrolled = 0;
    } else {
      this.scrolled = 1;
    }
  }
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
  };

  constructor(
    public router: Router,
    private http: SendHttpData,
    private render: Renderer2,
    private ruta: Router,
    private alertaS: AlertasService,
    private loginGlobal: LoginGlobalService,
    private variablesGl: VariablesService,
    private favoritoSe: FavoritosService) {
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {


    this.llamarDatoLocales();
    this.llamarDatosFavoritos();

    this.getCategories();
    this.getImagenesMenu();
    this.llamarDatoLocalesUsuario();
    this.getDisenoHome();
    this.perderFoco()


  }

  getCategories() {
    this.http.httpGet('categorias/cascade').subscribe(
      response => {
        var data = response.categorias;
        this.categorias_prin = data.hijos;
        console.log(this.categorias_prin);
        this.categorias = data.hijos;
        var cat_inicial = this.categorias_prin[0];
        this.changeSubCategoria(cat_inicial.id_categoria, cat_inicial.hijos);
      },
      error => { console.log("error." + error); }
    );
  }

  sonCategories(data, element) {
    var hijos = { parent: null, sons: [] };
    data.forEach(item => {
      if (element.id == item.id_parent) {
        hijos.parent = element.name[0]['value'];
        hijos.sons.push({ id: item.id, name: item.name[0]['value'] });
      }
    });
  }

  changeSubCategoria(id_padre, hijos){
    this.categoria_select = id_padre;
    this.sub_categorias = hijos;
  }

  getSons(data, id_padre){
    var hijos = [];
    data.forEach(element => {
      if(element.id_parent == id_padre) {
        var nietos = [];
        data.forEach(item => {
          if (element.id == item.id_parent) {
            nietos.push({ id: item.id, name: item.name[0]['value'] });
          }
        });
        hijos.push({ hijo: { id: element.id, name: element.name[0]["value"] }, nietos: nietos });
      }
    });
    return hijos;
  }

  toggleOpenBolsa() {
    this.openBolsa.emit(true);
  }

  cerrarSesion(){

    sessionStorage.clear();
    localStorage.removeItem('userAthletic');
    localStorage.removeItem('token');
    this.loginGlobal.changeMessage();
    this.usuario = null;

    this.llamarDatoLocalesUsuario();
    this.favoritosCantidad = null;
    this.router.navigate(['/']);
  }

  getImagenesMenu() {
    this.http.httpGet('disenoOneSesion/16').subscribe(
      response => {
        this.disenoMenu = response;
      },
      error => {
        console.error("Error en el diseño.");
      }
    );
  }


  llamarDatoLocales() {

    this.variablesGl.currentMessage.subscribe(response => {
      this.carritoAnterior = response;
      this.cantidadProductoRealesPedido();
    });

  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
      //this.contadorFavoritos();
      this.llamarDatosFavoritos();
    });

  }

  llamarDatosFavoritos() {
    if (this.usuario) {
    this.favoritoSe.currentMessage.subscribe(response => {
      let data = {
        cliente: this.usuario.id_cliente
      }
      this.http.httpPost('contar-numeros-favorito', data).toPromise()
        .then(respuesta => {
          this.favoritosCantidad = respuesta[`data`][0]['cantidad'];
        }).catch(error => {
        console.log(error);
      });
    });
  }
  }


  getDisenoHome(){
    this.http.httpGet('disenoHome').subscribe(
      response => {
        this.disenoHome = response['sesion_17'];
        // console.log(this.disenoHome);
      },
      error => {
        console.error("Error en el diseño.");
      }
    );
  }

  cantidadProductoRealesPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    if (valorTotalLista) {
      console.log(valorTotalLista);
      this.cantidadProductoReales = valorTotalLista?.length;
      // this.cantidadProductoReales = valorTotalLista.reduce((item1, item2) => {
      //   return item1 + item2.cantidad;
      // }, 0);
    } else {
      this.cantidadProductoReales = 0;
    }
    return this.cantidadProductoReales;
  }

  productosHome(producto, codigo) {


    this.nameProducto = producto.replace(/ /gi, '-');
    this.nameProducto =  this.nameProducto.toLowerCase();

    this.nameProducto = this.nameProducto.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    this.ruta.navigate(['/productos/'+ codigo + '/' + this.nameProducto])

    $('.dropdown-menu').toggleClass("activar");

  }

  abrirMegaMenu(){
    $('.dropdown-menu').toggleClass("activar");
  }

  perderFoco(){
    
  }
}

