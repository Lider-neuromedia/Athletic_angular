import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SendHttpData } from '../app/tools/SendHttpData';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import { OwlModule } from 'ngx-owl-carousel';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    MaterialModule,
    OwlModule
  ],
  providers: [SendHttpData],
  bootstrap: [AppComponent]
})
export class AppModule { }
