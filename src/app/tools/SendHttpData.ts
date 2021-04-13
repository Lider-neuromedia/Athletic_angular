import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SendHttpData {

  //  private baseUrl = 'http://localhost:8000/api/';

  private baseUrl = 'https://pruebasneuro.co/N-1061/api/public/api/';
  cargandoProducto: boolean = false;
  cargandoCategoria: boolean = false;
  cargandoMarca: boolean = false;
  cargandoCateProdBan: boolean = false;
  cargandoCateProd: boolean = false;
  cargandoProductos: boolean = false;
  cargandoDisenoHome: boolean = false;
  cargandoProdDest: boolean = false;
  cargandoProdDestProm: boolean = false;
  cargandoFiltro: boolean = false;
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
  getProductosDestacadosPromociones(id: number): Observable<any>{
    if(this.cargandoProdDestProm){
      return of([]);
    }
    this.cargandoProdDestProm = true;
    let url = `${this.baseUrl}productosDestacadosPromociones/${id}`;
    return this._http.get(url).pipe( tap( () => this.cargandoProdDestProm = false));
  }
  getProductosDestacados(): Observable<any>{
    if(this.cargandoProdDest){
      return of([]);
    }
    this.cargandoProdDest = true;
    let url = `${this.baseUrl}productosDestacados`;
    return this._http.get(url).pipe( tap( () => this.cargandoProdDest = false));
  }
  getDisenoHome(): Observable<any>{
    if(this.cargandoDisenoHome){
      return of([]);
    }
    this.cargandoDisenoHome = true;
    let url = `${this.baseUrl}disenoHome`;
    return this._http.get(url).pipe( tap( () => this.cargandoDisenoHome = false));
  }
  getProductos(): Observable<any>{
    if(this.cargandoProductos){
      return of([]);
    }
    this.cargandoProductos = true;
    var url = this.baseUrl;
    return this._http.get(url).pipe(tap( () => this.cargandoProductos = false));
  }
  getCategorias(): Observable<any>{
    if(this.cargandoCategoria){
      return of([]);
    }
    this.cargandoCategoria = true;
    let url = `${this.baseUrl}categorias`;
    return this._http.get(url).pipe(tap( () => this.cargandoCategoria = false));
  }

  getMarca(): Observable<any>{
    if(this.cargandoMarca){
      return of([]);
    }
    this.cargandoMarca = true;
    let url = `${this.baseUrl}marcas`;
    return this._http.get(url).pipe( tap (() => this.cargandoMarca = false));
  }

  getCategoriasProductosBanner(){
    if(this.cargandoCateProdBan){
      return of([]);
    }
    this.cargandoCateProdBan = true;
    let url = `${this.baseUrl}categorias-productos-banner`;
    return this._http.get(url).pipe( tap( () => this.cargandoCateProdBan = false));
  }

  getCategoriasProductos(id: number){
    if(this.cargandoCateProd){
      return of([]);
    }
    this.cargandoCateProd = true;
    let url = `${this.baseUrl}categorias-productos/${id}`;
    return this._http.get(url).pipe( tap( () => this.cargandoCateProd = false));
  }

  getProducto(id: number): Observable<any>{
    if(this.cargandoProducto){
      return of([]);
    }
    this.cargandoProducto = true;
    let url = `${this.baseUrl}productos/${id}`;
    this._http.get(url).pipe(tap(()=> this.cargandoProducto = false));
  }

  setProductoFiltro(data: any): Observable<any>{
    if(this.cargandoFiltro){
      return of([]);
    }
    this.cargandoFiltro = true;
    let url = `${this.baseUrl}filters`;
    return this._http.post(url, data).pipe(tap(() => this.cargandoFiltro = false));
  }


  // Peticion Http POST
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
