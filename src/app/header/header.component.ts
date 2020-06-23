import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SendHttpData } from '../tools/SendHttpData';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor(public router: Router, private http: SendHttpData, private render:Renderer2) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(sessionStorage.getItem('user')); 
    this.getCategories();
  }
  
  cerrarSesion(){
    sessionStorage.clear();
    this.usuario = null;
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

}

