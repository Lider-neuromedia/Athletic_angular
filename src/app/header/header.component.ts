import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() deviceXs: boolean;
  @Output() openBolsa = new EventEmitter<boolean>();

  toggleOpenBolsa(){
    this.openBolsa.emit(true);
  }

}

