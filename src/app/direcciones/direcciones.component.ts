import { Component, OnInit } from '@angular/core';
import {SendHttpData} from "../tools/SendHttpData";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Direcciones} from "../interfaz/direcciones";
import {AlertasService} from "../servicio/alertas/alertas.service";

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

}
