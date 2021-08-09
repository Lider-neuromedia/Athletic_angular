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
import Swal from 'sweetalert2';

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

  signInWithGoogle() {
    
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(respuesta => {
      Swal.fire('Cargando', 'Espere por favor validamos el email', 'info');
      Swal.showLoading();
      console.log(respuesta);

      const data = {
        estado: 1,
        deleted: 0,
        id_tienda: 1,
        password: respuesta[`email`],
        apellidos: respuesta[`lastName`],
        nombres: respuesta[`firstName`],
        email: respuesta[`email`],
        fecha_nacimiento: "1942-01-01",
        genero: 1,
        tipo_registro: 2,
        clave: respuesta[`email`]
      };
      console.log(data);
      Swal.close();
      this.http.httpPost('clientes-register', data).toPromise().then(response => {
        console.log(response[`user`]);
        Swal.fire('Registrado correctamente', '', 'success');

        if (response && response['estado'] == true) {
          this.alertaS.showToasterWarning(response['mensaje']);
          return;
        }

        if (response[`user`]) {
          this.usuario = response[`user`];
          localStorage.setItem('userAthletic', JSON.stringify(response[`user`]));
          this.loginGlobal.changeMessage();
          this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
          if (this.producto) {
            this.agregarProductoFavorito();
            this.router.navigate(['/favoritos']);
          } else {
            this.router.navigate(['/']);
          }

        }
      }).catch( error => {
        Swal.fire(error.error.errors.email[0],'','error');
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
        fecha_nacimiento: "1942-01-01",
        genero: 1,
        tipo_registro: 3,
        clave: respuesta[`email`]
      };
      console.log(data);

      Swal.fire('Cargando', 'Espere por favor validamos el email', 'info');
      Swal.showLoading();

      this.http.httpPost('clientes-register', data).toPromise().then(response => {
        console.log(response[`user`]);
        Swal.fire('Registrado correctamente', '', 'success');

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
            this.router.navigate(['/']);
          }


        }
      }).catch( error => {
        Swal.fire(error.error.errors.email[0],'','error');
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
