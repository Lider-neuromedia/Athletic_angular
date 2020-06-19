import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendHttpData {
  private baseUrl = 'http://pruebasneuro.co/N-1007/api/';
  // Key prestashop
  private key = "JQAET8SZT35N4G8HHDG7XJF7BS6PCCNW";
  // Url que define el output para recibir en formato JSON y no XML.
  private full = "display=full";

  constructor(private _http: HttpClient) { }

  private buildUrl(type:string, filter = null, full = true){
    var url = this.baseUrl + "/" + type + "?ws_key=" + this.key;
    if (full) {
      url = url + "&" + this.full;
    }
    if (filter != null) {
      url = url + "&" + filter;
    }
    return url;
  }

  // Peticion Http GET
  httpGet(route:string, filter:string = null, full=true):Observable<any>{
    var url = this.buildUrl(route, filter, full);
    return this._http.get(url);
  }

  // Peticion Http GET
  httpPost(route:string, data:any):Observable<any>{
    var url = this.buildUrl(route, false);
    return this._http.post(url, data);
  }

  // Peticion Http PUT
  httpPut(route:string, data:any):Observable<any>{
    var url = this.buildUrl(route, false);
    return this._http.put(url, data);
  }

  // Imagenes de productos.
  getImageProduct(id_prod, id_image){
    return "http://pruebasneuro.co/N-1007/api/images/products/" + id_prod + "/" + id_image +"?ws_key=JQAET8SZT35N4G8HHDG7XJF7BS6PCCNW";
  }

}
