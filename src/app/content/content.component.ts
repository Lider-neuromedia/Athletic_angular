import { Component, Input, HostListener } from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {

  title = 'owl-carousel';
  CarouselImages =['assets/img/marcas/adidas.png','assets/img/marcas/new_balance.png','assets/img/marcas/puma.png','assets/img/marcas/nike.png','assets/img/marcas/fila.png','assets/img/marcas/skechers.png','assets/img/marcas/reebok.png'];
  SlideOptions = { items: 6, dots: true, nav: true };  

  constructor( iconRegister : MatIconRegistry, sanitizer: DomSanitizer ) {
    iconRegister.addSvgIcon(
      'woman',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/woman.svg')
    );
 }

  
  @Input() deviceXs: boolean;
  topVal = 0;
  onScroll(e) {
    let scrollXs = this.deviceXs ? 55 : 73;
    if (e.srcElement.scrollTop < scrollXs) {
      this.topVal = e.srcElement.scrollTop;
    } else {
      this.topVal = scrollXs;
    }
  }
  sideBarScroll() {
    let e = this.deviceXs ? 160 : 130;
    return e - this.topVal;
  }

}
