import {Component, OnInit} from '@angular/core';
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {Pedidos} from "../interfaz/pedidos";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";



@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.css']
})
export class DetalleCompraComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;



  carrito: any;
  carritoAnterior = [];
  cantidadCarrito = 0;
  valorTotal: number;
  valorTotalAnterior: number;
  gastosEnvio: number = 1;
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

  constructor(
    private variablesGl: VariablesService,
    private alertaS: AlertasService,
    private _formBuilder: FormBuilder,
    private setHtpp: SendHttpData,
    private ruta: Router,
    private loginGlobal: LoginGlobalService) {

    this.llamarDatoLocalesUsuario();


  }

  ngOnInit(): void {
    this.llamarDatoLocales();
    this.miCarritoCompraContador();
    this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    //console.log(this.carritoAnterior);
    this.retornarAnio();
    this.retornarMes();
    this.retornarDias();
    this.retornarAnioTarjeta();
    this.cargarTodasLasDirecciones();

    this.dataPedidos = {
      usuario_codigo: null,
      pedido_respuesta: null,
      pedido_codigo: null,
      pedido_referencia: null,
      pedido_valor: null,
      pedido_estado: 'APROBADO',
      cliente_codigo: null,

    }


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
    });
  }

  miCarritoCompraContador() {

    if (this.carritoAnterior) {
      this.carritoAnterior.forEach(respuesta => {
        this.cantidadCarrito += 1;
      });
    }

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
  //  console.log(this.carritoNuevo);

  }

  quitarItemCarrito(data, co) {

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

  vaciarBolsa() {
    localStorage.removeItem('athletic');
    this.variablesGl.changeMessage();
  }


  siguienteFormulario() {


    if (this.habilitarBotonPago === 1) {
      document.getElementById('formulario-1').click();
    }

    if (this.habilitarBotonPago === 2) {
      document.getElementById('formulario-2').click();
    }

    if (this.habilitarBotonPago === 3) {
      document.getElementById('formulario-3').click();
    }

    if (this.habilitarBotonPago === 4) {
      document.getElementById('formulario-4').click();
    }

    console.log(this.habilitarBotonPago);
    //this.habilitarBotonPago += 1;
    this.habilitarBotonPago++;
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

  pasarSiguienteItems(evento) {
    //console.log(evento, this.formGroupName);
  }

  realizarPedidos() {


    if (!this.direccionEstado) {
      this.alertaS.showToasterError('Marcar la dirección de envio del pedido');
          return;
    }

    this.referencia = new Date().getFullYear() + '' + new Date().getMonth() + '' + new Date().getDate() + '' + new  Date().getHours() + '' + new Date().getMinutes() + '' + new Date().getSeconds();
    this.valorPedido =  this.valorTotal;

    console.log(
      this.valorPedido,
      this.referencia,
      this.usuario.id_cliente,
      this.usuario.id_tienda,
      this.usuario);


    this.dataPedidos.cliente_codigo =  this.usuario.id_cliente;
    this.dataPedidos.usuario_codigo =  this.usuario.id_tienda;
    this.dataPedidos.pedido_referencia =  this.referencia;
    this.dataPedidos.pedido_valor =  this.valorPedido;



    const  data = {
      pedido: this.dataPedidos,
      detalle: this.carritoAnterior,
      direccion: this.direccionEstado
    }


    this.setHtpp.httpPost('crear-pedido', data).toPromise().then(respuesta => {
      console.log(respuesta);
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
    const data = {
      cliente:  this.usuario.id_cliente
    }

    this.setHtpp.httpPost('listar-direcciones-pedido', data).toPromise().then(respuesta => {
      console.log(respuesta);
      this.cargarDirecciones = respuesta[`data`];
    }).catch(error => {
      console.log(error);
    })
  }
  direccionChequeada(value) {
    console.log(value);
    this.direccionEstado = value;
  }

  removerDirecciones(direccion) {
    const  data = {
      direccion: direccion
    };
    this.setHtpp.httpPost('eliminar-direcciones', data).toPromise().then(respuesta => {
      console.log(respuesta[`data`]);
      this.alertaS.showToasterFull(respuesta[`data`]);
      this.cargarTodasLasDirecciones();
    }).catch(error => {

    });
  }

  editarDireccion(codigo) {
      console.log(codigo);
    this.ruta.navigate(['modificar-direcciones/', codigo])

  }



}


