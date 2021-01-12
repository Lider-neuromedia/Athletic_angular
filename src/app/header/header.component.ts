import {Component, EventEmitter, HostListener, Output, Renderer2} from '@angular/core';
import {SendHttpData} from '../tools/SendHttpData';
import {Router} from '@angular/router';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() openBolsa = new EventEmitter<boolean>();
  categorias = [];
  categorias_prin = [];
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const numb = window.scrollY;
    if (numb >= 50) {
      this.scrolled = 0;
    } else {
      this.scrolled = 1;
    }
  }

  constructor(
    public router: Router,
    private http: SendHttpData,
    private render: Renderer2,
    private alertaS: AlertasService,
    private loginGlobal: LoginGlobalService,
    private variablesGl: VariablesService) {
   // this.usuario = JSON.parse(localStorage.getItem('user'));
    //console.log(this.usuario);
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
    this.llamarDatoLocales();

    this.getCategories();
    this.getImagenesMenu();
    this.llamarDatoLocalesUsuario();

  }

  getCategories() {
    this.http.httpGet('categorias/cascade').subscribe(
      response => {
        var data = response.categorias;
        this.categorias_prin = data.hijos;
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
    this.loginGlobal.changeMessage();
    this.usuario = null;
    this.llamarDatoLocalesUsuario();
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
      //console.log(this.carritoAnterior);
    });

  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }



}

