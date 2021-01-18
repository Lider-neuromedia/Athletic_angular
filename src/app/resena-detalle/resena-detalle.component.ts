import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resena-detalle',
  templateUrl: './resena-detalle.component.html',
  styleUrls: ['./resena-detalle.component.css']
})
export class ResenaDetalleComponent implements OnInit {
  productoResenia: any;
  constructor() {


  }

  ngOnInit(): void {
    this.productoResenia = JSON.parse(localStorage.getItem('comentarioAtlhe'));
    console.log( this.productoResenia )
  }

}
