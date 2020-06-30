import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {SendHttpData} from '../tools/SendHttpData';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private http : SendHttpData) { }
  hide = true;

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    var user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
  }

  sendLogin() {
    if (this.email.errors == null && this.password.errors == null) {
        var filter = "filter[email]=" + this.email.value;
        this.http.httpGet('customers', filter).toPromise().then(
          response => {
            if (response.customers != undefined) {
              var val_login = bcrypt.compareSync(this.password.value, response.customers[0]['passwd']);
              if (val_login) {
                sessionStorage.setItem('user', JSON.stringify(response.customers[0]));
                alert("Logueado.");
              }
              
            }else{
              alert("error, user no existe");
            }

          }, 
          error => {

          }
        );
    }
  }

  getErrorMessage() {
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

}
