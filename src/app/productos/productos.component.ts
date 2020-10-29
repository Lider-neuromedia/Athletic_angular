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
  pages: any;
  productos = [];
  marcas = [];
  filter_marcas = [];
  filter_categorias = [];
  filter_precio = '[]';
  filter_order = null;
  categorias_prin = [];
  filtros = null;
  filtros_check = [];
  view_active = 2;
  cantidad = 1;
  
  id_prd_vstaprev : any = 21;

  constructor(private http: SendHttpData, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getMarcas();
    // this.getFiltersValue();
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

  // Obtener tarjetas de filtros -> Ejemplo: talla, color, etc...
  getFiltersValue() { 
    // inactivo por el momento.
   }

  // Productos  
  getProducts(filter = null) {
    this.http.httpGet('productos').subscribe(
      response => {
        this.productos = response;
        this.calcularPaginas();
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
    this.setFilter();
  }

  // Precio
  addPrice() {
    var filter = "[" + this.minValue + "," + (this.maxValue+1) + "]";
    this.filter_precio = filter;
    this.setFilter();
  }

  clearPrice(){
    this.filter_precio = "[]";
    this.setFilter();
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
  setFilter(){
    var params = "?marcas=["+ this.filter_marcas +"]&categorias=["+ this.filter_categorias+"]&precio="+this.filter_precio;
    if (this.filter_order != null) {
      params += "&orderProd=" + this.filter_order;
    }

    this.http.httpGet('filters' + params).subscribe(
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
        // console.log(first_page);
        this.pages = {
          first_page : first_page,
          last_page : this.pages.last_page,
          max_pages : 6
        }

      }
    }
  }

}
