import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobListClientComponent } from './components/job-list-client/job-list-client.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Route, RouterModule } from '@angular/router';
import { JobListAgencyComponent } from './components/job-list-agency/job-list-agency.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JobListActiveAgencyComponent } from './components/job-list-active-agency/job-list-active-agency.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { JobActiveComponent } from './components/job-active/job-active.component';
import { MatSelectModule } from '@angular/material/select';
import { WorkersModule } from '../workers/workers.module';
import { MatInputModule } from '@angular/material/input';
const routes: Route[] = [
  { path: 'client/list', component: JobListClientComponent },
  { path: 'main', component: JobsComponent },
  { path: 'active/:id', component: JobActiveComponent },
];
@NgModule({
  declarations: [
    JobListClientComponent,
    JobListAgencyComponent,
    JobListActiveAgencyComponent,
    JobsComponent,
    JobActiveComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    WorkersModule,
    MatInputModule,
  ],
})
export class JobsModule {}
