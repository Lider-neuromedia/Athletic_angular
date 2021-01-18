import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";

@Component({
  selector: 'app-buscador-tienda',
  templateUrl: './buscador-tienda.component.html',
  styleUrls: ['./buscador-tienda.component.css']
})
export class BuscadorTiendaComponent implements OnInit {
  dataBuscador: any;
  recorerBusqueda: any;
  ocultar: any;
  producto: any;
  nameProducto: any;
  mostrarBuscador: boolean;
  url: any;
  bolsa = false;

  mostrarBusquedaVacias: boolean;
  constructor(    public router: Router,
                  private http: SendHttpData,
                  private render: Renderer2,
                  private alertaS: AlertasService,
                  private loginGlobal: LoginGlobalService,
                  private variablesGl: VariablesService) { }

  ngOnInit(): void {
    this.ocultar = false;
    this.dataBuscador = null;
    this.dataBuscador = '';
  }


  showSearchResults(event: any) {
    if (this.dataBuscador.length) {
      console.log(this.dataBuscador);

      const  data = {
        buscar: this.dataBuscador.toUpperCase()
      };

      console.log(data);

      this.http.httpPost('buscador-productos', data).toPromise().then(respuesta => {
        console.log(respuesta);

        if (respuesta['data'].length > 0) {
          console.log('asbdkabd k asd----------------false' );
          this.recorerBusqueda = respuesta['data'];
          this.url = respuesta['ruta'];
          document.getElementById('pintar-informacion');
          this.mostrarBusquedaVacias = false;
        } else {
          console.log('asbdkabd k asd----------------');
          this.recorerBusqueda = null;
          this.mostrarBusquedaVacias = true;
          //document.getElementById('pintar-informacion2');
        }

      }).catch(error => {
        console.log(error);
      });
    } else {
      this.recorerBusqueda = null;
      this.mostrarBusquedaVacias = false;
      document.getElementById('pintar-informacion');
      console.log('asbdkabd k asd');
    }

  }

  buscadorProductos(e) {
    console.log(this.dataBuscador);
  }

  ocultarInformacionBuscador() {
    this.ocultar =  true;

  }

  listadoProductoTotal(codigo, producto, categoria) {
    this.mostrarBuscador = false;
    console.log(codigo, producto, categoria);

    this.producto = producto.replace(/ /gi, '-');
    this.nameProducto =  this.producto.toLowerCase();

    this.nameProducto = this.nameProducto.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    // routerLink="/tienda-virtual/listado-producto/{{data['producto_codigo']}}/{{data['producto_nombre']}}"
    this.dataBuscador = null;
    this.recorerBusqueda = null;
    this.router.navigate(['/detalle-producto/'+codigo])



  }

}
