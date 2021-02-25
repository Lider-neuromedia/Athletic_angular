import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import * as $ from "jquery";
import {ActivatedRoute, Router} from "@angular/router";
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";

@Component({
  selector: 'app-agregar-carrito',
  templateUrl: './agregar-carrito.component.html',
  styleUrls: ['./agregar-carrito.component.css']
})
export class AgregarCarritoComponent implements OnInit {
  producto: any;
  galleryImages: any;
  tallas = [];
  carritoAnterior = [];
  addProductoCarrito = [];
  cantidad =  1;
  usuario: any;
  condicionBotonFavorito: any;
  cantidadComentario: any;
  totalComentario: any;
  @Output() openBolsa = new EventEmitter<boolean>();
  constructor( public dialogRef: MatDialogRef<AgregarCarritoComponent>,
               public router:Router,
               public dialog: MatDialog,
               private route_params: ActivatedRoute,
               private http: SendHttpData,
               private alertaS: AlertasService,
               private activatedRoute: ActivatedRoute,
               private ruta: Router,
               private loginGlobal: LoginGlobalService,
               private variablesGl: VariablesService,
               @Inject(MAT_DIALOG_DATA) public infor: any) {

    this.llamarDatoLocalesUsuario();

    console.log(infor);
    this.getProducts(infor.id)
  }

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
  }

  getProducts(id) {
    console.log(id)
    this.http.httpGet('productos/' + id, null, false).subscribe(
      response => {
        this.producto = response;
        console.log( response );
        this.producto.precio = Math.round(this.producto.precio)
        $('#detalle').html(response.descripcion_prod);
        $('blockquote').addClass('col-md-4');
        var gallery = [];
        response.imagenes.forEach(element => {
          var img = {
            small: element.img,
            medium: element.img,
            big: element.img
          }

          gallery.push(img);
        });
        this.galleryImages = gallery;
      },
      error => { console.log("error." + error); }
    );

  }

   cerrarse(){
    window.close()
  }

  toggleOpenBolsa() {
    this.openBolsa.emit(true);
  }

  agregarProductosAlCarrito() {
    this.onNoClick();
    this.cantidad = 1;
    console.log(this.cantidad,  this.producto );

    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    console.log(this.carritoAnterior);

    if (this.cantidad > 0) {

      this.producto['cantidad'] = this.cantidad;
      this.addProductoCarrito.push(this.producto);
      console.log(this.addProductoCarrito);

      if (this.addProductoCarrito) {
        if (this.carritoAnterior) {
        } else {
          this.carritoAnterior = [];
        }

        this.carritoAnterior.push(this.producto);
        localStorage.setItem('athletic', JSON.stringify(this.carritoAnterior));
      }


      this.addProductoCarrito = [];
      this.cantidad = 1;

      this.alertaS.showToasterFull(`Articulo Agregado Corectamente`);


    } else {
      this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidad}`);
    }
    this.variablesGl.changeMessage();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  canastaDeCompra()   {
    this.onNoClick();

    this.ruta.navigate(['detalle-de-la-compra']);
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

}
