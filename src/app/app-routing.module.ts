import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ResenaComponent } from './resena/resena.component';
import { ResenaDetalleComponent } from './resena-detalle/resena-detalle.component';
import { CuponesComponent } from './cupones/cupones.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DireccionesComponent } from './direcciones/direcciones.component';
import { GuardarDireccionesComponent } from './guardar-direcciones/guardar-direcciones.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { ContentComponent } from './content/content.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { LoginComponent } from './login/login.component';
import {DetalleCompraComponent} from "./detalle-compra/detalle-compra.component";
import {AuthGuard} from "./guards/auth.guard";
import {DetallePedidoComponent} from "./detalle-pedido/detalle-pedido.component";
import {DetalleCuponComponent} from "./detalle-cupon/detalle-cupon.component";

const routes : Routes = [
  {
    path: '', component: ContentComponent
  },
  {
    path: 'productos', component: ProductosComponent
  },
  {
    path: 'pedidos', component: PedidosComponent
  },
  {
    path: 'resenas', component: ResenaComponent
  },
  {
    path: 'resena-detalle', component: ResenaDetalleComponent
  },
  {
    path: 'cupones', component: CuponesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil', component: PerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'direcciones', component: DireccionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-direcciones', component: GuardarDireccionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'favoritos', component: FavoritosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-producto/:id', component: DetalleProductoComponent
  },
  {
    path: 'detalle-de-la-compra', component: DetalleCompraComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'modificar-direcciones/:id', component: DireccionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'validar-cupon/:id', component: DetalleCuponComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-pedido/:id', component: DetallePedidoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'productos/:marca/:nombre/:categoria',
    component: ProductosComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
