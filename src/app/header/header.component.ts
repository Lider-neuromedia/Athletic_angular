import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnDestroy } from '@angular/core';
import { SendHttpData } from '../tools/SendHttpData';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVarService } from '../common/global-var.service';

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
  globalStorage : any; 
  usuario : any;
  scrolled = 1;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    const numb = window.scrollY;
    if (numb >= 50){
      this.scrolled = 0;
    }
    else {
      this.scrolled = 1;
    }
  }

  constructor(private globalVar : GlobalVarService, public router: Router, private http: SendHttpData, private render:Renderer2) { 
    this.globalStorage = this.globalVar.user.subscribe(
      value => {
        this.usuario = value;
      }
    );
  }

  ngOnInit(): void {
    this.getCategories();
    if (localStorage.getItem('user')) {
      this.usuario = JSON.parse(localStorage.getItem('user'));
    }
  }
  
  cerrarSesion(){
    localStorage.clear();
    this.globalVar.setUser(null);
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

  getCategories() {
    var filter_categories = "filter[id]=![1|2]";
    this.http.httpGet('categories', filter_categories).subscribe(
      response => {
        var data = response.categories;
        data.forEach((element) => {
          if (element.id_parent == 2) {
            var hijos = this.getSons(data, element.id);
            this.categorias.push({ padre: { id: element.id, name: element.name[0]['value'] }, hijos: hijos });
            this.categorias_prin.push({ id: element.id, name: element.name[0]['value'] });
          }
        });
        this.changeSubCategoria(10);
      },
      error => { console.log("error." + error); }
    );
  }

  changeSubCategoria(id_padre){
    this.categoria_select = id_padre;
    this.categorias.forEach(element => {
      if (element.padre.id == id_padre) {
        this.sub_categorias = null;
        this.sub_categorias = element.hijos;
      }
    });
  }

  getSons(data, id_padre) {
    var hijos = [];
    data.forEach(element => {
      if (element.id_parent == id_padre) {
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

  ngOnDestroy(): void {
    this.globalStorage.unsubscribe();
  }

}

