import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendHttpData {
  private baseUrl = 'http://localhost/athletic/backend/athletic/api/';
  // Key prestashop
  private key = "RGXUNK82QHKWKQXNSR3YX11K59QECPX1";
  // Url que define el output para recibir en formato JSON y no XML.
  private url_Addons = "output_format=JSON&display=full";

  constructor(private _http: HttpClient) { }

  private buildUrl(type:string, addons = true){
    if (addons) {
      return this.baseUrl + "/" + type + "?ws_key=" + this.key + "&" + this.url_Addons;
    }else{
      return this.baseUrl + "/" + type + "?ws_key=" + this.key;
    }
    
  }

  // Peticion Http GET
  httpGet(route:string):Observable<any>{
    var url = this.buildUrl(route);
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

}
