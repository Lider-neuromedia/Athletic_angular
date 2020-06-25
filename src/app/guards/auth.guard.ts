import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalVarService } from '../common/global-var.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operator/map';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router, private globalVar : GlobalVarService) { 

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('user')) {
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
  }
  
}
