import {Component, OnInit, Renderer2} from '@angular/core';
import {Router} from "@angular/router";
import {SendHttpData} from "../../tools/SendHttpData";
import {AlertasService} from "../../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../../servicio/login-global/login-global.service";
import {VariablesService} from "../../servicio/variable-global/variables.service";

@Component({
  selector: 'app-aside-account',
  templateUrl: './aside-account.component.html',
  styleUrls: ['./aside-account.component.css']
})
export class AsideAccountComponent implements OnInit {
  usuario:any;
  constructor(   public router: Router,
                 private http: SendHttpData,
                 private render: Renderer2,
                 private alertaS: AlertasService,
                 private loginGlobal: LoginGlobalService,
                 private variablesGl: VariablesService) {

    this.llamarDatoLocalesUsuario();
  }

  ngOnInit(): void {
  }

  cerrarSesion(){

    sessionStorage.clear();
    localStorage.removeItem('userAthletic');
    this.loginGlobal.changeMessage();
    this.usuario = null;
    this.llamarDatoLocalesUsuario();
    this.router.navigate(['/']);
  }

  llamarDatoLocalesUsuario() {

    this.loginGlobal.currentMessage.subscribe(response => {
      this.usuario = response;
    });

  }

}
