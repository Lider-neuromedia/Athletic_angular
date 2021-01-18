import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {SendHttpData} from '../app/tools/SendHttpData';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {OwlModule} from 'ngx-owl-carousel';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Ng5SliderModule} from 'ng5-slider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxGalleryModule} from 'ngx-gallery-9';
// Components
import {HeaderComponent} from './header/header.component';
import {AppComponent} from './app.component';
import {ContentComponent} from './content/content.component';
import {FooterComponent} from './footer/footer.component';
import {ItemProductoComponent} from './item-producto/item-producto.component';
import {ProductosComponent} from './productos/productos.component';
import {AppRoutingModule} from './app-routing.module';
import {PaginatePipe} from './pipes/paginate.pipe';
import {DetalleProductoComponent} from './detalle-producto/detalle-producto.component';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {VistaPreviaComponent} from './vista-previa/vista-previa.component';
import {LoginComponent} from './login/login.component';
import {AsideAccountComponent} from './partials/aside-account/aside-account.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {ResenaComponent} from './resena/resena.component';
import {CuponesComponent} from './cupones/cupones.component';
import {PerfilComponent} from './perfil/perfil.component';
import {DireccionesComponent} from './direcciones/direcciones.component';
import {FavoritosComponent} from './favoritos/favoritos.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AgregarCarritoComponent} from './agregar-carrito/agregar-carrito.component';
import {ResenaDetalleComponent} from './resena-detalle/resena-detalle.component';
import {GuardarDireccionesComponent} from './guardar-direcciones/guardar-direcciones.component';
import {ToastrModule} from 'ngx-toastr';
import { DetalleCompraComponent } from './detalle-compra/detalle-compra.component';
import {MatTreeModule} from '@angular/material/tree';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { BuscadorTiendaComponent } from './buscador-tienda/buscador-tienda.component';
import { ComentarioProductoComponent } from './comentario-producto/comentario-producto.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ItemProductoComponent,
    FooterComponent,
    ProductosComponent,
    PaginatePipe,
    DetalleProductoComponent,
    VistaPreviaComponent,
    LoginComponent,
    AsideAccountComponent,
    PedidosComponent,
    ResenaComponent,
    CuponesComponent,
    PerfilComponent,
    DireccionesComponent,
    FavoritosComponent,
    AgregarCarritoComponent,
    ResenaDetalleComponent,
    GuardarDireccionesComponent,
    DetalleCompraComponent,
    DetallePedidoComponent,
    BuscadorTiendaComponent,
    ComentarioProductoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    OwlModule,
    FlexLayoutModule,
    Ng5SliderModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxGalleryModule,
    AutocompleteLibModule,
    NgbModule,
    MatTreeModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      //positionClass: 'toast-bottom-right',
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
  ],
  providers: [SendHttpData, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
