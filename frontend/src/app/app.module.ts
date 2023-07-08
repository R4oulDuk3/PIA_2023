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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptor } from './interceptors/jwt.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { agencyListReducer } from './state/agency-list/agency-list.reducers';
import { objectReducer } from './state/objects/object.reducers';
import { jobsReducer } from './state/jobs/jobs.reducers';
import { profileReducer } from './state/profile/profile.reducers';
import { workersReducer } from './state/workers/workers.reducers';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AuthModule,
    BrowserAnimationsModule,
    MenuModule,
    RoutingModule,
    StoreModule.forRoot({
      auth: authReducer,
      menu: menuReducer,
      agencyList: agencyListReducer,
      object: objectReducer,
      jobs: jobsReducer,
      profile: profileReducer,
      workers: workersReducer,
    }),
    HttpClientModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
