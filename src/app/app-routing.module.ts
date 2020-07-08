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

const routes : Routes = [
  { path: '', component: ContentComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: 'resenas', component: ResenaComponent },
  { path: 'resena-detalle', component: ResenaDetalleComponent },
  { path: 'cupones', component: CuponesComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'direcciones', component: DireccionesComponent },
  { path: 'mis-direcciones', component: GuardarDireccionesComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'detalle-producto/:id', component: DetalleProductoComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }), 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
