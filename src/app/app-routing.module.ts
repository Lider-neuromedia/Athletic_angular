import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { ContentComponent } from './content/content.component';
import { DetalleProductoComponent } from './detalle-producto/detalle-producto.component';
import { LoginComponent } from './login/login.component';

const routes : Routes = [
  { path: '', component: ContentComponent },
  { path: 'productos', component: ProductosComponent },
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
