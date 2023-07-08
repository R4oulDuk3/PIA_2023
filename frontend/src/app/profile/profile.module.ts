import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileOverviewComponent } from './components/profile-overview/profile-overview.component';
import { Route, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientProfileListComponent } from './components/client-profile-list/client-profile-list.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { AgencyProfileListComponent } from './components/agency-profile-list/agency-profile-list.component';
const routes: Route[] = [
  { path: 'overview', component: ProfileOverviewComponent },
  { path: 'overview/:usertype/:username', component: ProfileOverviewComponent },
  { path: 'list', component: ProfileListComponent },
];

@NgModule({
  declarations: [
    ProfileOverviewComponent,
    ClientProfileListComponent,
    ProfileListComponent,
    AgencyProfileListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
  ],
})
export class ProfileModule {}
