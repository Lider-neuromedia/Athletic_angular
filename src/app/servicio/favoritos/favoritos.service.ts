import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FavoritosService {


  private data = new BehaviorSubject(null);
  currentMessage = this.data.asObservable();
  //data: any;

  changeMessage() {

    this.consultarDatosLocales();
  }

  constructor() {

    this.consultarDatosLocales();

  }

  consultarDatosLocales() {
    this.data.next(JSON.parse(localStorage.getItem('userAthletic'))) ;
    console.log(this.data)

  }
}