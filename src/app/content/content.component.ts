import { Component, HostListener , OnInit, OnDestroy } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {SendHttpData} from '../tools/SendHttpData';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  title = 'owl-carousel';
  CarouselImages =['assets/img/marcas/adidas.png','assets/img/marcas/new_balance.png','assets/img/marcas/puma.png','assets/img/marcas/nike.png','assets/img/marcas/fila.png','assets/img/marcas/skechers.png','assets/img/marcas/reebok.png'];
  destacados_limt = [];
  destacados = [];
  mediaSub: Subscription;
  deviceXs: boolean;
  SlideOptions = { items: 6, dots: true, nav: true };
  SlideOptionsXs = { items: 3, dots: true, nav: true };
  descuento = null;
  valor_ant = null;
  precio_desc = null;
  descuentos =  {
    descuento: null,
    valor_ant : null,
    precio_des : null
  }
  disenioSesion18: any;
  btn_active = 1;
  //Objeto que almacenara todos los elementos del home que vienen del backend.
  disenoHome = {
    sesion_1 : [],
    sesion_2 : [],
    sesion_3 : [],
    sesion_4 : [],
    sesion_5 : [],
    sesion_6 : [],
    sesion_7 : [],
    sesion_8 : [],
    sesion_9 : [],
    sesion_10 : [],
    sesion_11 : [],
    sesion_12 : [],
    sesion_13 : [],
    sesion_14 : [],
    sesion_15 : [],
    sesion_16 : [],
    sesion_17 : [],
    sesion_18 : [],
  };


  deshabilitarCarga: boolean;


  /*
   * Carrusel productos primeros productos destacados 4 columnas
   */
  carouselDescatadosUno = [];
  carouselDescatadosUno8 = [];

  optionSlideDestacados = {
    items: 4,
    dots: false,
    nav: true
  }

  optionCarouselSlide = {
    // items: 3,
    dots: true,
    nav: true
  }


  constructor(public mediaObserver: MediaObserver, private http : SendHttpData, iconRegister : MatIconRegistry, sanitizer: DomSanitizer ) {
    iconRegister.addSvgIcon(
      'woman',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/woman.svg')
    );
    iconRegister.addSvgIcon(
      'woman_act',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/woman_act.svg')
    );
    iconRegister.addSvgIcon(
      'boy',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/boy.svg')
    );
    iconRegister.addSvgIcon(
      'boy_act',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/boy_act.svg')
    );
    iconRegister.addSvgIcon(
      'people',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/people.svg')
    );
    iconRegister.addSvgIcon(
      'people_act',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/people_act.svg')
    );
    iconRegister.addSvgIcon(
      'coupon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/coupon.svg')
    );
    iconRegister.addSvgIcon(
      'coupon_act',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/home_btn/coupon_act.svg')
    );
  }

  ngOnInit() {
    //this.deshabilitarCarga = true;
    // this.getProducts();
    this.size();

    // Obtener diseño.
    this.getDisenoHome();
    // Obtener productos destacados
    this.getProductsDest();
    this.getProductsDestContenido8();



  }

  size(){
    this.mediaSub = this.mediaObserver.media$.subscribe((res: MediaChange) => {
      this.deviceXs = res.mqAlias === "xs" ? true : false;
    });
  }
  async getDescuento(id, price) {
    return await this.http.httpGet('specific_prices/', 'filter[id_product]=' + id).toPromise().then(
      response => {
        if (response.length != 0) {
          var precios = response.specific_prices[0];
          this.descuento = precios.reduction;
          this.valor_ant = parseInt(price),
          this.precio_desc = this.valor_ant - (this.valor_ant * this.descuento);
          this.descuentos = {
            descuento: this.descuento,
            valor_ant : this.valor_ant,
            precio_des : this.precio_desc
          };
        }else{
          this.descuentos =  {
            descuento: null,
            valor_ant : null,
            precio_des : null
          }
        }
        return this.descuentos;
      },
      error => {

      }
    );
  }
  getProducts(){
      var filter_categories = "sort=[id_DESC]&limit=8";
      this.http.httpGet('products', filter_categories).subscribe(
        response => {
          var data = response.products;
          data.forEach((element, index) => {
            var img = this.http.getImageProduct(element.id, element.id_default_image);
            var product = {
              id :element.id,
              name: element.name[0]['value'],
              marca: element.manufacturer_name,
              image: img,
              price: null,
              new : (element.condition == "new") ? true : false,
              descuento : null,
              price_ant : null
            };
            if (index < 4) {
              this.destacados_limt.push(product);
            }
            var descuento = this.getDescuento(element.id, element.price);
            descuento.then(res => {
              product.price = (this.descuentos.precio_des == null) ? parseInt(element.price) : this.descuentos.precio_des;
              product.descuento = this.descuentos.descuento * 100;
              product.price_ant = this.descuentos.valor_ant;
            });
            this.destacados.push(product);

          });
        },
        error => { console.log("error." + error); }
      );


  }

  btnCatActive(val){
    this.btn_active = val;

    this.getProductsDestContenido8();
  }

  getDisenoHome(){
    this.http.httpGet('disenoHome').subscribe(
      response => {
        this.disenoHome = response;
        this.disenioSesion18 = response['sesion_18'];
        console.error(this.disenioSesion18);
      },
      error => {
        console.error("Error en el diseño.");
      }
    );
  }

  getProductsDest(){
    this.http.httpGet('productosDestacados').subscribe(
      response => {
        this.carouselDescatadosUno = response;
      },
      error => {
        console.error("Error consumiento productos destacados.");
      }
    );
   // this.deshabilitarCarga = false;
  }

  getProductsDestContenido8(){
    this.http.httpGetParamt('productosDestacadosPromociones',this.btn_active ).subscribe(
      response => {
        this.carouselDescatadosUno8 = response;
        console.log(this.carouselDescatadosUno8);
      },
      error => {
        console.error("Error consumiento productos destacados.");
      }
    );
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }

}
