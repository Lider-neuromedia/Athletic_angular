import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SendHttpData } from '../app/tools/SendHttpData';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { OwlModule } from 'ngx-owl-carousel';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { ItemProductoComponent } from './item-producto/item-producto.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    ItemProductoComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MaterialModule,
    OwlModule,
    FlexLayoutModule
  ],
  providers: [SendHttpData],
  bootstrap: [AppComponent]
})
export class AppModule { }
