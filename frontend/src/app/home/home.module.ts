import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AgencyListModule } from '../agency-list/agency-list.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { WorkersModule } from '../workers/workers.module';
const routes: Routes = [{ path: '', component: HomeComponent }];
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AgencyListModule,
    RouterModule.forChild(routes),
    AuthModule,
    WorkersModule,
  ],
})
export class HomeModule {}
