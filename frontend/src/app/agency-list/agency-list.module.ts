import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Route, RouterModule } from '@angular/router';
import { AgencyOverviewComponent } from './components/agency-overview/agency-overview.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { ObjectModule } from '../object/object.module';
import { JobsModule } from '../jobs/jobs.module';
const routes: Route[] = [{ path: ':id', component: AgencyOverviewComponent }];

@NgModule({
  declarations: [AgencyListComponent, AgencyOverviewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    RouterModule.forChild(routes),
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    ObjectModule,
    JobsModule,
  ],
  exports: [AgencyListComponent],
})
export class AgencyListModule {}
