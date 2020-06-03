import { Component, OnInit, Input } from '@angular/core';

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

  ngOnInit(): void {
    
  }

}
