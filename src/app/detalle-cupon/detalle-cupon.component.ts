import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder} from "@angular/forms";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";

@Component({
  selector: 'app-detalle-cupon',
  templateUrl: './detalle-cupon.component.html',
  styleUrls: ['./detalle-cupon.component.css']
})
export class DetalleCuponComponent implements OnInit {
dataCupones: any;
textoInterfaz: any;
  constructor(
    private alertaS: AlertasService,
    private _formBuilder: FormBuilder,
    private setHtpp: SendHttpData,
    private ruta: Router,
    public dialogRef: MatDialogRef<DetalleCuponComponent>,
    @Inject(MAT_DIALOG_DATA) public infor: any
  ) {

    console.log(this.infor['datos']);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
    this.listaDetalleCupones();
  }

  listaDetalleCupones() {
      const data = {
        tipo: this.infor['datos']['cupon_tipodescuento'],
        cupon: this.infor['datos']['cupones_codigo'],
      }
    this.setHtpp.httpPost('listar-detalle-cupon', data).toPromise().then(respuesta => {
      console.log(respuesta);
      this.dataCupones = respuesta['data'];
      this.textoInterfaz = respuesta['mensaje'];
    });


  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
