import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendHttpData {

  //private baseUrl = 'http://pruebasneuro.co/N-1041/public/api/';
   private baseUrl = 'http://localhost:8000/api/';

 //private baseUrl = ' https://pruebasneuro.co/N-1061/api/public/api/';
  // Key prestashop
  // private key = "JQAET8SZT35N4G8HHDG7XJF7BS6PCCNW";
  // private full = "display=full"; Neuro*123$

  constructor(private _http: HttpClient) { }

  // private buildUrl(type:string, filter = null, full = true){
  //   var url = this.baseUrl + "/" + type + "?ws_key=" + this.key;
  //   if (full) {
  //     url = url + "&" + this.full;
  //   }
  //   if (filter != null) {Neuro2020*
  //     url = url + "&" + filter;
  //   }
  //   return url;
  // }

  // Peticion Http GET
  httpGet(route:string, filter:string = null, full=true):Observable<any>{
    var url = this.baseUrl + route;
    return this._http.get(url);
  }

  // Peticion Http GET
  httpPost(route:string, data:any):Observable<any>{
    var url = this.baseUrl + route;
    return this._http.post(url, data);
  }

  // Peticion Http PUT
  httpPut(route:string, data:any):Observable<any>{
    var url = this.baseUrl + route;
    return this._http.put(url, data);
  }

  httpGetParamt(route:string, codigo: number, filter:string = null, full=true):Observable<any>{
    var url = this.baseUrl + route + '/' + codigo;
    return this._http.get(url);
  }

  // Imagenes de productos.
  getImageProduct(id_prod, id_image){
    return "http://pruebasneuro.co/N-1007/api/images/products/" + id_prod + "/" + id_image +"?ws_key=JQAET8SZT35N4G8HHDG7XJF7BS6PCCNW";
   // return "http://localhost:8000/api/images/products/" + id_prod + "/" + id_image +"?ws_key=JQAET8SZT35N4G8HHDG7XJF7BS6PCCNW";
  }

  httpGetPaginar(route:string, filter:string = null, full=true):Observable<any>{
    var url = route;
    return this._http.get(url);
  }


  peticionPost(ruta, data) {
    return this._http.post(ruta, data,{responseType: 'text'});
  }


}
