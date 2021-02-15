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
import {ComentarioProductoComponent} from "../comentario-producto/comentario-producto.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalDireccionesComponent} from "../modal-direcciones/modal-direcciones.component";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";


@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css']
})
export class DetalleCompraComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  // Register
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();


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

  circulo11: string;
  barra11: string;
  texto11: string;
  habilita11: boolean;

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

  constructor(
    private variablesGl: VariablesService,
    private alertaS: AlertasService,
    private _formBuilder: FormBuilder,
    private setHtpp: SendHttpData,
    private ruta: Router,
    public dialog: MatDialog,
    public globalVar: GlobalVarService,
    private favoritoSe: FavoritosService,
    private loginGlobal: LoginGlobalService) {

    this.llamarDatoLocalesUsuario();


  }

  ngOnInit(): void {
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
    this.obtenervalorEnvioDefecto();

    this.dataPedidos = {
      usuario_codigo: null,
      pedido_respuesta: null,
      pedido_codigo: null,
      pedido_referencia: null,
      pedido_valor: null,
      pedido_estado: 'APROBADO',
      cliente_codigo: null,
      direccion_codigo: null,
      pedido_mediopago: null

    }

    this.setUsuario();

    this.bancos = [
      {
        id: 1,
        name: 'Bancolombia'
      },
      {
        id: 2,
        name: 'Banco Avevilla'
      },
      {
        id: 3,
        name: 'Banco Popular'
      },
      {
        id: 4,
        name: 'Banco de Bogota'
      }
    ];
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
    console.log(this.cantidadProductoReales);
    return this.cantidadProductoReales;
  }


  valorTotalPedido() {

    const valorTotalLista = JSON.parse(localStorage.getItem('athletic'));
    if (valorTotalLista) {
      this.valorTotal = valorTotalLista.reduce((item1, item2) => {
        return item1 + (item2.cantidad * item2.precio);
      }, 0);
    }
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

    this.carritoNuevo = JSON.parse(localStorage.getItem('athletic'));

    if (proceso === 1) {
      this.carritoNuevo[indice].cantidad++;
    } else {
      if (this.carritoNuevo[indice].cantidad > 1) {
        this.carritoNuevo[indice].cantidad--;
      } else {
        let datos = 'Articulo agregado a la canasta no puede ser menor a 1 unidad';
        this.alertaS.showToasterWarning(datos);
      }
    }

    localStorage.setItem('athletic', JSON.stringify(this.carritoNuevo));
    this.variablesGl.changeMessage();
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

    if (!this.direccionEstado) {
      this.alertaS.showToasterError('Marcar la dirección de envio del pedido');
      return;
    }

    this.referencia = new Date().getFullYear() + '' + new Date().getMonth() + '' + new Date().getDate() + '' + new Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds();
    this.valorPedido = this.valorTotal;

    this.dataPedidos.cliente_codigo = this.usuario.id_cliente;
    this.dataPedidos.usuario_codigo = this.usuario.id_tienda;
    this.dataPedidos.pedido_referencia = this.referencia;
    this.dataPedidos.pedido_valor = this.valorConcupon ? this.valorPedido + this.gastosEnvio - this.valorConcupon : this.valorPedido + this.gastosEnvio;
    this.dataPedidos.direccion_codigo = this.direccionEstado;

    const data = {
      pedido: this.dataPedidos,
      detalle: this.carritoAnterior,
      direccion: this.direccionEstado,
      porcentaje: this.dataInfoCupones ? this.dataInfoCupones : 0,
      productos: this.productosConDescuentos ? this.productosConDescuentos : 0
    }

    this.barra5 = '#FF596A';
    this.barra55 = '#FF596A';
    this.setHtpp.httpPost('crear-pedido', data).toPromise().then(respuesta => {
      this.alertaS.showToasterFull('Pedido realizado exitosamente');
    }).catch(error => {
      console.log(error);
    });
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;


    });
  }

  cargarTodasLasDirecciones() {
    if (this.usuario) {

        this.favoritoSe.currentMessage.subscribe(response => {
          this.obtenervalorEnvioDefecto();
          const data = {
            cliente: this.usuario.id_cliente
          }
          this.setHtpp.httpPost('listar-direcciones-pedido', data).toPromise().then(respuesta => {
            this.cargarDirecciones = respuesta[`data`];
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
    //this.ruta.navigate(['modificar-direcciones/', codigo])
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

      this.circulo1 = '#FF596A';
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
      this.habilitarBotonPago = 3;
    }
    if (value === 4) {

      this.circulo1 = '#FF596A';
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
      this.habilitarBotonPago = 4;
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
        this.habilita3 = true;
        this.circulo33 = '#FF596A';
        this.barra33 = '#FF596A';
        this.texto33 = '#FF596A';
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
/*
    if (this.codigoCupon.length > 0) {
      this.alertaS.showToasterError('Ingrese un codigo valido en esta casilla');
      return;
    }*/

    let data = {
      cupon: this.codigoCupon,
      usuario: this.usuario.id_cliente
    }
    this.setHtpp.httpPost('consultar-cupones-en-pedidos', data).toPromise().then(respuesta => {
      this.respuestaCupon = respuesta;

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
      footer: '<a href></a>'
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

      //let productosFiltradosIds = productosFiltrados.map(productoFiltrado => productoFiltrado['id_producto']);
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
      this.setHtpp.httpPost('clientes-login', data).subscribe(
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

  getErrorMessageLogin() {
    if (this.email.hasError('required')) {
      return 'El campo es requerido.';
    }
    if (this.email.hasError('email')) {
      return 'Debe ser en formato email';
    }
    if (this.password.hasError('password')) {
      return 'Debe ser en formato email';
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


  openDialog() {

    const dialogRef = this.dialog.open(ModalDireccionesComponent, {
      width: '700px',
      data: {
        datos:  this.usuario?this.usuario.id_cliente:0,
        direccion: this.codigoEdicionDireccion
      }
    });

  }

  validarTipoPago(valor, event?) {

    if (valor === 1) {
      this.dataPedidos.pedido_mediopago = 'CREDITO';
      this.dataPedidos.pedido_estado = 'APROBADO';
    }
    if (valor === 2) {
      this.dataPedidos.pedido_mediopago = 'DEBITO';
      this.dataPedidos.pedido_estado = 'APROBADO';
    }
    if (valor === 3) {
      this.dataPedidos.pedido_mediopago = 'CONTRAENTREGA';
      this.dataPedidos.pedido_estado = 'PENDIENTE';
    }

  }

  obtenervalorEnvioDefecto() {
    const data = {
      cliente: this.usuario.id_cliente,

    }
    this.setHtpp.httpPost('listar-valor-envio-defecto',data).toPromise().then(respuesta=> {
      this.gastosEnvio = respuesta['transporte']['transporte_valorenvio'];
      this.gastosEnvio = this.gastosEnvio * this.cantidadProductoReales;
      //this.direccionEstado = respuesta['ciudad'];
      this.direccionEstado = respuesta['direccion'];
      console.log( this.direccionEstado);
    });
  }

}


