import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  loginData: any;
  inicioSesion: boolean;

  constructor(public ruta: Router) {

    this.loginData = localStorage.getItem('userAthletic');

    if(this.loginData) {
      this.inicioSesion = true;
    } else {
      this.inicioSesion = false;
    }

  }

  canActivate(): boolean {

    if(this.inicioSesion) {
      return true;
    } else {
      this.ruta.navigate(['/']);
      return false;
    }
  }

}
