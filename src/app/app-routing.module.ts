import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos/productos.component';
import { ContentComponent } from './content/content.component';

const routes : Routes = [
  { path: '', component: ContentComponent },
  { path: 'productos', component: ProductosComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes), 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
