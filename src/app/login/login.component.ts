import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SendHttpData } from '../tools/SendHttpData';
//import * as bcrypt from 'bcryptjs';
import { GlobalVarService } from '../common/global-var.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import {LoginGlobalService} from "../servicio/login-global/login-global.service";
import {AlertasService} from "../servicio/alertas/alertas.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  // Register
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
              private formBuilder: FormBuilder,
              public globalVar: GlobalVarService,
              private http: SendHttpData,
              public router: Router,
              private alertaS: AlertasService,
              private loginGlobal: LoginGlobalService) {

    this.myForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: [''],
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email_new: new FormControl('', [Validators.required, Validators.email]),
      fecha_nacimiento: new FormControl(),
      genero: new FormControl('')
    }, { validator: this.checkPasswords });

  }

  ngOnInit(): void { }

  sendLogin() {
    if (this.email.errors == null && this.password.errors == null) {
      var data = { email: this.email.value, password: this.password.value };
      this.http.httpPost('clientes-login', data).subscribe(
        response => {
          if (response.response == 'error') {
            this.alertaS.showToasterError('credenciales invalidas');
          } else {
            localStorage.setItem('userAthletic', JSON.stringify(response.user));
            localStorage.setItem('token', JSON.stringify(response.token));
            this.loginGlobal.changeMessage();
            this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
            this.router.navigate(['/perfil']);
          }
        },
          error => {
            console.error("error en la peticion.");
          }
      );
    }
  }

  // Falta Validar Registro.
  sendRegister() {

    console.log(this.myForm);


    if (this.myForm.errors == null) {
      //var salt = bcrypt.genSaltSync(10);
     // var passwd = bcrypt.hashSync(this.myForm.value.password, salt);
      var fecha_nacimiento = this.myForm.value.fecha_nacimiento.toISOString().slice(0, 10);

      const data = {
          estado: 1,
          deleted: 0,
          id_tienda: 1,
          password: this.myForm.value.password,
          apellidos: this.myForm.value.last_name,
          nombres: this.myForm.value.first_name,
          email: this.myForm.value.email_new,
          fecha_nacimiento: fecha_nacimiento,
          genero: this.myForm.value.genero
      }

      this.http.httpPost('clientes-register', data).toPromise().then(response => {
        console.log(response[`user`]);

        if (response && response['estado'] == true) {
          this.alertaS.showToasterWarning(response['mensaje']);
          return;
        }

        if (response[`user`]) {
          console.log(response[`user`]);
          localStorage.setItem('userAthletic', JSON.stringify(response[`user`]));
          this.loginGlobal.changeMessage();
          this.globalVar.setUser(JSON.parse(localStorage.getItem('userAthletic')));
          this.router.navigate(['/perfil']);
        }
        }).catch( error => {
          console.log(error);
      })
    }
  }

  getErrorMessageLogin() {
    if (this.email.hasError('required')) {
      return 'El campo es requerido.';
    }
    if (this.email.hasError('email')) {
      return 'Debe ser en formato email';
    }
    if (this.password.hasError('password')) {
      return 'Debe ser en formato email';
    }
  }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    let controls = group.controls;
    if (controls.first_name.errors != null || controls.last_name.errors != null || controls.email_new.errors != null) {
      return { error: true };
    } else if (pass != confirmPass) {
      return { notSame: true };
    } else {
      return null;
    }

  }


  validarCampos() {
    if (this.myForm.value.confirmPassword === '' || this.myForm.value.confirmPassword === null ||
      this.myForm.value.password === '' || this.myForm.value.password === null ||
      this.myForm.value.first_name === '' || this.myForm.value.first_name === null ||
      this.myForm.value.last_name === '' || this.myForm.value.last_name === null ||
      this.myForm.value.email_new === '' || this.myForm.value.email_new === null ||
      this.myForm.value.fecha_nacimiento === '' || this.myForm.value.fecha_nacimiento === null ||
      this.myForm.value.genero === '' || this.myForm.value.genero === null
    ) {
      return  true;
    } else {
      return false;
    }
  }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
