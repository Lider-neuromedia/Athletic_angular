import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import {FormBuilder} from "@angular/forms";
import {GlobalVarService} from "../common/global-var.service";
import {SendHttpData} from "../tools/SendHttpData";
import {Router} from "@angular/router";
import {AlertasService} from "../servicio/alertas/alertas.service";
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {FavoritosService} from "../servicio/favoritos/favoritos.service";
import {VariablesService} from "../servicio/variable-global/variables.service";

@Component({
  selector: 'app-login-social',
  templateUrl: './login-social.component.html',
  styleUrls: ['./login-social.component.css']
})
export class LoginSocialComponent implements OnInit {
  usuario: any;
  producto: any;
  carritoCompras: any;
  constructor(private authService: SocialAuthService,
              private formBuilder: FormBuilder,
              public globalVar: GlobalVarService,
              private http: SendHttpData,
              public router: Router,
              private alertaS: AlertasService,
              private loginGlobal: LoginGlobalService,
              private favoritoSe: FavoritosService,
              private variablesGl: VariablesService,
              private favorito: FavoritosService,
              ) { }

  ngOnInit(): void {
    this.producto = localStorage.getItem('favoritos');
    this.carritoCompras = JSON.parse(localStorage.getItem('athletic'));
    this.signOut()

  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(respuesta => {


      const data = {
        estado: 1,
        deleted: 0,
        id_tienda: 1,
        password: respuesta[`email`],
        apellidos: respuesta[`lastName`],
        nombres: respuesta[`firstName`],
        email: respuesta[`email`],
        fecha_nacimiento: '',
        genero: 1,
        tipo_registro: 2,
        clave: respuesta[`email`]
      };
      console.log(data);

      this.http.httpPost('clientes-register', data).toPromise().then(response => {
        console.log(response[`user`]);

        if (response && response['estado'] == true) {
          this.alertaS.showToasterWarning(response['mensaje']);
          return;
        }

        if (response[`user`]) {
          console.log(response[`user`]);
          this.usuario = response[`user`];
          localStorage.setItem('userAthletic', JSON.stringify(response[`user`]));
          this.loginGlobal.changeMessage();
          this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
        //  this.router.navigate(['/perfil']);
          if (this.producto) {
            this.agregarProductoFavorito();
            this.router.navigate(['/favoritos']);
          } else {
            if (this.carritoCompras.length > 0) {
              this.router.navigate(['/detalle-de-la-compra']);
            } else {
              this.router.navigate(['/perfil']);
            }

          }

        }
      }).catch( error => {
        console.log(error);
      })

    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(respuesta => {

      const data = {
        estado: 1,
        deleted: 0,
        id_tienda: 1,
        password: respuesta[`email`],
        apellidos: respuesta[`lastName`],
        nombres: respuesta[`firstName`],
        email: respuesta[`email`],
        fecha_nacimiento: '',
        genero: 1,
        tipo_registro: 3,
        clave: respuesta[`email`]
      };
      console.log(data);

      this.http.httpPost('clientes-register', data).toPromise().then(response => {
        console.log(response[`user`]);

        if (response && response['estado'] == true) {
          this.alertaS.showToasterWarning(response['mensaje']);
          return;
        }

        if (response[`user`]) {
          console.log(response[`user`]);
          this.usuario = response[`user`];
          localStorage.setItem('userAthletic', JSON.stringify(response[`user`]));
          this.loginGlobal.changeMessage();
          this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));


          if (this.producto) {
            this.agregarProductoFavorito();
            this.router.navigate(['/favoritos']);
          } else {
            if (this.carritoCompras.length > 0) {
              this.router.navigate(['/detalle-de-la-compra']);
            } else {
              this.router.navigate(['/perfil']);
            }
          }

        }
      }).catch( error => {
        console.log(error);
      })


    }).catch(error => {
      console.log(error);
    });
  }

  signOut(): void {
    this.authService.signOut();
  }




  agregarProductoFavorito() {

    const data = {
      usuario: this.usuario['id_cliente'],
      producto:  this.producto
    };


    this.http.httpPost('agregar-productos-favorito', data).toPromise().then(respuesta => {
      if (respuesta[`estado`]) {
        this.favorito.changeMessage();
        this.alertaS.showToasterFull(`Articulo agregado a favoritos`);
        localStorage.removeItem('favoritos');
      }
    }).catch(error => {

    })

    console.log(this.producto, data);
  }



}
