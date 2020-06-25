import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ResenaComponent } from './resena/resena.component';
import { CuponesComponent } from './cupones/cupones.component';
import { PerfilComponent } from './perfil/perfil.component';
import { DireccionesComponent } from './direcciones/direcciones.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { ContentComponent } from './content/content.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes : Routes = [
  { path: '', component: ContentComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'pedidos', canActivate: [AuthGuard], component: PedidosComponent },
  { path: 'resena', canActivate: [AuthGuard], component: ResenaComponent },
  { path: 'cupones', canActivate: [AuthGuard], component: CuponesComponent },
  { path: 'perfil', canActivate: [AuthGuard], component: PerfilComponent },
  { path: 'direcciones', canActivate: [AuthGuard], component: DireccionesComponent },
  { path: 'favoritos', canActivate: [AuthGuard], component: FavoritosComponent },
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
