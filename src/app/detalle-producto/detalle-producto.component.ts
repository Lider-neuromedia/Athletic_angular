import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SendHttpData } from '../tools/SendHttpData';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  producto = {
    id : null,
    marca : null,
    name : null,
    referencia : null,
    price : null,
    resumen : null,
    descripcion : null,
    category : null,
    precio_ant : null,
    descuento : null
  };
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  descuento;
  valor_ant;
  precio_desc;
  productos_relac = [];
  prod = [];
  cantidad = 1;
  tallas = [];

  constructor(private route_params: ActivatedRoute, public router : Router, private http: SendHttpData) { }

  ngOnInit(): void {
    this.getProducts(this.route_params.snapshot.params.id);
    /*this.galleryImages = [{
      small: "/assets/img/productos/producto-interna.png",
      medium: "/assets/img/productos/producto-interna.png",
      big: "/assets/img/productos/producto-interna.png"
    }];
    console.log(this.galleryImages);*/
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
    console.log(productos);
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

  // Productos  
  getProducts(id) {
    this.http.httpGet('products/' + id, null, false).subscribe(
      response => {
        if (response.product != undefined) {
          if (response.product.associations.accessories != undefined) {
            this.getProductsRelac(response.product.associations.accessories);
          }
          if (response.product.associations.product_option_values != undefined) {
            this.getProductValue(response.product.associations.product_option_values);
          }
          
          var data = response.product;
          var images = data.associations.images;
          var gallery = [];
          // Imagenes.
          images.forEach(element => {
            var img = {
              small: this.http.getImageProduct(data.id, element.id),
              medium: this.http.getImageProduct(data.id, element.id),
              big: this.http.getImageProduct(data.id, element.id)
            }
            gallery.push(img);
          });
          // Categorias.
          var categorias = data.associations.categories;
          var ultima_categoria = categorias[categorias.length - 1]['id']; 
          var sub_categoria = null;
          this.http.httpGet('specific_prices/', 'filter[id_product]=' + data.id).subscribe(
            response => {
              if (response.length != 0) {
                var precios = response.specific_prices[0];
                this.descuento = precios.reduction;
                this.valor_ant = parseInt(data.price),
                this.precio_desc = this.valor_ant - (this.valor_ant * this.descuento);
              }else{
                this.descuento = null;
                this.valor_ant = null,
                this.precio_desc = null;
              }
            },
            error => {

            }
          );
          this.http.httpGet('categories/' + ultima_categoria, null, false).subscribe(
            response => {
              sub_categoria = response.category.name[0]['value'];
              var product = {
                id : data.id,
                marca : data.manufacturer_name,
                name : data.name[0]['value'],
                referencia : data.reference,
                price : (this.precio_desc == null) ? parseInt(data.price) : this.precio_desc,
                resumen : data.description_short[0]['value'].replace(/<[^>]*>?/g, ''),
                descripcion : data.description[0]['value'].replace(/<[^>]*>?/g, ''),
                category : sub_categoria,
                descuento : this.descuento,
                precio_ant : this.valor_ant
              };
              this.galleryImages = gallery;
              this.producto = product;
            },
            error => { console.log("error." + error); }
          );

        } else {
          // this.producto = [];
        }
      },
      error => { console.log("error." + error); }
    );
  }
  
  changeCantidad(sum){
    if (sum) {
      this.cantidad = this.cantidad + 1;
    }else{
      if (this.cantidad > 1) {
        this.cantidad = this.cantidad - 1;
      }
    }
  }

}
