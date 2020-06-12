import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.css']
})
export class ItemProductoComponent implements OnInit {

  constructor() { }
  @Input() subtitle: string;
  @Input() image: string;
  @Input() title: string;
  @Input() price: string;
  @Input() nuevo: boolean;
  @Input() descuento: string;
  @Input() price_ant: string;
  @Input() small: boolean;
  @Input() showButtons: boolean;
  @Input() full_view: boolean;

  ngOnInit(): void {
    if (this.showButtons) {
      this.jQuery();
    }
  }

  jQuery(){
    $('.content-item-product').hover(function(){
      $(this).children('.cont-btn-prod').css('display', 'flex');
      $(this).children('.item-product').addClass('item-shadow');
    },
    function(){
      $(this).children('.cont-btn-prod').css('display', 'none');
      $(this).children('.item-product').removeClass('item-shadow');
    });
  }

}
