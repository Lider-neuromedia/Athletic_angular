import {Component, OnInit} from '@angular/core';
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Pedidos} from "../interfaz/pedidos";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {GlobalVarService} from "../common/global-var.service";
import {MyErrorStateMatcher} from "../login/login.component";

import {MatDialog} from "@angular/material/dialog";
import {ModalDireccionesComponent} from "../modal-direcciones/modal-direcciones.component";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";
import {PagoCredito} from "../interfaz/pagoCredito";
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import * as JsEncryptModule from '../../assets/js/jsencrypt.min.js';
import { element } from 'protractor';


@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css']
})
export class DetalleCompraComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  cargarInfoCredito: PagoCredito;
  cargarInfoDebito: PagoCredito;
  condicionarLoadig: boolean;
  colorDelosTapUno: string;
  colorDelosTapDos: string;
  colorDelosTitulosTapUno: string;
  colorDelosTitulosTapDos: string;
  tarjetanoHabilitada: string;
  abrirObciondePagos: number;

  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApRSn/UOt4H2V0vZrEOsLb1YkQv7p0+dUIra7h4Srq7KbKxL2mtKQnKjnhmVbon446h713ItYMmXCJNzz/K/UtWT/elnMR74uL2ODaQ1qQvAuDGfFfbVQ+3WDxnC6LWcvA8VViAlZHjftkSGz8GubJ1a8RBIYqvnSXL67oBgF8IVeQQDXCSPMXUYpS/hP/vICFuyVL3GafOn535tJRz0l2vHKA9kB3s+ycy12J9vHzGB6+297LDs37XjUrQ/z52OBvUK/QivksueGrw/ITSwz76iT15kXChc1ZDYRaeKTGYsvYRfluEroSILPkdP5/2PCDNeqwr+SwNLuJC31ACT0+wIDAQAB\n" +
    "-----END PUBLIC KEY-----";
  // Register
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  cualesElBanco = null;
  carrito: any;
  carritoAnterior = [];
  cantidadCarrito = 0;
  valorTotal: number;
  valorTotalAnterior: number;
  gastosEnvio: number = 0;
  habilitarBotonPago = 1;
  mes: any;
  anio = [];
  dias = [];
  datosDireccion: any;
  campoRadio: any;
  aniotarjeta = [];
  hide = true;
  formGroupName: any;
  bancos: any;
  tipoDocumento: any;
  carritoNuevo = [];
  referencia: any;
  valorPedido: any;
  usuario: any;
  dataPedidos: Pedidos
  cargarDirecciones: any;
  direccionEstado: any;
  codigoEdicionDireccion: number;
  numeroCuotasPagos = [];
  circulo11: string;
  barra11: string;
  texto11: string;
  habilita11: boolean;

  validarQuePagoSeRealizara = 0;


  circulo22: string;
  barra22: string;
  texto22: string;
  habilita22: boolean;

  circulo33: string;
  barra33: string;
  texto33: string;
  habilita33: boolean;

  circulo44: string;
  barra44: string;
  texto44: string;
  habilita44: boolean;
  barra55: string;

  circulo1: string;
  barra1: string;
  texto1: string;
  habilita1: boolean;

  circulo2: string;
  barra2: string;
  texto2: string;
  habilita2: boolean;
  circulo3: string;
  barra3: string;
  texto3: string;
  habilita3: boolean;
  circulo4: string;
  barra4: string;
  texto4: string;
  habilita4: boolean;
  barra5: string;

  datosRegistro: any;
  codigoCupon: any;

  dataInfoCupones: any;
  dataInfoCodigo: any;
  dataInfoMensaje: any;
  dataInfoEstado: any;
  valorConcupon: number = 0;
  respuestaCupon: object;
  productosConDescuentos: any;
  porcentajeTipoDescuento: any;
  //cupones, Datas, mensaje, estado
  panelOpenState = false;
  valorACancelar: number;
  cantidadProductoReales: any;
  marcarContraentrega: boolean;
  dataBancos: any;
  acumuladorItem: number;

  retornnoDelPEdido: any;
  obtenerIpEquipo: any;
  credencialesPAsarelaPago: any;
  rupaparaRealizarPago: any;
  rutaparaObtenerBancos: any;
  codigoDeLosBancos: any;
  terminarBancos: any;
  encriptacion: any;
  cypherText: string = '';
  plainText: string = '4111111111111111';
  devolverImagenTarjeta: number = 0;

  constructor(
    private variablesGl: VariablesService,
    private alertaS: AlertasService,
    private _formBuilder: FormBuilder,
    private setHtpp: SendHttpData,
    private ruta: Router,
    public dialog: MatDialog,
    public globalVar: GlobalVarService,
    private favoritoSe: FavoritosService,
    private loginGlobal: LoginGlobalService,
  ) {

    //this.encriptar();
    this.llamarDatoLocalesUsuario();


  }

  encriptar(data) {
    var encrypt = new JsEncryptModule.JSEncrypt({default_key_size: 2048});
    encrypt.setPublicKey(this.publicKey)
    return this.base64ToHex(encrypt.encrypt(data));

  }

  base64ToHex(str) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
  }


  cuotasPago() {

    for (let i = 1; i <= 36; i++) {
      this.numeroCuotasPagos.push(i);
    }
  }

  ngOnInit(): void {
    this.informacionBancos();
    this.colorDelosTapUno = '';
    this.colorDelosTapDos = '';
    this.colorDelosTitulosTapUno = '';
    this.colorDelosTitulosTapDos = '';
    this.condicionarLoadig = false;
    this.cuotasPago();
    this.llamarInformacionCredito();
    this.dataPedidos = {
      usuario_codigo: null,
      pedido_referencia: null,
      pedido_valor: null,
      cliente_codigo: null,
      pedido_mediopago: ''

    }

    this.habilita1 = true;
    this.circulo1 = '#FF596A';
    this.barra1 = '#FF596A';
    this.texto1 = '#FF596A';

    this.circulo2 = '#969696';
    this.barra2 = '#969696';
    this.texto2 = '#969696';

    this.circulo3 = '#969696';
    this.barra3 = '#969696';
    this.texto3 = '#969696';

    this.circulo4 = '#969696';
    this.barra4 = '#969696';
    this.texto4 = '#969696';

    this.barra5 = '#969696';

    this.habilita11 = true;
    this.circulo11 = '#FF596A';
    this.barra11 = '#FF596A';
    this.texto11 = '#FF596A';

    this.circulo22 = '#969696';
    this.barra22 = '#969696';
    this.texto22 = '#969696';

    this.circulo33 = '#969696';
    this.barra33 = '#969696';
    this.texto33 = '#969696';

    this.circulo44 = '#969696';
    this.barra44 = '#969696';
    this.texto44 = '#969696';

    this.barra55 = '#969696';
    this.llamarDatoLocales();
    this.miCarritoCompraContador();
    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));

    this.retornarAnio();
    this.retornarMes();
    this.retornarDias();
    this.retornarAnioTarjeta();
    this.cargarTodasLasDirecciones();

    this.setUsuario();

    this.tipoDocumento = [
      {
        id: 1,
        tipo: 'Cedula de ciudadania',
      },
      {
        id: 2,
        tipo: 'Cedula de extrangeria'
      },
      {
        id: 3,
        tipo: 'Tarjeta de identidad'
      },
      {
        id: 4,
        tipo: 'Otro'
      }
    ]
  }

  llamarDatoLocales() {

    this.variablesGl.currentMessage.subscribe(response => {
      this.carritoAnterior = response;
      this.valorTotal = 0;
      this.valorTotalPedido();
      this.valorTotalAnteriorPedido();
      this.miCarritoCompraContador();
      this.obtenerProductoTotalCategoria();
      this.obtenerDescuentosProductos();
      this.cantidadProductoRealesPedido();
    });
  }

  miCarritoCompraContador() {

    if (this.carritoAnterior) {
      this.carritoAnterior.forEach(respuesta => {
        this.cantidadCarrito += 1;
      });
    }

  }


  cantidadProductoRealesPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    if (valorTotalLista) {
      this.cantidadProductoReales = valorTotalLista.reduce((item1, item2) => {
        return item1 + item2.cantidad;
      }, 0);
    }
    return this.cantidadProductoReales;
  }


  valorTotalPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    let i = 0;
    if (valorTotalLista) {
      valorTotalLista.reduce((item1, item2) => {
        console.log(item2);
        if(item2.combinaciones.length > 0){
          item2.combinaciones.forEach(element => {
            if(item2.id_combinacion == element.id){
              this.valorTotal = this.valorTotal + (element.stock.cantidad * element.precio);
              console.log(item2.id_combinacion);
              console.log(item1);
              console.log(element.id);
              console.log(this.valorTotal);
              return;
            }
          });
        }else{
          this.valorTotal = this.valorTotal + (item2.stock.cantidad * item2.precio);
        }
        
      }, 0);
    }
    console.log(this.valorTotal);
    return this.valorTotal;
  }

  valorTotalAnteriorPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    if (valorTotalLista) {
      this.valorTotalAnterior = valorTotalLista.reduce((item1, item2) => {
        return item1 + (item2.cantidad * item2.precio_general);
      }, 0);
    }
    return this.valorTotalAnterior;

  }

  aumentarDisminuir(data, indice, proceso) {
    let i = 0;
    this.carritoNuevo = JSON.parse(localStorage.getItem('athletic'));
    if(data.combinaciones.length > 0){
      data.combinaciones.forEach(element => {
        if(data.id_combinacion == element.id){
          if(element.stock.cantidad < element.cantidad && proceso === 1){
            element.stock.cantidad++;
            element.stock.cantidadTemp--;
          }else if(element.stock.cantidad > 1 && proceso === 0){
              element.stock.cantidad--;
              element.stock.cantidadTemp++;
          }
        }
      });
    }else{
      console.log(data.id_producto);
      console.log(data.stock.producto);
      if(data.id_producto == data.stock.producto){
        if(data.stock.cantidad < data.cantidad && proceso === 1){
          console.log("subir cantidad");
          data.stock.cantidad++;
          data.stock.cantidadTemp--;
        }else if(data.stock.cantidad > 1 && proceso === 0){
          console.log("bajar cantidad");
          data.stock.cantidad--;
          data.stock.cantidadTemp++;
        }
      }
    }
    this.carritoNuevo.forEach(element => {
      if(data.id_combinacion){
      if(element.id_combinacion == data.id_combinacion){
        this.carritoNuevo[i] = data;
        console.log(data);
        console.log(this.carritoNuevo);
      }
    }else{
      if(data.id_producto == element.id_producto){
        this.carritoNuevo[i] = data;
        console.log(data);
        console.log(this.carritoNuevo);
      }
    }
    i++;
    })
    localStorage.setItem('athletic', JSON.stringify(this.carritoNuevo));
    this.variablesGl.changeMessage();
    this.obtenervalorEnvioDefecto();
  }

  quitarItemCarrito(data, co) {

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito = localStorage.getItem('athletic');
        let dataCarrito = JSON.parse(this.carrito);
        let i = dataCarrito.indexOf(data);

        dataCarrito.splice(co, 1);

        localStorage.setItem('athletic', JSON.stringify(dataCarrito));
        this.llamarDatoLocales();
        let datos = 'Articulo removido del Carrito de Compras ';
        this.alertaS.showToasterWarning(datos);

        this.variablesGl.changeMessage();
      }
    });
  }

  vaciarBolsa() {
    localStorage.removeItem('athletic');
    this.variablesGl.changeMessage();
  }

  retornarMes() {
    this.mes = [
      {
        id: 1,
        prefijo: '01',
        nombre: 'Enero'
      },
      {
        id: 2,
        prefijo: '02',
        nombre: 'Febrero'
      },
      {
        id: 3,
        prefijo: '03',
        nombre: 'Marzo'
      },
      {
        id: 4,
        prefijo: '04',
        nombre: 'Abril'
      },
      {
        id: 5,
        prefijo: '05',
        nombre: 'Mayo'
      },
      {
        id: 6,
        prefijo: '06',
        nombre: 'Junio'
      },
      {
        id: 7,
        prefijo: '07',
        nombre: 'Julio'
      },
      {
        id: 8,
        prefijo: '08',
        nombre: 'Agosto'
      },
      {
        id: 9,
        prefijo: '09',
        nombre: 'Septiembre'
      },
      {
        id: 10,
        prefijo: '10',
        nombre: 'Octubre'
      },
      {
        id: 11,
        prefijo: '11',
        nombre: 'Noviembre'
      },
      {
        id: 12,
        prefijo: '12',
        nombre: 'Diciembre'
      },
    ];
  }

  retornarAnio() {

    const max = new Date().getFullYear();
    const min = max - 100;

    for (let i = max; i >= min; i--) {
      this.anio.push(i)
    }
  }

  retornarAnioTarjeta() {

    const max = new Date().getFullYear();
    const min = max + 10;
    console.log(max);
    console.log(min);

    for (let i = min; i >= max; i--) {
      this.aniotarjeta.push(i)
    }
  }

  retornarDias() {
    let cantidad;

    for (let i = 1; i < 32; i++) {
      if (i <= 9) {
        cantidad = '0' + i;
      } else {
        cantidad = i;
      }

      this.dias.push(cantidad);
    }
  }


  realizarPedidos() {

    console.log(this.carritoAnterior);
    this.carritoAnterior.forEach(element1 => {
      if(element1.stock){
        element1.cantidad = element1.stock.cantidadTemp;
      }else{
        element1.combinaciones.forEach(element2 => {
          if(element1.id_combinacion == element2.id){
            element2.cantidad = element2.stock.cantidadTemp;
          }
        })
      }
    })
    if (this.validarQuePagoSeRealizara === 1 ) {
      if (this.cargarInfoCredito.campo1.length < 16) {
        this.alertaS.showToasterError('Su tarjeta de credito no es  valida');
        return;
      }


      if (this.cargarInfoCredito.campo2.length < 3) {
        this.alertaS.showToasterError('Ingrese el código de seguridad corectamente');
        return;
      }
    }




    if (!this.direccionEstado) {
      this.alertaS.showToasterError('Marcar la dirección de envio del pedido');
      return;
    }

    this.condicionarLoadig = true;

    this.referencia = new Date().getFullYear() + '' + new Date().getMonth() + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds();
    this.valorPedido = this.valorTotal;

    this.dataPedidos.cliente_codigo = this.usuario.id_cliente;
    this.dataPedidos.usuario_codigo = this.usuario.id_tienda;
    this.dataPedidos.pedido_referencia = this.referencia;
    this.dataPedidos.pedido_valor = this.valorConcupon ? this.valorPedido + this.gastosEnvio - this.valorConcupon : this.valorPedido + this.gastosEnvio;
    // this.dataPedidos.direccion_codigo = this.direccionEstado;

    let dataDetalles = [];
    let productos = [];

    this.carritoAnterior.forEach(element1 => {
      element1.combinaciones.forEach(element2 => {
        if(element1.id_combinacion == element2.id){
          dataDetalles.push({
              id_producto: element1.id_producto,
              id_variacion: element1.id_combinacion,
              cantidad: element2.stock.cantidad
          });
          productos.push(element1.id_producto);
        }
      })
      if(element1.combinaciones.length == 0){
        dataDetalles.push({
          id_producto: element1.id_producto,
          id_variacion: element1.id_combinacion,
          cantidad: element1.stock.cantidad
        })
        productos.push(element1.id_producto);
      }
    })
    
    const data = {
      pedido: this.dataPedidos,
      detalle: dataDetalles,
      direccion: this.direccionEstado,
      porcentaje: this.dataInfoCupones ? this.dataInfoCupones : 0,
      productos: productos
    }

    console.log(data);

    this.barra5 = '#FF596A';
    this.barra55 = '#FF596A';
    this.setHtpp.httpPost('crear-pedido', data).toPromise().then(async respuesta => {
      console.log(respuesta);
      this.retornnoDelPEdido = respuesta['data'];
      this.obtenerIpEquipo = respuesta['ip1'];
      this.credencialesPAsarelaPago = respuesta['credenciales'];
      console.log(this.credencialesPAsarelaPago);


      if (this.validarQuePagoSeRealizara === 1 || this.validarQuePagoSeRealizara === 2) {
        setTimeout(() => {
          console.log("Entro pasarela pago");
          this.pasareladePago();
        }, 2000);
      }
console.log("No entro pasarela pago");
      if (this.validarQuePagoSeRealizara === 3) {

        setTimeout(()=>{
          Swal.fire({
            icon: 'success',
            confirmButtonText: 'Aceptar',
            text: 'El pedido se realizo de forma correcta'
          });

          this.variablesGl.changeMessage();
          this.ruta.navigate([ `/detalle-pedido/${respuesta['data']['pedido_codigo']}`])
          this.condicionarLoadig = false;
        }, 5000);
      }

      this.pasarSguiente2(2);

      this.variablesGl.changeMessage();
      this.gastosEnvio = 0;
    }).catch(error => {
      console.log(error);
    });

  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
      if (this.usuario) {
        this.pasarSguiente2(1);
        this.obtenervalorEnvioDefecto();
      }
    });
  }

  cargarTodasLasDirecciones() {
    if (this.usuario) {

        this.favoritoSe.currentMessage.subscribe(response => {
          this.obtenervalorEnvioDefecto();
          const data = {
            cliente: this.usuario.id_cliente
          }
          console.log(data);
          this.setHtpp.httpPost('listar-direcciones-pedido', data).toPromise().then(respuesta => {
            this.cargarDirecciones = respuesta[`data`];
            console.log(respuesta);
          }).catch(error => {
            console.log(error);
          })
        });
    }
  }

  direccionChequeada(value, datito) {

    this.direccionEstado = value;
    const data = {
      direccion: value,
      cliente: this.usuario.id_cliente,
      datos: datito
    }

    this.setHtpp.httpPost('actualizar-nueva-direccion', data).toPromise().then(respuesta => {
      this.gastosEnvio = respuesta['data']['transporte_valorenvio'];
      this.gastosEnvio = this.gastosEnvio * this.cantidadProductoReales;
      this.alertaS.showToasterFull(respuesta['mensaje']);

      this.cargarTodasLasDirecciones();
    }).catch(error => {

    });
  }

  removerDirecciones(direccion) {
    const data = {
      direccion: direccion
    };
    console.log(data);

    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.setHtpp.httpPost('eliminar-direcciones', data).toPromise().then(respuesta => {
          this.alertaS.showToasterFull(respuesta[`data`]);
          this.cargarTodasLasDirecciones();
        }).catch(error => {

        });
      }
    })
  }

  editarDireccion(codigo) {
    this.codigoEdicionDireccion = codigo;
    this.openDialog();

  }

  pasarSguiente(value) {

    if (value === 1) {
      this.circulo1 = '#FF596A';
      this.barra1 = '#FF596A';
      this.texto1 = '#FF596A';
      this.circulo2 = '#969696';

      this.barra2 = '#969696';
      this.texto2 = '#969696';
      this.circulo3 = '#969696';
      this.barra3 = '#969696';
      this.texto3 = '#969696';
      this.circulo4 = '#969696';
      this.barra4 = '#969696';
      this.texto4 = '#969696';
      this.barra5 = '#969696';
      this.habilita1 = true;
      this.habilita2 = false;
      this.habilita3 = false;
      this.habilita4 = false;
      this.habilitarBotonPago = 1;
    }
    if (value === 2) {
      this.circulo1 = '#FF596A';
      this.barra1 = '#FF596A';
      this.texto1 = '#FF596A';

      this.circulo2 = '#FF596A';
      this.barra2 = '#FF596A';
      this.texto2 = '#FF596A';

      this.circulo3 = '#969696';
      this.barra3 = '#969696';
      this.texto3 = '#969696';
      this.circulo4 = '#969696';
      this.barra4 = '#969696';
      this.texto4 = '#969696';
      this.barra5 = '#969696';
      this.habilita1 = false;
      this.habilita2 = true;
      this.habilita3 = false;
      this.habilita4 = false;
      this.habilitarBotonPago = 2;
    }
    if (value === 3) {

    /*  this.circulo1 = '#FF596A';
      this.barra1 = '#FF596A';
      this.texto1 = '#FF596A';
      this.circulo2 = '#FF596A';
      this.barra2 = '#FF596A';
      this.texto2 = '#FF596A';

      this.circulo3 = '#FF596A';
      this.barra3 = '#FF596A';
      this.texto3 = '#FF596A';

      this.circulo4 = '#969696';
      this.barra4 = '#969696';
      this.texto4 = '#969696';
      this.barra5 = '#969696';
      this.habilita1 = false;
      this.habilita2 = false;
      this.habilita3 = true;
      this.habilita4 = false;
      this.habilitarBotonPago = 3;*/
    }
    if (value === 4) {
      /*this.circulo1 = '#FF596A';
      this.barra1 = '#FF596A';
      this.texto1 = '#FF596A';

      this.circulo2 = '#FF596A';
      this.barra2 = '#FF596A';
      this.texto2 = '#FF596A';

      this.circulo3 = '#FF596A';
      this.barra3 = '#FF596A';
      this.texto3 = '#FF596A';

      this.circulo4 = '#FF596A';
      this.barra4 = '#FF596A';
      this.texto4 = '#FF596A';

      this.barra5 = '#969696'
      this.habilita1 = false;
      this.habilita2 = false;
      this.habilita3 = false;
      this.habilita4 = true;
      this.habilitarBotonPago = 4;*/
    }


  }


  pasarSguiente2(value) {

    if (value === 1) {
      this.circulo11 = '#FF596A';
      this.barra11 = '#FF596A';
      this.texto11 = '#FF596A';
      this.circulo22 = '#969696';

      this.barra22 = '#969696';
      this.texto22 = '#969696';
      this.circulo33 = '#969696';
      this.barra33 = '#969696';
      this.texto33 = '#969696';
      this.circulo44 = '#969696';
      this.barra44 = '#969696';
      this.texto44 = '#969696';
      this.barra55 = '#969696';
      this.habilita1 = true;
      this.habilita2 = false;
      this.habilita3 = false;
      this.habilita4 = false;
      this.habilitarBotonPago = 1;
    }
    if (value === 2) {
      this.circulo11 = '#FF596A';
      this.barra11 = '#FF596A';
      this.texto11 = '#FF596A';

      this.circulo22 = '#FF596A';
      this.barra22 = '#FF596A';
      this.circulo22 = '#FF596A';

      this.circulo33 = '#969696';
      this.barra33 = '#969696';
      this.texto33 = '#969696';
      this.circulo44 = '#969696';
      this.barra44 = '#969696';
      this.texto44 = '#969696';
      this.barra55 = '#969696';
      this.habilita1 = false;
      this.habilita2 = true;
      this.habilita3 = false;
      this.habilita4 = false;
      this.habilitarBotonPago = 2;

    }
    if (value === 3) {

      this.circulo11 = '#FF596A';
      this.barra11 = '#FF596A';
      this.texto11 = '#FF596A';
      this.circulo22 = '#FF596A';
      this.barra22 = '#FF596A';
      this.texto22 = '#FF596A';

      this.circulo33 = '#FF596A';
      this.barra33 = '#FF596A';
      this.texto33 = '#FF596A';

      this.circulo44 = '#969696';
      this.barra44 = '#969696';
      this.texto44 = '#969696';
      this.barra55 = '#969696';
      this.habilita1 = false;
      this.habilita2 = false;
      this.habilita3 = true;
      this.habilita4 = false;
      this.habilitarBotonPago = 3;
      this.cargarTodasLasDirecciones();
    }
    if (value === 4) {

      this.circulo11 = '#FF596A';
      this.barra11 = '#FF596A';
      this.texto11 = '#FF596A';

      this.circulo22 = '#FF596A';
      this.barra22 = '#FF596A';
      this.texto22 = '#FF596A';

      this.circulo33 = '#FF596A';
      this.barra33 = '#FF596A';
      this.texto33 = '#FF596A';

      this.circulo44 = '#FF596A';
      this.barra44 = '#FF596A';
      this.texto44 = '#FF596A';

      this.barra55 = '#969696'
      this.habilita1 = false;
      this.habilita2 = false;
      this.habilita3 = false;
      this.habilita4 = true;
      this.habilitarBotonPago = 4;
    }

  }


  sendRegister() {
    const data = {
      estado: 1,
      deleted: 0,
      id_tienda: 1,
      password: this.datosRegistro.clave,
      apellidos: this.datosRegistro.nombres,
      nombres: this.datosRegistro.nombres,
      email: this.datosRegistro.correo,
      fecha_nacimiento: this.datosRegistro.myAnio + '-' + this.datosRegistro.myMes + '-' + this.datosRegistro.myDia,
      genero: this.datosRegistro.genero
    }

    this.setHtpp.httpPost('clientes-register', data).toPromise().then(response => {
      if (response[`user`]) {
        localStorage.setItem('userAthletic', JSON.stringify(response[`user`]));
        this.loginGlobal.changeMessage();
        this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
        this.alertaS.showToasterFull('Registro guardado exitosmente');

        this.habilita2 = false;
        this.pasarSguiente2(3);
        /*this.habilita3 = true;
        this.circulo33 = '#FF596A';
        this.barra33 = '#FF596A';
        this.texto33 = '#FF596A';
        this.llamarDatoLocales();*/
        this.setUsuario();

      }
    }).catch(error => {
      console.log(error);
    })
  }

  setUsuario() {
    this.datosRegistro = {
      nombres: null,
      apellidos: null,
      correo: null,
      clave: null,
      confirmarClave: null,
      myAnio: null,
      myMes: null,
      myDia: null,
      genero: null,
      declaro: null,
      gustaria: null,
    }
  }

  buscarCuponDisponibles() {
    this.valorConcupon = null;
    this.dataInfoCupones = null;
    this.dataInfoCodigo = null;
    this.dataInfoMensaje = null;
    this.dataInfoEstado = null;
    console.log('aksjbajksdasdasdaddas')
    if (!this.codigoCupon) {
      console.log('aksjbajksdasdasdaddas')
      this.alertaS.showToasterError('Ingrese un código valido en esta casilla');
      return;
    }

    let data = {
      cupon: this.codigoCupon,
      usuario: this.usuario.id_cliente
    }
    this.setHtpp.httpPost('consultar-cupones-en-pedidos', data).toPromise().then(respuesta => {
      this.respuestaCupon = respuesta;
      console.log(respuesta);

      if (respuesta['estado'] === 1) {
        this.alertaConfirmacion(respuesta['mensaje'], respuesta['cupon']);
      }
      if (respuesta['estado'] === 2) {
        this.alertaConfirmacion(respuesta['mensaje'], respuesta['cupon']);
      }
      if (respuesta['estado'] === 3) {
        this.alertaConfirmacion(respuesta['mensaje'], respuesta['cupon']);
      }
      if (respuesta['estado'] === 4) {
        this.alertaConfirmacion(respuesta['mensaje'], respuesta['cupon']);
      }

      if (respuesta['estado'] === 5) {
        //cupones, Datas, mensaje, estado
        this.dataInfoCupones = respuesta['cupon']; //informacion d ela tabla cupon
        this.dataInfoCodigo = respuesta['data']; // a que le aplicara
        this.dataInfoMensaje = respuesta['mesnaje'];//mensaje alerta
        this.dataInfoEstado = respuesta['estado']; //estado

        let data = {
          cupon: this.dataInfoCupones,
          data: this.dataInfoCodigo,
          mesnaje: this.dataInfoCodigo,
          estado: this.dataInfoCodigo,
        }
        this.alertaAplicarDescuentos(data);
       }
      if (respuesta['estado'] === 6) {
        this.dataInfoCupones = respuesta['cupon']; //informacion d ela tabla cupon
        this.dataInfoCodigo = respuesta['data']; // a que le aplicara
        this.dataInfoMensaje = respuesta['mesnaje'];//mensaje alerta
        this.dataInfoEstado = respuesta['estado']; //estado

        this.obtenerProductoTotalCategoria();
      }
      if (respuesta['estado'] === 7) {
        this.dataInfoCupones = respuesta['cupon']; //informacion d ela tabla cupon
        this.dataInfoCodigo = respuesta['data']; // a que le aplicara
        this.dataInfoMensaje = respuesta['mesnaje'];//mensaje alerta
        this.dataInfoEstado = respuesta['estado']; //estado
        this.alertaCategoriaProdustos(respuesta['estado']);
      }
    });
  }

  alertaConfirmacion(mensaje, cupon) {
    Swal.fire({
      //question,warning,info,error
      icon: 'warning',
      title: `${cupon}`,
      text: `${mensaje}`,
    });
  }

  alertaAplicarDescuentos(informacion) {
    this.valorConcupon = null;
    let porcentaje = informacion['cupon']['cupon_porcentaje'];

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro ?',
      text: "¡No podrás revertir esto!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Aplicar!',
      cancelButtonText: 'No Aplicar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.valorConcupon = this.valorTotal * porcentaje / 100;

        swalWithBootstrapButtons.fire(
          'Aplicar!',
          'Se aplico el cupon a tu compra de forma corecta.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });
  }

  obtenerProductoTotalCategoria() {
    let data = Object.assign({}, this.respuestaCupon);
    let cupon = data['cupon'];
    if (data['estado'] === 6) {
      let productosFiltrados = this.carritoAnterior.filter(producto => {
        return producto['categorias'].filter(producto_categoria => {
          return data['data'].filter(cupo_categoria => {
            return cupo_categoria['categoria_codigo'] === producto_categoria['id_categoria'];
          }).length > 0;
        }).length > 0;
      });

      this.productosConDescuentos = productosFiltrados.map(productoFiltrado => productoFiltrado['id_producto']);

      let subTotalConDescuento = productosFiltrados.reduce((item1, item2) => {
        let subTotal = (item2.cantidad * item2.precio);
        let descuento = subTotal * Number(cupon['cupon_porcentaje']) / 100;
        return item1 + (descuento);
      }, 0);
      this.valorConcupon = subTotalConDescuento;
    }
  }

  obtenerDescuentosProductos() {

    let data = Object.assign({}, this.respuestaCupon);
    let cupon = data['cupon'];
    let cuponPreguntas = data['data'];
    if (data['estado'] === 7) {
      //   let idProductoCupon = cuponPreguntas.map(productosFiltrados => productosFiltrados['producto_codigo']);
      this.productosConDescuentos = cuponPreguntas.map(productosFiltrados => productosFiltrados['producto_codigo']);
      let productosConDescuentos = this.carritoAnterior.filter(producto => this.productosConDescuentos.includes(producto['id_producto']));
      let subTotalConDescuento = productosConDescuentos.reduce((acumulador, producto) => {
        let subTotal = (producto.cantidad * producto.precio);
        let descuento = subTotal * Number(cupon['cupon_porcentaje']) / 100;
        return acumulador + (descuento);
      }, 0);
      this.valorConcupon = subTotalConDescuento;
    }
  }

  alertaCategoriaProdustos(data) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estas seguro ?',
      text: "¡No podrás revertir esto!",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Aplicar!',
      cancelButtonText: 'No Aplicar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        if (data == 6) {
          this.obtenerProductoTotalCategoria();
        }

        if (data == 7) {
          this.obtenerDescuentosProductos();
        }

        swalWithBootstrapButtons.fire(
          'Aplicar!',
          'Se aplico el cupon de descuento a tu compra de forma corecta.',
          'success'
        )

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    });

  }
  sendLogin() {
    if (this.email.errors == null && this.password.errors == null) {
      var data = { email: this.email.value, password: this.password.value };
      this.setHtpp.httpPost('clientes-login-movil', data).subscribe(
        response => {
          if (response.response == 'error') {
            this.alertaS.showToasterError('credenciales invalidas');
          } else {
            localStorage.setItem('userAthletic', JSON.stringify(response.user));
            localStorage.setItem('token', JSON.stringify(response.token));
            this.loginGlobal.changeMessage();
            this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
            this.ruta.navigate(['/perfil']);
          }
        },
        error => {
          console.error("error en la peticion.");
        }
      );
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    let controls = group.controls;
    if (controls.first_name.errors != null || controls.last_name.errors != null || controls.email_new.errors != null) {
      return { error: true };
    } else if (pass != confirmPass) {
      return { notSame: true };
    } else {
      return null;
    }

  }


  validarCampos() {
    if (this.myForm.value.confirmPassword === '' || this.myForm.value.confirmPassword === null ||
      this.myForm.value.password === '' || this.myForm.value.password === null ||
      this.myForm.value.first_name === '' || this.myForm.value.first_name === null ||
      this.myForm.value.last_name === '' || this.myForm.value.last_name === null ||
      this.myForm.value.email_new === '' || this.myForm.value.email_new === null ||
      this.myForm.value.fecha_nacimiento === '' || this.myForm.value.fecha_nacimiento === null ||
      this.myForm.value.genero === '' || this.myForm.value.genero === null
    ) {
      return  true;
    } else {
      return false;
    }
  }


  openDialogNuevo() {

    const dialogRef = this.dialog.open(ModalDireccionesComponent, {
      width: '650px',
      height: '658px',
      data: {
        datos:  this.usuario?this.usuario.id_cliente:0,
        direccion: null
      }
    });
  }

  openDialog() {

    const dialogRef = this.dialog.open(ModalDireccionesComponent, {
      width: '650px',
      height: '658px',
      data: {
        datos:  this.usuario?this.usuario.id_cliente:0,
        direccion: this.codigoEdicionDireccion
      }
    });

  }

  validarTipoPago(valor, event?) {

    this.abrirObciondePagos = valor;
    if (valor === 1) {
      this.colorDelosTapUno = '#f1f1f1';
      this.colorDelosTapDos = '';
      this.colorDelosTitulosTapUno = '#FF596A';
      this.colorDelosTitulosTapDos = '';
      this.dataPedidos.pedido_mediopago = 'CREDITO';
      this.dataPedidos.pedido_estado = 'APROBADO';
      this.validarQuePagoSeRealizara = 1;
    }

    if (valor === 2) {
      this.colorDelosTapUno = '';
      this.colorDelosTapDos = '#f1f1f1';
      this.colorDelosTitulosTapUno = '';
      this.colorDelosTitulosTapDos = '#FF596A';
      this.dataPedidos.pedido_mediopago = 'DEBITO';
      this.dataPedidos.pedido_estado = 'APROBADO';
      this.validarQuePagoSeRealizara = 2;

    }

    if (valor === 3) {
      this.dataPedidos.pedido_mediopago = 'CONTRAENTREGA';
      this.dataPedidos.pedido_estado = 'PENDIENTE';
      this.validarQuePagoSeRealizara = 3;
    }

  }

  obtenervalorEnvioDefecto() {
    const data = {
      cliente: this.usuario.id_cliente,
    }
    this.setHtpp.httpPost('listar-valor-envio-defecto',data).toPromise().then(respuesta=> {
      this.gastosEnvio =  respuesta['transporte'] ? respuesta['transporte']['transporte_valorenvio'] : 0;
      this.gastosEnvio = this.gastosEnvio * this.cantidadProductoReales;
      this.direccionEstado = respuesta['direccion'];
    });
  }

  informacionBancos() {
    this.setHtpp.httpGet('listar-credenciales-banco').toPromise().then( respuesta => {
      this.rutaparaObtenerBancos =  respuesta['listaBancos'];
      this.codigoDeLosBancos =  respuesta['codigoBancos'];
      this.terminarBancos  =  respuesta['terminal'];
      let ruta = 'https://ws.tucompra.net/tcWSDRest/api/confirmacionTransaccionMedioPago';
      const data = {
        // "usuario": 'montanag2021',
        // "clave": '@montanag2021@',
        // "terminal": 'hb93n836840hw586'
        "usuario": respuesta['usuario'],
        "clave": respuesta['clave'],
        "terminal": respuesta['terminal'],
      }

      this.setHtpp.peticionPost(ruta, data).toPromise().then( respu => {
        const item = {
          "idMetodoPago": this.codigoDeLosBancos,
          "terminal": this.terminarBancos,
          "accessToken": JSON.parse(respu)['tokenSeguridad'] //"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyL251bGwiLCJleHAiOjE2MTQ2MTg5NzZ9.cfetLB8iY7rxWxpJ_rAQSVgMGfGoYWKSIWziyTgy2ms"
        }

        this.setHtpp.peticionPost(this.rutaparaObtenerBancos, item).toPromise().then( respu => {
          this.dataBancos = JSON.parse(respu);
          console.log( this.dataBancos);
        })

      })
    }).catch(error => {
      console.log(error);
    });

  }

  continuarBoton(item: number) {

    this.habilitarBotonPago = this.habilitarBotonPago +item;
      console.log( this.habilitarBotonPago)
    if (this.usuario) {
      if (this.usuario && this.habilitarBotonPago == 2) {
        this.habilitarBotonPago = 3;
      }
      console.log( this.habilitarBotonPago)
      this.pasarSguiente2(this.habilitarBotonPago);
    } else {
      this.pasarSguiente(this.habilitarBotonPago);
    }

  }

  /**
   * Metodo de autenticacion de la pasarela de pagos tuCompra por tema de seguriada las credenciales estan en el Backend
   */
  pasareladePago() {

    const ruta =  this.credencialesPAsarelaPago['ruta'];
      let data = {
        // "usuario": 'montanag2021',
        //   "clave": '@montanag2021@',
        //   "terminal": 'hb93n836840hw586'
          "usuario": this.credencialesPAsarelaPago['usuario'],
          "clave": this.credencialesPAsarelaPago['clave'],
          "terminal": this.credencialesPAsarelaPago['terminal'],
      }
      this.setHtpp.peticionPost(ruta, data).toPromise().then( respu => {

        setTimeout(()=>{

          if (this.dataPedidos.pedido_mediopago == 'CREDITO') {
            console.log(JSON.parse(respu)['tokenSeguridad']);
            this.dataGenerarPago(respu);
          }

          if (this.dataPedidos.pedido_mediopago == 'DEBITO') {
            this.dataGenerarPagoDebito(respu);
          }


        }, 2000);

      }).catch(error => {
        console.log(error);
        this.condicionarLoadig = false;
        this. pasarSguiente2(4);
        Swal.fire({
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          text: 'Actualmente el servicio no esta disponible intentalo mas tarde',
        });

      })
  }

  /**
   * Metodo encargado de obtener los datos del Formulario y enviarlo a la pasarela de pago
   * Campo1 Numero de tarjeta
   * Campo2 Codigo CVV
   * Campo3 Año de Ex.
   * Campo4 Mes de Ex.
   * Por tema de seguridad de la apsarela se deben encriptar estos datos
   */
  dataGenerarPago(token) {
    //this.retornnoDelPEdido tokenSeguridad

    const  pedido = {
      "MetodoPago": {
        "id": this.devolverCodigoEntidadBancariaCredito(this.cargarInfoCredito.campo1).toString(), //metodo de pago
        "campo1": this.encriptar(this.cargarInfoCredito.campo1),
        "campo2": this.encriptar(this.cargarInfoCredito.campo2),
        "campo3": this.encriptar(this.cargarInfoCredito.campo3),
        "campo4": this.encriptar(this.cargarInfoCredito.campo4),
        "campo5": this.cargarInfoCredito.campo5,
        "campo6": this.cargarInfoCredito.campo6,
        "campo7": this.cargarInfoCredito.campo7,
        "campo8": this.cargarInfoCredito.campo8,
        "campo9": this.cargarInfoCredito.campo9,
        "campo10": this.cargarInfoCredito.campo10
      },
      "Referencia": this.retornnoDelPEdido['pedido_referencia'],
      "Valortotal": this.retornnoDelPEdido['pedido_valor'].toString(),
      "Valorbase": this.retornnoDelPEdido['pedido_valor'].toString(),
      "Valoriva": "0",
      "Terminal": "hb93n836840hw586",
      "Descripcion": this.cargarInfoCredito.Descripcion + '//' + this.retornnoDelPEdido['pedido_referencia'],
      "Documento": this.cargarInfoCredito.Documento.toString(),
      "Nombre": this.cargarInfoCredito.Nombre,
      "Apellido": this.cargarInfoCredito.Apellido,
      "Direccion": this.retornnoDelPEdido['direccion_ubicacion'],
      "Telefono": this.cargarInfoCredito.Celular.toString(),
      "Celular": this.cargarInfoCredito.Celular.toString(),
      "Ciudad": this.retornnoDelPEdido['nombre'],
      "Pais": "Colombia",
      "FechaVcm": "2021-06-12",
      "Correo": this.usuario['email'],
      "ip": this.obtenerIpEquipo,
      "tokenSeguridad": JSON.parse(token)['tokenSeguridad']
    };
    

    //const  ruta = 'https://ws.tucompra.net/tcWSDRest/api/confirmacionTransaccionMedioPago';
    const ruta = 'https://ws.tucompra.net/tcWSDRest/api/confirmacionTransaccionMedioPago';
    console.log(pedido);
    console.log(ruta);
    this.setHtpp.peticionPost(ruta, pedido).toPromise().then(async respuesta => {
      this.cambiarEstadoPedido(respuesta);
    }).catch(error => {
      console.log(error);
    });


  }

  oncheckBanco() {
    // @ts-ignore
    var cod = document.getElementById("banco").value;
    // @ts-ignore
    var combo = document.getElementById("banco");
    // @ts-ignore
    var selected = combo.options[combo.selectedIndex].text;
    this.cargarInfoDebito.campo1 = cod;
    this.cargarInfoDebito.campo2 = selected;


  }

  dataGenerarPagoDebito(token) {
    //this.retornnoDelPEdido tokenSeguridad

    const pedido = {
      "MetodoPago": {
        "id": this.cargarInfoDebito.id, //metodo de pago
        "campo1": this.cargarInfoDebito.campo1,
        "campo2": this.cargarInfoDebito.campo2,
        "campo3": this.cargarInfoDebito.campo3,
        "campo4": this.credencialesPAsarelaPago['rutaBanco'], //'https://www.grupobancolombia.com/',
        "campo5": this.cargarInfoDebito.campo5,
        "campo6": this.cargarInfoDebito.campo6,
        "campo7": this.cargarInfoDebito.campo7,
        "campo8": this.cargarInfoDebito.campo8,
        "campo9": this.cargarInfoDebito.campo9,
        "campo10": this.cargarInfoDebito.campo10
      },
      "Referencia": this.retornnoDelPEdido['pedido_referencia'],
      "Valortotal": this.retornnoDelPEdido['pedido_valor'],
      "Valorbase": this.retornnoDelPEdido['pedido_valor'],
      "Valoriva": "0",
      "Terminal": "hb93n836840hw586",
      "Descripcion": this.cargarInfoDebito.Descripcion + '//' + this.retornnoDelPEdido['pedido_referencia'],
      "Documento": this.cargarInfoDebito.Documento,
      "Nombre": this.cargarInfoDebito.Nombre,
      "Apellido": this.cargarInfoDebito.Apellido,
      "Direccion": this.retornnoDelPEdido['direccion_ubicacion'],
      "Telefono": this.cargarInfoDebito.Celular,
      "Celular": this.cargarInfoDebito.Celular,
      "Ciudad": this.retornnoDelPEdido['nombre'],
      "Pais": "Colombia",
      "FechaVcm": "2021-06-12",
      "Correo": this.usuario['email'],
      "ip": this.obtenerIpEquipo,
      "tokenSeguridad": JSON.parse(token)['tokenSeguridad']
    };

    //const  ruta = 'https://ws.tucompra.net/tcWSDRest/api/confirmacionTransaccionMedioPago';
    const ruta = this.credencialesPAsarelaPago['rutaPagos'];
    this.setHtpp.peticionPost(ruta, pedido).toPromise().then(async respuesta => {
      this.cambiarEstadoPedido(respuesta);
    }).catch(error => {
      console.log(error);
    });


  }



  /**
   * Metodo encargado de recibir los datos de la pasarela de pago y  actualizar el pedido y almacenar informacion de la pasarela
   */
  cambiarEstadoPedido(respuesta) {

    let response = JSON.parse(respuesta)
    const  data = {
      CodigoRespuesta: response['CodigoRespuesta'],
      Descripcion: response['Descripcion'],
      CodigoSeguimiento: response['CodigoSeguimiento'],
      estado: response['estado'],
      urlBanco: response['urlBanco'],
      numeroAutorizacion: response['numeroAutorizacion'],
      referencia: response['referencia'],
      valor: response['valor'],
      numeroTransaccion: response['numeroTransaccion'],
      tokenTarjeta: response['tokenTarjeta'],
      codigoPedido: this.retornnoDelPEdido['pedido_codigo']
    };
    let codigoPedido = this.retornnoDelPEdido['pedido_codigo'];
    let mensajePAsarela = response['Descripcion'];
    setTimeout(() => {

      this.setHtpp.httpPost('cambiar-estado-del-pedido', data).toPromise().then(async respuesta => {
        if (respuesta['estado'] == 1) {
          localStorage.removeItem('athletic');
         await this.variablesGl.changeMessage();
          console.log(respuesta);
          Swal.fire({
            icon: 'success',
            confirmButtonText: 'Aceptar',
            text: respuesta['mensaje']
          });
         // localStorage.removeItem('athletic');

          this.ruta.navigate([ `/detalle-pedido/${codigoPedido}`]);
        }

        if (respuesta['estado'] == 2 ) {
          localStorage.removeItem('athletic');
          await this.variablesGl.changeMessage()

          Swal.fire({
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            text: respuesta['mensaje']
          });
         // localStorage.removeItem('athletic');

          this.ruta.navigate([ `/detalle-pedido/${codigoPedido}`]);
        }

        if (respuesta['estado'] == 3 ) {

          this. pasarSguiente2(4);
          Swal.fire({
            icon: 'error',
            confirmButtonText: 'Aceptar',
            text: respuesta['mensaje'],
          });
        }

       this.condicionarLoadig = false;

      }).catch(error => {
      });
    }, 7000);


  }

  llamarInformacionCredito() {

    this.cargarInfoCredito = {
      id: null,
      campo1: null,
      campo2: null,
      campo3: null,
      campo4: null,
      campo5: null,
      campo6: null,
      campo7: null,
      campo8: null,
      campo9: null,
      campo10:null,
      Referencia: null,
      Valortotal: null,
      Valorbase: null,
      Valoriva: null,
      Terminal: null,
      Descripcion: 'Pago de pedido Athletic Air por medio de Tarjeta de CREDITO ',
      Documento: null,
      Nombre: null,
      Apellido: null,
      Direccion: null,
      Telefono: null,
      Celular: null,
      Ciudad: null,
      Pais: null,
      FechaVcm: null,
      Correo: null,
      ip: null,
      tokenSeguridad:null,
    }

    this.cargarInfoDebito = {
      id: /*Prueba*/'41' /*Produccion 3*/,
      campo1: null,
      campo2: null,
      campo3: null,
      campo4: null,
      campo5: null,
      campo6: null,
      campo7: null,
      campo8: null,
      campo9: null,
      campo10:null,
      Referencia: null,
      Valortotal: null,
      Valorbase: null,
      Valoriva: null,
      Terminal: null,
      Descripcion: 'Pago de pedido Athletic Air por medio de Tarjeta de DEBITO ',
      Documento: null,
      Nombre: null,
      Apellido: null,
      Direccion: null,
      Telefono: null,
      Celular: null,
      Ciudad: null,
      Pais: null,
      FechaVcm: null,
      Correo: null,
      ip: null,
      tokenSeguridad: null,
    }

  }


  devolverImagenBancarias(value) {


    if (!value) {
      this.devolverImagenTarjeta = 0;
      this.tarjetanoHabilitada = '';
    }

    let codigo = null;
    var data = value.substring(0, 1);

    /**
     * Pruebas
     */

    if (value.length > 2)  {

      if (data === '4') {
        codigo = 4;
        this.tarjetanoHabilitada = '';
      }
      if (data === '5') {
        codigo = 5;
        this.tarjetanoHabilitada = '';
      }
      if (data === '6') {
        codigo = 6;
        this.tarjetanoHabilitada = '';
      }
      if (data === '7') {
        codigo = 7;
        this.tarjetanoHabilitada = '';
      }

      if (!codigo) {
        this.tarjetanoHabilitada = 'No soporta esta tarjeta';
      }

      /**
       * Producción
       */
      /* if (data === '4') {
         codigo = 4;
       }
       if (data === '5') {
         codigo = 5;
       }
       if (data === '6') {
         codigo =6;
       }
       if (data === '7') {
         codigo = 7;
       }*/
      this.devolverImagenTarjeta = codigo;
    } else {
      this.devolverImagenTarjeta = 0;
    }


  }


  devolverCodigoEntidadBancariaCredito(tarjeta) {

    let codigo = null;
    var data = tarjeta.substring(0, 1);

    /**
     * Pruebas
     */

    if (data === '4') {
      codigo = 37;
    }
    if (data === '5') {
      codigo = 38;
    }
    if (data === '6') {
      codigo = 39;
    }
    if (data === '7') {
      codigo = 40;
    }

    /**
     * Producción
     */
    /* if (data === '4') {
       codigo = 2;
     }
     if (data === '5') {
       codigo = 1;
     }
     if (data === '6') {
       codigo = 5;
     }
     if (data === '7') {
       codigo = 4;
     }*/
    this.devolverImagenTarjeta = codigo;
    return codigo;
  }


}


