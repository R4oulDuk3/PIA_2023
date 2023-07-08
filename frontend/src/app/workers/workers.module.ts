import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerListComponent } from './components/worker-list/worker-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Route, RouterModule } from '@angular/router';
import { WorkerEditorComponent } from './components/worker-editor/worker-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkerIncreaseRequestsComponent } from './components/worker-increase-requests/worker-increase-requests.component';
import { MatIconModule } from '@angular/material/icon';
const routes: Route[] = [
  { path: 'list', component: WorkerListComponent },
  { path: 'list/:username', component: WorkerListComponent },
  { path: 'editor', component: WorkerEditorComponent },
  {
    path: 'admin/worker-increase-requests',
    component: WorkerIncreaseRequestsComponent,
  },
];
@NgModule({
  declarations: [
    WorkerListComponent,
    WorkerEditorComponent,
    WorkerIncreaseRequestsComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [WorkerListComponent],
})
export class WorkersModule {}
