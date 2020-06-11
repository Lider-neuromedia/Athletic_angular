import { Component, Input, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {SendHttpData} from '../tools/SendHttpData';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  title = 'owl-carousel';
  CarouselImages =['assets/img/marcas/adidas.png','assets/img/marcas/new_balance.png','assets/img/marcas/puma.png','assets/img/marcas/nike.png','assets/img/marcas/fila.png','assets/img/marcas/skechers.png','assets/img/marcas/reebok.png'];
  SlideOptions = { items: 6, dots: true, nav: true };  
  destacados_limt = [];
  destacados = [];

  constructor( private http : SendHttpData, iconRegister : MatIconRegistry, sanitizer: DomSanitizer ) {
    iconRegister.addSvgIcon(
      'woman',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/woman.svg')
    );
 }

  ngOnInit() {
    this.getProducts();
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
              price: parseInt(element.price),
              new : (element.condition == "new") ? true : false
            };
            if (index < 4) {
              this.destacados_limt.push(product);
            }
            this.destacados.push(product);
          });
          console.log(this.destacados);
        },
        error => { console.log("error." + error); }
      );
  }
  
}
