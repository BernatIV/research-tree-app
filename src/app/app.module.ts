import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServerComponent } from './server/server.component';
import {FormsModule} from "@angular/forms";
import { HeaderComponent } from './header/header.component';
import { TreeComponent } from './tree/tree.component';
import {MatTreeModule} from "@angular/material/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgxGraphModule} from "@swimlane/ngx-graph";
import { GraphComponent } from './graph/graph.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    ServerComponent,
    HeaderComponent,
    TreeComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    NgxGraphModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
