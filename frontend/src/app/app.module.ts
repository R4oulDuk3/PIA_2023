import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from './menu/menu.module';
import { RoutingModule } from './routing/routing.module';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './state/auth/auth.reducers';
import { menuReducer } from './state/menu/menu.reducers';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    BrowserAnimationsModule,
    MenuModule,
    RoutingModule,
    StoreModule.forRoot({
      auth: authReducer,
     menu: menuReducer }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
