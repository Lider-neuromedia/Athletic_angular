import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Direcciones} from "../interfaz/direcciones";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {
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
    private alertaService: AlertasService) {
    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
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

  selectEventDepartamento(item) {
    // do something with selected item
    console.log('item', item);
    this.capturarDepartamento = item.id;
    console.log('item', item, this.capturarDepartamento);
  }

  onChangeSearchDepartamento(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);
    const data = {
      departamento: val
    }

    this.setHtpp.httpPost('listar-departamento-direcciones', data).toPromise().then(respuesta => {
      console.log(respuesta);
      this.departamentos = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })
  }

  onFocusedDepartamento(e){
    // do something when input is focused
    console.log('e', e);
  }

  selectEventCiudad(item) {
    // do something with selected item
    this.direcciones.ciudad_codigo = item.id_ciudad;
    console.log(this.direcciones);
  }

  onChangeSearchCiudad(val: string) {

    console.log(val);
    const data = {
      departamento: this.capturarDepartamento,
      ciudad: val
    }

    this.setHtpp.httpPost('listar-ciudades-direcciones', data).toPromise().then(respuesta => {
      console.log(respuesta);
      this.ciudades = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })
  }

  onFocusedCiudad(e){
    // do something when input is focused
  }

  crearDirecciones() {
    this.direcciones.cliente_codigo =   this.usuario.id_cliente;
    this.setHtpp.httpPost('crear-direcciones', this.direcciones).toPromise().then(respuesta => {
      console.log(respuesta);
      if (respuesta[`estado`]) {
        this.alertaService.showToasterFull(respuesta[`data`]);
      } else {
        this.alertaService.showToasterError(respuesta[`data`]);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  editarDirecciones(value) {
    const data = {
      direccion: value
    }
    this.setHtpp.httpPost('editar-direcciones', data).toPromise().then(respuesta => {
      console.log(respuesta);

      this.direcciones.direccion_nombre = respuesta['data'][0]['direccion_nombre'];
      this.direcciones.direccion_codigo = respuesta['data'][0]['direccion_codigo'];
      this.direcciones.direccion_telefono = respuesta['data'][0]['direccion_telefono'];
      this.direcciones.direccion_celular = respuesta['data'][0]['direccion_celular'];
      this.direcciones.direccion_barrio = respuesta['data'][0]['direccion_barrio'];
      this.direcciones.direccion_ubicacion = respuesta['data'][0]['direccion_ubicacion'];
      this.direcciones.ciudad_codigo = respuesta['data'][0]['ciudad_codigo'];

      this.direcciones.usuario_nombre = respuesta['data'][0]['usuario_nombre'];
      this.direcciones.usuario_apellido = respuesta['data'][0]['usuario_apellido'];
      this.direcciones.direccion_lugar = respuesta['data'][0]['direccion_lugar'];
      this.direcciones.usuario_recibir_informacion = respuesta['data'][0]['usuario_recibir_informacion'];
      this.direcciones.direccion_estado = respuesta['data'][0]['direccion_estado'];
      this.codigoDepartamento = respuesta['data'][0]['departamento'];
      this.codigoCiudad = respuesta['data'][0]['ciudad'];
      console.log(this.direcciones);
    }).catch(error => {
      console.log(error);
    });

  }
  actualizarDirecciones() {
    this.direcciones.cliente_codigo =   this.usuario.id_cliente;
    console.log(this.direcciones);

    this.setHtpp.httpPost('actualizar-direcciones', this.direcciones).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.alertaService.showToasterFull(respuesta[`data`]);
      } else {
        this.alertaService.showToasterError(respuesta[`data`]);
      }
    }).catch(error=> {
      console.log(error)
    });
  }

}
