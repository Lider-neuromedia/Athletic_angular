import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVarService } from '../../common/global-var.service';

@Component({
  selector: 'app-aside-account',
  templateUrl: './aside-account.component.html',
  styleUrls: ['./aside-account.component.css']
})
export class AsideAccountComponent implements OnInit {
  globalStorage : any;
  usuario : any;
  constructor(public router: Router, private globalVar : GlobalVarService) { 
    this.globalStorage = this.globalVar.user.subscribe(
      value => {
        this.usuario = value;
      }
    );
  }

  ngOnInit(): void {
  }

  cerrarSesion(){
    localStorage.clear();
    this.globalVar.setUser(null);
    this.router.navigate(['/']);
  }

}
