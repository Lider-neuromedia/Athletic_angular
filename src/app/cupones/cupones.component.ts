import { Component, OnInit } from '@angular/core';
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder} from "@angular/forms";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";
import {GlobalVarService} from "../common/global-var.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {ComentarioProductoComponent} from "../comentario-producto/comentario-producto.component";
import {MatDialog} from '@angular/material/dialog';
import {DetalleCuponComponent} from "../detalle-cupon/detalle-cupon.component";
@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.css']
})
export class CuponesComponent implements OnInit {
listaCupones: any;
  usuario: any;
  constructor(
    private variablesGl: VariablesService,
    private alertaS: AlertasService,
    private _formBuilder: FormBuilder,
    private setHtpp: SendHttpData,
    private ruta: Router,
    public globalVar: GlobalVarService,
    private loginGlobal: LoginGlobalService,
    public dialog: MatDialog,
  ) {

    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
    this.listarLosCupones();
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });
  }

  listarLosCupones()  {

    let data = {
      usuario: this.usuario.id_cliente
    }

    this.setHtpp.httpPost('listar-cupones-tienda', data).toPromise().then(respuesta => {
      this.listaCupones  = respuesta['data'];

      console.log( this.listaCupones);
    }).catch(error => {

    })
  }

  openDialog(item) {

    const dialogRef = this.dialog.open(DetalleCuponComponent, {
      width: '700px',
      data: {datos: item}
    });

    dialogRef.afterClosed().subscribe(art => {
      if (art != undefined)
        console.log(art);
    });

  }

}
