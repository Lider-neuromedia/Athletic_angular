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
import { NgxImgZoomModule } from 'ngx-img-zoom';



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
import { MatTreeModule} from '@angular/material/tree';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { BuscadorTiendaComponent } from './buscador-tienda/buscador-tienda.component';
import { ComentarioProductoComponent } from './comentario-producto/comentario-producto.component';
import { FlechaArribaComponent } from './flecha-arriba/flecha-arriba.component';
import { MatAccordion, MatExpansionModule} from "@angular/material/expansion";
import { DetalleCuponComponent } from './detalle-cupon/detalle-cupon.component';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { RecuperarClaveComponent } from './recuperar-clave/recuperar-clave.component';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { ModalDireccionesComponent } from './modal-direcciones/modal-direcciones.component';
import { LoginSocialComponent } from './login-social/login-social.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

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
    ComentarioProductoComponent,
    FlechaArribaComponent,
    DetalleCuponComponent,
    RecuperarClaveComponent,
    RegistroFormComponent,
    ModalDireccionesComponent,
    LoginSocialComponent,

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
    MatExpansionModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      //positionClass: 'toast-bottom-right',
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    SocialLoginModule,
    NgxImgZoomModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('1084128390461-oljoka407us8td8prjjvtnn6vh2rb2im.apps.googleusercontent.com' )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('459730468737450')
          }
        ]
      } as SocialAuthServiceConfig,
    },
    SendHttpData,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],

  exports: [
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
