import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Athletic';
  bolsa = false;

  constructor() {}
  ngOnInit() {

  }
  
  openBolsa($event){
    this.bolsa = $event;
  }

}
