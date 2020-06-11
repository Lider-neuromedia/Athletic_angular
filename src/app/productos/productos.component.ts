import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SendHttpData } from '../tools/SendHttpData';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  minValue: number = 50;
  maxValue: number = 200;
  options: Options = {
    floor: 0,
    ceil: 200
  };
  page_size: number = 5;
  page_number: number = 1;
  pages: number;
  productos = [];
  marcas = [];
  filter_marcas = null;
  filter_categorias = null;
  filter_products = [];
  categorias_prin = [];

  constructor(private http: SendHttpData) { }

  ngOnInit(): void {
    this.getProducts();
    this.getMarcas();
    this.getCategories();
  }

  // Productos  
  getProducts(filter = null) {

    this.http.httpGet('products', filter).subscribe(
      response => {
        var data = response.products;
        var products = [];
        data.forEach((element) => {
          var img = this.http.getImageProduct(element.id, element.id_default_image);
          var product = {
            id: element.id,
            name: element.name[0]['value'],
            marca: element.manufacturer_name,
            image: img,
            price: parseInt(element.price),
            new: (element.condition == "new") ? true : false
          };
          products.push(product);
        });
        this.productos = products;
        this.calcularPaginas();
      },
      error => { console.log("error." + error); }
    );
  }

  // Marcas
  getMarcas() {
    var asc_name = 'sort=[name_ASC]';
    this.http.httpGet('manufacturers', asc_name).subscribe(
      response => {
        var data = response.manufacturers;
        var marcas = [];
        data.forEach((element) => {
          var marca = {
            id: element.id,
            name: element.name,
          };
          marcas.push(marca);
        });
        this.marcas = marcas;
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
    var string = this.filter_marcas.join('|');

    if (this.filter_marcas.length >= 1) {
      this.concatFiltersProducts(string, 'id_manufacturer');
    } else {
      this.concatFiltersProducts(null, 'id_manufacturer');
    }
  }

  // Categorias
  getCategories() {
    var filter_categories = "filter[id]=![1|2]";
    this.http.httpGet('categories', filter_categories).subscribe(
      response => {
        var data = response.categories;
        var categorias = [];
        data.forEach((element) => {
          if (element.id_parent == 2) {
            categorias.push({ id: element.id, name: element.name[0]['value'] });
          }
        });
        this.categorias_prin = categorias;
        console.log(this.categorias_prin);
      },
      error => { console.log("error." + error); }
    );
  }

  changeCategorie($event, id) {
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
    var string = this.filter_categorias.join('|');

    if (this.filter_categorias.length >= 1) {
      this.concatFiltersProducts(string, 'id_category_default');
    } else {
      this.concatFiltersProducts(null, 'id_category_default');
    }

  }

  concatFiltersProducts(string_concat, attr_filter) {
    var send_filter = null;
    console.log(string_concat, attr_filter);
    if (string_concat == null) {
      delete this.filter_products[attr_filter];
    }else{
      this.filter_products[attr_filter] = string_concat;
    }
    
    console.log(this.filter_products);
    Object.keys(this.filter_products).filter((key, index) => {
      if (index == 0) {
          send_filter = "filter[" + key + "]=" + "[" + this.filter_products[key] + "]";
      } else {
          send_filter = send_filter + "&filter[" + key + "]=" + "[" + this.filter_products[key] + "]";
      }
    });
    
    // console.log(send_filter);
    this.getProducts(send_filter);
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
    this.pages = cant_pages;
  }

  // Cambia de pagina. 
  changePage(page, left = null, right = null) {
    if (page != null) {
      this.page_number = page;
    }

    if (left) {
      var total_pages = Math.ceil(this.productos.length / this.page_size);
      console.log(this.page_number, total_pages);
      if (this.page_number > 1 && this.page_number <= total_pages) {
        this.page_number = this.page_number - 1;
      }
    }

    if (right) {
      var total_pages = Math.ceil(this.productos.length / this.page_size);
      if (this.page_number < total_pages) {
        this.page_number = this.page_number + 1;
      }
    }
  }


}
