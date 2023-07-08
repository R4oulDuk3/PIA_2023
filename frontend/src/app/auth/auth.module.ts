import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterChooseComponent } from './components/register-choose/register-choose.component';
import { RegistrationSuccesfullComponent } from './components/registration-succesfull/registration-succesfull.component';
import { MatIconModule } from '@angular/material/icon';
import { RegisterAgencyComponent } from './components/register-agency/register-agency.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { RegistrationRequestsComponent } from './components/registration-requests/registration-requests.component';
import { MatTableModule } from '@angular/material/table';
import { SecurityComponent } from './components/security/security.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'register', component: RegisterChooseComponent },
  { path: 'register/client', component: RegisterClientComponent },
  { path: 'register/agency', component: RegisterAgencyComponent },
  { path: 'create/agency', component: RegisterAgencyComponent },
  { path: 'create/client', component: RegisterClientComponent },
  { path: 'register/success', component: RegistrationSuccesfullComponent },
  { path: 'security', component: SecurityComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterClientComponent,
    RegisterChooseComponent,
    RegistrationSuccesfullComponent,
    RegisterAgencyComponent,
    AdminLoginComponent,
    RegistrationRequestsComponent,
    SecurityComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
  ],
  exports: [RegistrationRequestsComponent],
})
export class AuthModule {}
