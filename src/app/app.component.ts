import { Component } from '@angular/core';
import {SendHttpData} from './tools/SendHttpData';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Carousel.
  title = 'owl-carousel';
  myCarouselImages =['assets/img/marcas/adidas.png','assets/img/marcas/new_balance.png','assets/img/marcas/puma.png','assets/img/marcas/nike.png','assets/img/marcas/fila.png','assets/img/marcas/skechers.png','assets/img/marcas/reebok.png'];
  mySlideOptions={items: 7, dots: false, nav: true};

  constructor( private http: SendHttpData, iconRegister : MatIconRegistry, sanitizer: DomSanitizer ) {
      iconRegister.addSvgIcon(
        'woman',
        sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/woman.svg')
      );
   }

  ngOnInit(): void {
    this.getCategories();
    this.pruebaPut();
  }

  pruebaPut(){
    var data = {
      "customers": {
          "id": "2",
          "active": "1",
          "deleted": "0",
          "passwd": "29fb8fdb5c556ffc750b039a26168e6e",
          "lastname": "DOssE",
          "firstname": "Jsohn",
          "email": "pub@prestashop.com",
          "birthday": "1970-01-15"
        }
    };
    this.http.httpPut('customers', data).subscribe(
      response => {
        console.log(response);
      },
      error => {

      }
    );
  }

  getCategories(){
    this.http.httpGet('categories').subscribe(
      response => {
        console.log(response);  
      },
      error => {

      }
    );
  }

}
