import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SendHttpData } from '../tools/SendHttpData';
import * as bcrypt from 'bcryptjs';
import { GlobalVarService } from '../common/global-var.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

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

  constructor(private formBuilder: FormBuilder, public globalVar: GlobalVarService, private http: SendHttpData, public router: Router) {

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
            alert('credenciales invalidas');
          } else {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', JSON.stringify(response.token));
            this.globalVar.setUser(JSON.parse(localStorage.getItem('user')));
            this.router.navigate(['/']);
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
    if (this.myForm.errors == null) {
      var salt = bcrypt.genSaltSync(10);
      var passwd = bcrypt.hashSync(this.myForm.value.password, salt);
      var fecha_nacimiento = this.myForm.value.fecha_nacimiento.toISOString().slice(0, 10);
      var data = {
        "customers": {
          "id_default_group": 3,
          "active": 1,
          "deleted": 0,
          "passwd": passwd,
          "lastname": this.myForm.value.last_name,
          "firstname": this.myForm.value.first_name,
          "email": this.myForm.value.email_new,
          "birthday": fecha_nacimiento,
          "id_gender": this.myForm.value.genero
        }
      };

      this.http.httpPost('customers', data).toPromise().then(
        response => {
          localStorage.setItem('user', JSON.stringify(response.customer));
          this.globalVar.setUser(JSON.parse(localStorage.getItem('user')));
          this.router.navigate(['/']);
        },
        error => {

        }
      );
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

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}