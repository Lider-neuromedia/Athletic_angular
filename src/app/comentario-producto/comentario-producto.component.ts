import { Component, OnInit, Inject  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SendHttpData} from "../tools/SendHttpData";
import {AlertasService} from "../servicio/alertas/alertas.service";
@Component({
  selector: 'app-comentario-producto',
  templateUrl: './comentario-producto.component.html',
  styleUrls: ['./comentario-producto.component.css']
})
export class ComentarioProductoComponent implements OnInit {

  color1: any;
  color2: any;
  color3: any;
  color4: any;
  color5: any;

  texto: any;
  colorTexto: any;
  almacenarDatos: any;
  usuario: any;

  constructor(
    private setHtpp: SendHttpData,
    private alertaS: AlertasService,
    public dialogRef: MatDialogRef<ComentarioProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public infor: any
  ) {
    console.log(infor);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });

  }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('userAthletic'));
    this.color1 = '#b3aeae';
    this.color2 = '#b3aeae';
    this.color3 = '#b3aeae';
    this.color4 = '#b3aeae';
    this.color5 = '#b3aeae';

    this.almacenarDatos = {
      calificacion: null,
      titulo: null,
      descripcion: null,
      usuario: null,
      producto: null,
      estado: 0,
    }
  }

  calificacion(valor){

    if (valor === 1) {
      this.color1 = '#ea2840';
      this.color2 = '#b3aeae';
      this.color3 = '#b3aeae';
      this.color4 = '#b3aeae';
      this.color5 = '#b3aeae';
      this.texto = 'No me gustó';
      this.colorTexto = '#ea2840';

    }
    if (valor === 2) {
      this.color1 = '#ffd000';
      this.color2 = '#ffd000';
      this.color3 = '#b3aeae';
      this.color4 = '#b3aeae';
      this.color5 = '#b3aeae';
      this.texto = 'Regular';
      this.colorTexto = '#b3aeae';
    }
    if (valor === 3) {
      this.color1 = '#ffd000';
      this.color2 = '#ffd000';
      this.color3 = '#ffd000';
      this.color4 = '#b3aeae';
      this.color5 = '#b3aeae';
      this.texto = 'Está bien';
      this.colorTexto = '#b3aeae';
    }
    if (valor === 4) {
      this.color1 = '#45a00a';
      this.color2 = '#45a00a';
      this.color3 = '#45a00a';
      this.color4 = '#45a00a';
      this.color5 = '#b3aeae';
      this.texto = 'Me gustó';
      this.colorTexto = '#45a00a';
    }
    if (valor === 5) {
      this.color1 = '#45a00a';
      this.color2 = '#45a00a';
      this.color3 = '#45a00a';
      this.color4 = '#45a00a';
      this.color5 = '#45a00a';
      this.texto = 'Me encantó';
      this.colorTexto = '#45a00a';
    }

    this.almacenarDatos.calificacion = valor;
    console.log(valor);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  crearCalificacionUsuario() {
    console.log(this.infor['datos']['id_producto'], this.infor['datos']);
    this.almacenarDatos.usuario =  this.usuario.id_cliente;
    this.almacenarDatos.producto = this.infor['datos']['id_producto'];
    console.log(this.almacenarDatos);
    this.setHtpp.httpPost('crear-comentarios', this.almacenarDatos).toPromise().then(respuesta => {
      this.alertaS.showToasterFull(respuesta['mensaje']);
    }).catch(error => {
      console.log( error);
    })

  }

}
