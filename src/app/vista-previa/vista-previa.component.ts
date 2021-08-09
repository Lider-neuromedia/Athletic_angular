import { Component, OnInit, Inject } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { SendHttpData } from '../tools/SendHttpData';
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {VariablesService} from "../servicio/variable-global/variables.service";
import {AgregarCarritoComponent} from "../agregar-carrito/agregar-carrito.component";
import Swal from 'sweetalert2';

export interface DialogData {
  id: any;
}

@Component({
  selector: 'app-vista-previa',
  templateUrl: './vista-previa.component.html',
  styleUrls: ['./vista-previa.component.css']
})

export class VistaPreviaComponent implements OnInit {
  opcionSeleccionado: any;
  almacenColores: any;
  tallasDelProductoFiltradas: any;
  imagenesView: any;
  colorBool: boolean;
  tallaBool: boolean;
  tallasBool: boolean;
  sabanasBool: boolean;
  productoBool: boolean = false;
  opcionSelecionadaTallas: any;
  opcionSelecionadaSabanas: any;
  opcionSabanas: any[] = [];
  opcionTallas: any[] = [];
  almacenTalla: any[];
  returnEstadoProducto: boolean;
  coloralCarrito: any;
  variation: any;
  imagenCambbiar: string;
  bandera: boolean;
  cantidadProductos: number = 1;
  dattos = {
    id: 0,
    producto: {},
    cantidad: 0,
    cantidadTemp: 0,
    cantidadTotal: 0
};
  constructor(public dialogRef: MatDialogRef<VistaPreviaComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public router : Router,
              private http: SendHttpData,
              private  alertaS: AlertasService,
              public dialog: MatDialog,
              private route_params: ActivatedRoute,
              private activatedRoute: ActivatedRoute,
              private ruta: Router,
              private loginGlobal: LoginGlobalService,
              private variablesGl: VariablesService
  ) { }
  producto : any;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  descuento;
  valor_ant;
  precio_desc;
  productos_relac = [];
  prod = [];
  cantidad = 1;
  tallas = [];
  carritoAnterior = [];
  addProductoCarrito = [];
  usuario: any;
  condicionBotonFavorito: any;
  cantidadComentario: any;
  totalComentario: any;
  url: any;

  carouselDescatadosUno:any = [];
  optionSlideDestacados:any = [];

  ngOnInit(): void {
    localStorage.removeItem('favoritos');
    this.galleryImages = [
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      },
      {
        small: "/N-1008/assets/img/productos/producto-interna.png",
        medium: "/N-1008/assets/img/productos/producto-interna.png",
        big: "/N-1008/assets/img/productos/producto-interna.png"
      }
    ];

