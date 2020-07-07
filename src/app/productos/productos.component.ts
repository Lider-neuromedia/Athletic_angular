import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SendHttpData } from '../tools/SendHttpData';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {VistaPreviaComponent} from '../vista-previa/vista-previa.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  minValue: number = 0;
  maxValue: number = 300000;
  options: Options = {
    floor: 0,
    ceil: 500000
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
  filtros = null;
  filtros_check = [];
  view_active = 2;
  cantidad = 1;
  descuento = null;
  valor_ant = null;
  precio_desc = null;
  descuentos =  {
    descuento: null, 
    valor_ant : null, 
    precio_des : null
  }
  id_prd_vstaprev : any = 21;

  constructor(private http: SendHttpData, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProducts();
    this.getMarcas();
    this.getCategories();
    this.getFiltersValue();
  }

  openDialog() {
    const dialogRef = this.dialog.open(VistaPreviaComponent, {
      width: '800px',
      data: {id: this.id_prd_vstaprev}
    });
  }

  // Cambio de vistas
  changeView(view){
    this.view_active = view;
  }
  // Obtener tarjeta de filtros.
  getFiltersValue() {
    this.http.httpGet('product_options').subscribe(
      response => {
        var data = response.product_options;
        var filtros = [];
        data.forEach(element => {
          var search = "display=[id,id_attribute_group, name]&filter[id_attribute_group]=" + element.id;
          var filter = {id : element.id, name: element.name[0]['value'], valores: null};
          this.http.httpGet('product_option_values', search).subscribe(
            response => {
              var data = response.product_option_values;
              var values = [];
              data.forEach(element => {
                var value = {
                  id: element.id,
                  name: element.name[0]['value']
                };
                values.push(value);
              });
      
              filter.valores = values;
              filtros.push(filter);
            },
            error => { console.log("error." + error); }
          );
        });
        this.filtros = filtros;
      },
      error => { console.log("error." + error); }
    );
  }

  async getDescuento(id, price) {
    return await this.http.httpGet('specific_prices/', 'filter[id_product]=' + id).toPromise().then(
      response => {
        if (response.length != 0) {
          var precios = response.specific_prices[0];
          this.descuento = precios.reduction;
          this.valor_ant = parseInt(price),
          this.precio_desc = this.valor_ant - (this.valor_ant * this.descuento);
          this.descuentos = {
            descuento: this.descuento, 
            valor_ant : this.valor_ant, 
            precio_des : this.precio_desc
          };
        }else{
          this.descuentos =  {
            descuento: null, 
            valor_ant : null, 
            precio_des : null
          }
        }
        return this.descuentos;
      },
      error => {

      }
    );
  }

  // Productos  
  getProducts(filter = null) {
    this.http.httpGet('products', filter).subscribe(
      response => {
        if (response.products != undefined) {
          var data = response.products;
          var products = [];
          data.forEach((element) => {
            var img = this.http.getImageProduct(element.id, element.id_default_image);
            var product = {
              id: element.id,
              name: element.name[0]['value'],
              marca: element.manufacturer_name,
              image: img,
              price: null,
              new: (element.condition == "new") ? true : false,
              product_asoc: element.associations.product_option_values,
              descuento : null, 
              price_ant : null
            };
            var descuento = this.getDescuento(element.id, element.price);
            descuento.then(res => {
              product.price = (this.descuentos.precio_des == null) ? parseInt(element.price) : this.descuentos.precio_des;
              product.descuento = this.descuentos.descuento * 100;
              product.price_ant = this.descuentos.valor_ant;
            });
            products.push(product);
          });
          this.productos = products;
          if (this.filtros_check.length >= 1) {
            this.filterCombinations();
          }
          this.page_number = 1;
          this.calcularPaginas();
        }else{
          this.productos = [];
        }
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

  // Precio
  addPrice() {
    var filter = "filter[price]=>[" + this.minValue + "]&filter[price]=<[" + (this.maxValue+1) + "]";
    this.concatFiltersProducts(filter, 'price', true);
  }

  orderPrice(val) {
    if (val.target.value != '') {
      var filter = "price_" + val.target.value;
      this.concatFiltersProducts(filter, 'price', false);
    }else{
      this.concatFiltersProducts(null, 'price', false);
    }
  }


  concatFiltersProducts(string_concat, attr_filter, price = false) {
    var send_filter = null;
    if (string_concat == null) {
      delete this.filter_products[attr_filter];
    } else {
      this.filter_products[attr_filter] = string_concat;
    }
    Object.keys(this.filter_products).filter((key, index) => {
      console.log(this.filter_products, key, index);
      if (index == 0) {
        if (this.filter_products[key] == "price_ASC" || this.filter_products[key] == "price_DESC") {
          send_filter = "sort=" + "[" + this.filter_products[key] + "]";
        }else{
          send_filter = "filter[" + key + "]=" + "[" + this.filter_products[key] + "]";
          if (price) {
            send_filter = string_concat;
          }
        }
      } else {
        if (this.filter_products[key] == "price_ASC" || this.filter_products[key] == "price_DESC") {
          send_filter = "&sort=" + "[" + this.filter_products[key] + "]";
        }else{
          send_filter = send_filter + "&filter[" + key + "]=" + "[" + this.filter_products[key] + "]";
          if (price) {
            send_filter = "&" + string_concat;
          }
        }
      }
    });
    
    // console.log(send_filter);
    this.getProducts(send_filter);
    this.filterCombinations();
  }

  // Filtros combinaciones
  changeFilter($event, id){
    if ($event.checked) {
      this.filtros_check.push(id);
      return this.filterCombinations();
    }else{
      for (let i = 0; i < this.filtros_check.length; i++) {
        if (this.filtros_check[i] == id) {
          this.filtros_check.splice(i, 1);
        }
      }
      this.concatFiltersProducts(null, null);
    }

  }

  filterCombinations(){
    var productos_filt = [];
    for (let i = 0; i < this.productos.length; i++) {
      if(this.productos[i]['product_asoc'] != undefined){
        var contador = 0;
        
        this.productos[i]['product_asoc'].forEach((item) =>{
          for (let j = 0; j < this.filtros_check.length; j++) {
            if (item.id == this.filtros_check[j]) {
              contador++;
            }
          }
        });

        if (contador == this.filtros_check.length) {
          productos_filt.push(this.productos[i]);
        }
      }
    }
    this.productos = productos_filt;
    this.page_number = 1;
    this.calcularPaginas();
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
