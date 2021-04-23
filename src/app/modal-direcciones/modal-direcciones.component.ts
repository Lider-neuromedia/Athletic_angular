import {Component, Inject, OnInit} from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Direcciones} from "../interfaz/direcciones";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {ActivatedRoute} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";
import Swal from "sweetalert2";
@Component({
  selector: 'app-modal-direcciones',
  templateUrl: './modal-direcciones.component.html',
  styleUrls: ['./modal-direcciones.component.css']
})
export class ModalDireccionesComponent implements OnInit {
  usuario: any;
  direcciones: Direcciones;
  departamentos: any;
  ciudades: any;
  capturarDepartamento: any;
  codigoDepartamento: any;
  codigoCiudad: any;
  codigo: any;

  keywordDepartamento = 'nombre';
  keywordCiudad = 'nombre';
  data = [
    {
      id: 1,
      name: 'Usa'
    },
    {
      id: 2,
      name: 'England'
    }
  ];


  constructor(
    private setHtpp: SendHttpData,
    private route_params: ActivatedRoute,
    private loginGlobal: LoginGlobalService,
    private alertaService: AlertasService,
    private favoritoSe: FavoritosService,
    public dialogRef: MatDialogRef<ModalDireccionesComponent>,
    @Inject(MAT_DIALOG_DATA) public infor: any) {
    this.llamarDatoLocalesUsuario();
    console.log(this.infor.direccion);

    if (this.infor.direccion) {
      this.editarDirecciones(this.infor.direccion);
    }
  }

  ngOnInit(): void {

    this.codigoDepartamento = null;

    this.losDepartamentos();
    this.direcciones = {
      ciudad_codigo: null,
      cliente_codigo: null,
      direccion_barrio: null,
      direccion_celular: null,
      direccion_codigo: null,
      direccion_telefono: null,
      direccion_ubicacion: null,
      direccion_estado: 0,
      direccion_nombre: null,
      direccion_visible: 1,
      usuario_nombre: null,
      usuario_apellido: null,
      direccion_lugar: null,
      usuario_recibir_informacion: null,
    }
    this.codigo = this.route_params.snapshot.params.id
    if(this.codigo) {
      this.editarDirecciones(this.route_params.snapshot.params.id);
    }

  }



  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }



  losDepartamentos() {
    this.setHtpp.httpGet('listar-departamento-direcciones').toPromise().then(respuesta => {
      this.departamentos = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })
  }

  onchangeCiudades() {
    this.setHtpp.httpGetParamt('listar-ciudades-direcciones', this.codigoDepartamento).toPromise().then(respuesta => {
      this.ciudades = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })

  }



  selectEventCiudad(item) {
    // do something with selected item
    this.direcciones.ciudad_codigo = item.id_ciudad;
  }


  crearDirecciones() {
    this.direcciones.cliente_codigo =   this.usuario.id_cliente;
    this.direcciones.direccion_celular = this.direcciones.direccion_celular.toString();

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Deseas dejar esta dirección como predeterminada?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si' ,
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.direcciones.direccion_estado = 1;
        this.setHtpp.httpPost('crear-direcciones', this.direcciones).toPromise().then(respuesta => {
          if (respuesta[`estado`]) {
            this.alertaService.showToasterFull(respuesta[`data`]);
            this.favoritoSe.changeMessage();
            this.onNoClick();
          } else {
            this.alertaService.showToasterError(respuesta[`data`]);
          }
        }).catch(error => {
          console.log(error);
        })
      } else {
        this.direcciones.direccion_estado = 0;
        this.setHtpp.httpPost('crear-direcciones', this.direcciones).toPromise().then(respuesta => {
          if (respuesta[`estado`]) {
            this.alertaService.showToasterFull(respuesta[`data`]);
            this.favoritoSe.changeMessage();
            this.onNoClick();
          } else {
            this.alertaService.showToasterError(respuesta[`data`]);
          }
        }).catch(error => {
          console.log(error);
        })
      }
    })


    console.log( this.direcciones.direccion_estado);
    return;


  }

  editarDirecciones(value) {
    const data = {
      direccion: value
    }
    this.setHtpp.httpPost('editar-direcciones', data).toPromise().then(respuesta => {
      console.log(respuesta);
      let idDepartamento: number = respuesta['data']['id_ciudad'];
      this.direcciones.direccion_nombre = respuesta['data']['direccion_nombre'];
      this.direcciones.direccion_codigo = respuesta['data']['direccion_codigo'];
      this.direcciones.direccion_telefono = respuesta['data']['direccion_telefono'];
      this.direcciones.direccion_celular = respuesta['data']['direccion_celular'];
      this.direcciones.direccion_barrio = respuesta['data']['direccion_barrio'];
      this.direcciones.direccion_ubicacion = respuesta['data']['direccion_ubicacion'];
      this.direcciones.ciudad_codigo = respuesta['data']['id_ciudad'];

      this.direcciones.usuario_nombre = respuesta['data']['usuario_nombre'];
      this.direcciones.usuario_apellido = respuesta['data']['usuario_apellido'];
      this.direcciones.direccion_lugar = respuesta['data']['direccion_lugar'];
      this.direcciones.usuario_recibir_informacion = respuesta['data']['usuario_recibir_informacion'];
      this.direcciones.direccion_estado = respuesta['data']['direccion_estado'];
      this.codigoDepartamento = idDepartamento.toString().substring(0,2);
      this.onchangeCiudades();
      this.codigoCiudad = respuesta['data']['ciudad'];
      this.favoritoSe.changeMessage();
    }).catch(error => {
      console.log(error);
    });

  }
  actualizarDirecciones() {
    this.direcciones.cliente_codigo =   this.usuario.id_cliente;
    this.direcciones.direccion_celular = this.direcciones.direccion_celular.toString();
    this.setHtpp.httpPost('actualizar-direcciones', this.direcciones).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.alertaService.showToasterFull(respuesta[`data`]);
        this.onNoClick();
      } else {
        this.alertaService.showToasterError(respuesta[`data`]);
      }
    }).catch(error=> {
      console.log(error)
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  validarCampos() {
    if (this.direcciones.ciudad_codigo === null || this.direcciones.ciudad_codigo == null ||
        this.direcciones.direccion_barrio === null || this.direcciones.direccion_barrio == null ||
        this.direcciones.direccion_celular === null || this.direcciones.direccion_celular == null ||
        this.direcciones.direccion_lugar === null || this.direcciones.direccion_lugar == null ||
      this.direcciones.direccion_nombre === null || this.direcciones.direccion_nombre == null ||
      this.direcciones.direccion_ubicacion === null || this.direcciones.direccion_ubicacion == null ||
      this.direcciones.usuario_apellido === null || this.direcciones.usuario_apellido == null ||
      this.direcciones.usuario_nombre === null || this.direcciones.usuario_nombre == null ||
      this.direcciones.direccion_celular === null || this.direcciones.direccion_celular == null ||
      this.direcciones.direccion_estado  === null || this.direcciones.direccion_estado == null

    ) {
        return false;
    }else {
      return true;
    }
  }
}