    // this.galleryImages = [
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   },
    //   {
    //     small: "/assets/img/productos/producto-interna.png",
    //     medium: "/assets/img/productos/producto-interna.png",
    //     big: "/assets/img/productos/producto-interna.png"
    //   }
    // ];

    this.carouselDescatadosUno = [
      {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/tres.jpg',"descuento":true},
      {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/uno.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/dos.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/tres.jpg',"descuento":false},
      {"img": 'assets/img/zapatillas/cuatro.jpg',"descuento":true}
    ];

    this.optionSlideDestacados = {
      items: 5,
      dots: false,
      nav: true
    }

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '100%',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
    this.getProducts(this.data.id);
    this.listarProductosRelacionados(this.data.id)
  }

  async getDataProdRelac(id){
    return await this.http.httpGet('products/' + id, null, false).toPromise().then(
      response => {
        var producto = response.product;
        var prod_relac = {
          id : producto.id,
          name : producto.name[0]['value'],
          img : this.http.getImageProduct(producto.id, producto.id_default_image)
        }

        return prod_relac;
      },
      error => {

      });
  }

  getProductsRelac(products){
    var productos = [];
    products.forEach((element, index) => {
      this.getDataProdRelac(element.id).then(
        response => {
          if ((index + 1) == 5) {
            this.prod.push(response);
            productos.push(this.prod);
            this.prod = [];
          }else{
            if (products.length == (index + 1)) {
              productos.push(this.prod);
            }
            this.prod.push(response);
          }
        }
      );
    });
    this.productos_relac = productos;
  }

  getProductValue(tallas){
    var values = [];
    tallas.forEach(element => {
      this.http.httpGet('product_option_values/' + element.id, null, false).subscribe(
        response => {
          var data = response.product_option_value;
          if (data.id_attribute_group == 5) {
            var value = {
              id: data.id,
              name: data.name[0]['value']
            };
            values.push(value);
          }
        },
        error => { console.log("error." + error); }
      );
    });
    this.tallas = values;
    console.log(this.tallas);
  }

  getProducts(id) {
    let color = [];
    let colorMap = [];
    this.http.httpGet('productos/' + id, null, false).subscribe(
      async response => {
        this.producto = response;
        
        response.combinaciones.forEach(element => {
          color.push({
            valor: element.variation[0].valor,
            valor_id: element.variation[0].valor_id
          })
        });
        
        colorMap = color.map(item => [item.valor_id, item]);

        let colorMapArr = new Map(colorMap);
        
        let unicos = [...colorMapArr.values()];

        this.almacenColores = unicos;

        console.log(this.almacenColores);
       // this.almacenTalla = response.combinacionesTallas
        //await  this.validarEstadodelProducto();
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

        this.tallasDelProductoFiltradas = this.producto['combinaciones'];
        //const result = this.producto['combinaciones'].filter(item => item.valor == talla);
        this.galleryImages = gallery;
        console.log(this.galleryImages);
        this.imagenesView = response.imagenes;
      },
      error => { console.log("error." + error); }
    );

  }

  // Productos
  // getProducts(id) {
  //   this.http.httpGet('productos/' + id, null, false).subscribe(
  //     response => {
  //       this.producto = response;
  //       console.log( this.producto );
  //       $('#detalle').html(response.descripcion_prod);
  //       $('blockquote').addClass('col-md-4');
  //       var gallery = [];
  //       response.imagenes.forEach(element => {
  //         var img = {
  //           small: element.img,
  //           medium: element.img,
  //           big: element.img
  //         }

  //         gallery.push(img);
  //       });
  //       this.galleryImages = gallery;
  //     },
  //     error => { console.log("error." + error); }
  //   );
  // }

  changeCantidad(sum){
    if (sum) {
      this.cantidadProductos = this.cantidadProductos + 1;
    }else{
      if (this.cantidadProductos > 1) {
        this.cantidadProductos = this.cantidadProductos - 1;
      }
    }
  }

  /*agregarProductosAlCarrito() {
    this.alertaS.showToasterFull('Articulo Agregado Corectamente');

    if (this.cantidad > 0) {
      this.alertaS.showToasterFull('Articulo Agregado Corectamente');
    } else {
      this.alertaS.showToasterError('Debes agregar Minimo un producto');
    }
  }*/

  agregarProductosAlCarrito() {
    // if (!this.opcionSeleccionado || this.opcionSeleccionado == '' || this.opcionSeleccionado == null) {
    //   this.alertaS.showToasterError('Debes seleccionar una talla');
    //   return;
    // }
    // console.log(this.almacenColores.length);
    console.log(this.opcionSelecionadaTallas);
    console.log(this.opcionSelecionadaSabanas);
    console.log(this.sabanasBool);
    if(this.almacenColores.length == 0){
    }else if(this.almacenColores.length > 0 && !this.opcionSeleccionado || this.opcionSeleccionado == '' || this.opcionSeleccionado == null){
      this.alertaS.showToasterError('Debes seleccionar una talla');
      return;
    }else if(this.almacenColores.length > 0 && !this.opcionSeleccionado || this.opcionSeleccionado == '' || this.opcionSeleccionado == null
             && this.sabanasBool  || this.opcionSelecionadaSabanas == '' || this.opcionSelecionadaSabanas == null){
              this.alertaS.showToasterError('Debes seleccionar una sabana');
              return;        
             }else if(this.almacenColores.length > 0 && !this.opcionSeleccionado || this.opcionSeleccionado == '' || this.opcionSeleccionado == null
                      && this.tallasBool  || this.opcionSelecionadaTallas == '' || this.opcionSelecionadaTallas == null){
                this.alertaS.showToasterError('Debes seleccionar una tallas');
                return;        
             }
    if(localStorage.getItem('athletic') && JSON.parse(localStorage.getItem('athletic')).length > 0){
      console.log("Carrito existe");
      this.carritoAnterior = JSON.parse(localStorage.getItem('athletic'));
    }else{
      console.log("Carrito no existe");
      this.carritoAnterior = [];
    }
    if(localStorage.getItem('athletic') && JSON.parse(localStorage.getItem('athletic')).length === 0){
      localStorage.removeItem('athletic');
    }
    if(localStorage.getItem('producto-borrado')){
      let productoBorrados = JSON.parse(localStorage.getItem('producto-borrado'));
    if(this.producto.id_combinacion == productoBorrados.id_combinacion){
      this.productoBool = true;
      this.producto = productoBorrados;
      this.coloralCarrito = this.producto['combinaciones'].filter(item => item.variation[0].valor_id == this.variation);
      localStorage.removeItem('producto-borrado');
    }
    }
    console.log(this.producto);
    console.log(this.carritoAnterior);
    console.log(this.coloralCarrito);

    if (this.verTalalsAgotadas(this.cantidadProductos, this.producto['id_producto'], this.opcionSeleccionado)) {
      if (this.cantidadProductos > 0) {
        if(this.almacenColores.length > 0){
        this.producto['talla'] = this.opcionSeleccionado;
        this.producto['tallas'] = this.opcionSelecionadaTallas;
        this.producto['sabanas'] = this.opcionSelecionadaSabanas;
        this.producto['precio'] = this.coloralCarrito[0]['precio'];
        this.producto['precio_impuesto'] = this.coloralCarrito[0]['precio_impuesto'];
        this.producto['color'] = this.coloralCarrito[0]['variation'][0]['valor'];
        this.producto['imagen_destacada'] = this.coloralCarrito[0]['imagenes'][0];
        this.producto['id_combinacion'] = this.coloralCarrito[0].id;
        }
        // console.log(this.coloralCarrito);
        
        // this.combinacionesTemporales.push(this.coloralCarrito[0]);
        // this.producto['combinacionesTemporales'] = this.combinacionesTemporales;
        let i = 0;
        console.log(this.carritoAnterior);
        if(this.carritoAnterior.length > 0){
          console.log("existe");
          this.carritoAnterior.forEach(item => {
            console.log(item);
            console.log(this.producto);
            if(item.id_combinacion){
              console.log("Existe combinacion");
              if( item.id_combinacion == this.producto.id_combinacion){
                this.carritoAnterior[i] = this.producto;
                console.log(i);
                console.log(this.carritoAnterior);
                this.bandera = true;
                return;
              }
            }else{
              if(item.id_producto == this.producto.id_producto){
                this.carritoAnterior[i] = this.producto;
                this.bandera = true;
                return;
              }
              // console.log(item.id_producto);
              // console.log(this.producto.id_producto);
              // if(item.id_producto == this.producto.id_producto){
              //   this.carritoAnterior[i] = this.producto;
              // console.log(i);
              // console.log(this.carritoAnterior);
              // this.bandera = true;
              // return;
              // }else{
              //   this.carritoAnterior.push(this.producto);
              //   console.log(i);
              //   console.log(this.carritoAnterior);
              //   this.bandera = true;
              //   return;
              // }
            }
            i++;
          })
        }
        // }else{
        //   console.log("No existe");
        //     this.carritoAnterior.push(this.producto);
        //    this.bandera = false;
        // }    
        if(!this.bandera){
          console.log("No existe");
            this.carritoAnterior.push(this.producto);
        }
        console.log(this.carritoAnterior);
        console.log(this.producto);
          if (this.carritoAnterior) {
          } else {
            // this.carritoAnterior = [];
          }
          // this.carritoAnterior.push(this.producto);
          localStorage.setItem('athletic', JSON.stringify(this.carritoAnterior));
        }


        // this.addProductoCarrito = [];
        this.bandera = false;
        this.cantidadProductos = 1;

        this.alertaS.showToasterFull(`Articulo Agregado Correctamente`);


      } else {
        this.alertaS.showToasterError(`Debes agregar Minimo un producto ,  ${this.cantidadProductos}`);
      }
      this.variablesGl.changeMessage();
      this.agregarABolsa(this.producto['id_producto']);
    }

    verTalalsAgotadas(cantidad: number, producto: number, talla: string) {
      //Filtro cual es la talla del producto que estan comprando
      let result;
      console.log(talla);
      this.producto['combinaciones'].forEach(element => {
        const variacion = [];
        variacion.push(element.variation[1]);
        result = variacion.filter(item => item?.valor == talla)
        // result = variacion;
        
      });
      console.log(result);
      console.log(producto);
      console.log(this.producto);
      // this.producto['combinacionesTallas'].filter(item => item.valor == talla);
      //luego que obtengo los datos de la base de datos valido que si la cantidad que estan comprando es menor o igual a la que tengo
      //En la base de datos lo deje permitir comprando de lo contrario nooooooooo podra
      if(this.almacenColores.length == 0){
        if(this.producto.stock && !this.productoBool){
          console.log(producto);
          console.log(this.producto.stock.id);
          if(this.producto.stock.id == producto){
            this.dattos = {
              id: producto,
              producto: producto,
              cantidad: this.producto.stock.cantidad += cantidad,
              cantidadTemp: this.producto.stock.cantidadTemp -= cantidad,
              cantidadTotal: this.producto.cantidad
            }
            this.producto.stock = this.dattos;
            return true;
          }else{
            console.log("No tiene id igual");
          }
        }else{
          this.productoBool = false;
          let cantidadTemp = this.producto.cantidad;
          this.dattos = {
            id: producto,
            producto: producto,
            cantidad: cantidad,
            cantidadTemp: cantidadTemp -= cantidad,
            cantidadTotal: this.producto.cantidad
          }
          this.producto.stock = this.dattos;
          return true;
        }
        // if(producto == this.dattos.id){
        //   if(cantidad <= this.producto.stock.cantidadTemp){
        //     console.log("Sin combinaciones");
        //       dataForArr = {
        //         producto: producto,
        //         cantidad: this.producto.stock.cantidad += cantidad,
        //         cantidadTemp: this.producto.stock.cantidadTemp -= cantidad,
        //         cantidadTotal: this.producto.cantidad
        //     };
        //     let i = 0;
        //     for (const iterator of this.producto) {
        //       if(iterator.id_producto == this.dattos.id){
        //         this.producto['stock'][i] = this.dattos;
        //         return true;
        //       }
        //       i++;
        //   }
        //   }else{
        //     this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+this.producto.stock.cantidadTemp);
        //     return false;
        //   }
        // }
        //     this.dattosGenerales = {
        //     producto: producto,
        //     cantidad: cantidad,
        //     cantidadTemp: this.producto.cantidad - cantidad,
        //     cantidadTotal: this.producto.cantidad
        // }
        //     let i = 0;
        //     for (const iterator of this.producto) {
        //       if(iterator.id_producto == this.dattos.id){
        //         this.producto['stock'][i] = this.dattos;
        //         return true;
        //       }
        //       i++;
        // }
        //Si esta corecta la cantida le devuelvo true al carrito de compras
  
      /*cantidad: 12
      id_atributo_group: 2
      id_atributo_value: 16
      id_combinacion: 1349
      precio: null
      sku: null
      valor: "40"*/
    }else{
      console.log("Con combinaciones");
      if(cantidad <= this.coloralCarrito[0].cantidad){      
        if(this.coloralCarrito[0].id == this.dattos.id){
          if(cantidad <= this.dattos.cantidadTemp && !this.productoBool){
            cantidad += this.dattos.cantidad;
            this.dattos = {
              id: this.coloralCarrito[0].id,
              producto: producto,
              cantidad: cantidad,
              cantidadTemp: this.coloralCarrito[0].cantidad - cantidad,
              cantidadTotal: this.coloralCarrito[0].cantidad
            };
            let i = 0;
            for (const iterator of this.producto.combinaciones) {
                if(iterator.id == this.dattos.id){
                  this.producto.combinaciones[i].stock = this.dattos;
                  return true;
                }
                i++;
            }
          }else{
            if(this.productoBool && cantidad <= this.coloralCarrito[0].cantidad){
              this.productoBool = false;
              console.log(this.productoBool);
              this.dattos = {
                id: this.coloralCarrito[0].id,
                producto: producto,
                cantidad: cantidad,
                cantidadTemp: this.coloralCarrito[0].cantidad - cantidad,
                cantidadTotal: this.coloralCarrito[0].cantidad
            };
            let i = 0;
            for (const iterator of this.producto.combinaciones) {
                if(iterator.id == this.dattos.id){
                  this.producto.combinaciones[i].stock = this.dattos;
                  return true;
                }
                i++;
            }
            }
            this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+ this.coloralCarrito[0].cantidad);
            return false;
          }
        }
        this.productoBool = false;
      this.dattos = {
        id: this.coloralCarrito[0].id,
        producto: producto,
        cantidad: cantidad,
        cantidadTemp: this.coloralCarrito[0].cantidad - cantidad,
        cantidadTotal: this.coloralCarrito[0].cantidad
    };
    let i = 0;
    for (const iterator of this.producto.combinaciones) {
        if(iterator.id == this.dattos.id){
          this.producto.combinaciones[i].stock = this.dattos;
          return true;
        }
        i++;
    }
      }else{
        console.log("Falla");
        this.alertaS.showToasterWarning('la cantidad ingresada debe ser igual o menor a existente en en el inventario, '+ this.coloralCarrito[0].cantidad);
        return false;
      }
    }
    }

  listarProductosRelacionados(codigo) {
    const  data = {
      producto: codigo
    };

    this.http.httpPost('listar-productos-relacionados', data).toPromise().then(respuesta => {
      console.log(respuesta);

      this.carouselDescatadosUno = respuesta[`data`];
      this.url = respuesta[`ruta`];

      console.log( this.carouselDescatadosUno , this.url )
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkColores(event) {
    this.colorBool = true;
    this.tallaBool = false;
    this.tallasBool = false;
    this.sabanasBool = false;
    this.opcionSabanas = [];
    this.opcionTallas = [];
    this.returnEstadoProducto = true;
    this.variation = event;

    this.coloralCarrito = this.producto['combinaciones'].filter(item => item.variation[0].valor_id == event);

    let combinaciones = [];
    let combinacionesMap = [];

    this.coloralCarrito.forEach(element1 => {
      element1.variation.forEach(element2 => {
        if(element2.grupo_id !== 1){

          $('#talla').css("display","block");
              combinaciones.push({
                valor: element2.valor,
                grupo_id: element2.grupo_id
              })
              this.opcionSeleccionado = null;

          // switch(element2.grupo_id){
          //   case 2:
              
          //     break;
          //   case 9:
          //     break;
          //   case 10:
          //     break;
          // }
        }else if(element2.grupo_id === 1){
          $('#talla-default').attr("selected","selected");
          this.opcionSeleccionado = "N/A"
        }
      });
    });

    combinacionesMap = combinaciones.map(item => [item.valor, item]);

    let combinacionesMapArr = new Map(combinacionesMap);

    let unicos = [...combinacionesMapArr.values()];

    this.almacenTalla = unicos;
    
    console.log(this.coloralCarrito);
    console.log(this.almacenTalla);
    console.log(this.producto);
    console.log(event);
    // console.log(this.coloralCarrito[1]['variation']?.valor);


    if (event && this.almacenTalla.length == 0) {
      this.tallaBool = false;
      $('#talla-default').attr("selected","selected");
      $('#talla').css("display","none");
      // this.returnEstadoProducto = false;
    }
    // $('#talla-default').attr("selected", "selected");
    this.producto.precio = this.coloralCarrito[0].precio;
    this.producto.precio_impuesto = this.coloralCarrito[0].precio_impuesto;
    let imagenSeleccionada = [];
    imagenSeleccionada.push({
      img: this.coloralCarrito[0]['imagenes'][0]
    }) 
    this.imagenesView = imagenSeleccionada;
    this.imagenCambbiar = this.coloralCarrito[0]['imagenes'][0];
    // console.log(this.imagenesView);

  }


  checkearTalla(evento) {
    let combinacionVariedades = [];
    this.opcionSabanas = [];
    this.opcionTallas = [];
    this.tallaBool = true;
    this.tallasBool = false;
    this.sabanasBool = false;
    this.opcionSelecionadaSabanas = null;
    this.opcionSelecionadaTallas = null;
    this.opcionSeleccionado = evento;
    this.coloralCarrito.forEach(element1 => {
      element1.variation.forEach(element2 => {
        if(element2.valor == evento){
          combinacionVariedades.push(element1.variation);  
        }
        
      });
    });
    combinacionVariedades.forEach(element1 => {
      console.log(element1);
      element1.forEach(element2 => {
        if(element2.grupo_id !== 1 && element2.grupo_id !== 2){
        console.log(element2.grupo_id);
        switch(element2.grupo_id){
          case 9:
              this.opcionSabanas.push({
                valor: element2.valor
              })
            break;
          case 10:
              this.opcionTallas.push({
                valor: element2.valor
              })
            break;
          default:
            Swal.fire('Debes crear la categoria en el case', '', 'info');
            break;
        }
      }
      });
    })
    let opcionSabanasTemp = [];
    let opcionTallasTemp = [];
    opcionSabanasTemp = this.opcionSabanas.map(item => [item.valor, item]);
    let opcionSabanasMap = new Map(opcionSabanasTemp);
    let unicosSabana = [... opcionSabanasMap.values()];
    this.opcionSabanas = unicosSabana;

    opcionTallasTemp = this.opcionTallas.map(item => [item.valor, item]);
    let opcionTallasMap = new Map(opcionTallasTemp);
    let unicosTallas = [... opcionTallasMap.values()]
    this.opcionTallas = unicosTallas;

    if(this.opcionTallas.length === 0){
      this.opcionSelecionadaTallas = "N/A";
    }
    if(this.opcionSabanas.length === 0){
      this.opcionSelecionadaSabanas = "N/A";
    }

    console.log(this.opcionSabanas);
    console.log(this.opcionTallas);
    console.log(combinacionVariedades);
  }

  checkSabanas(event){
    this.sabanasBool = true;
    this.opcionSelecionadaSabanas = event;
      console.log(event);
  }
  checkTallas(event){
    this.tallasBool = true;
    if(!this.sabanasBool){
      this.opcionSelecionadaSabanas = "N/A";
    }
    this.opcionSelecionadaTallas = event;
    console.log(event);
  }

  agregarABolsa(producto) {
    const dialogRef = this.dialog.open(AgregarCarritoComponent, {
      width: '900px',
      data: {id: producto}
    });
  }
}
