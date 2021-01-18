import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-resena',
  templateUrl: './resena.component.html',
  styleUrls: ['./resena.component.css']
})
export class ResenaComponent implements OnInit {
  productoResenia: any;
  usuario: any;
  url: any;
  pagina: number = 1;
  resultado: number = 10;
  totalPaginas: any;
  constructor(  private http: SendHttpData, private ruta: Router) {
    this.usuario = JSON.parse(localStorage.getItem('userAthletic'));
  }

  ngOnInit(): void {
      this.listarMisComentarios(this.pagina);
  }


  paginar(page: number) {
    this.pagina = page;
    this.listarMisComentarios(this.pagina);
  }

  listarMisComentarios(page: number) {

    const  data = {
      cliente: this.usuario.id_cliente
    }
    this.http.httpPost('listar-comentarios', data).toPromise().then(respesta => {
        console.log(respesta);
        this.url = respesta['url'];
        this.productoResenia = respesta['data'];
        this.totalPaginas = Math.round(this.productoResenia.length / this.resultado);
    }).catch(error=> {

    })

  }

  verProducto(codigo) {
      this.ruta.navigate(['detalle-producto/', codigo])
  }

  siguiente() {
    this.pagina++;
    this.listarMisComentarios(this.pagina)
  }
  anterior() {
    this.pagina--;
    this.listarMisComentarios(this.pagina)
  }

}
