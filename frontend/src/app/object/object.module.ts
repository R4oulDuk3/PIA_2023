import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectsListComponent } from './components/objects-list/objects-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { ObjectEditorComponent } from './components/object-editor/object-editor.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { ObjectCreatorComponent } from './components/object-creator/object-creator.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
const routes: Route[] = [
  { path: 'list', component: ObjectsListComponent },
  { path: 'editor', component: ObjectEditorComponent },
  { path: 'editor/:id', component: ObjectEditorComponent },
];

@NgModule({
  declarations: [
    ObjectsListComponent,
    ObjectEditorComponent,
    ObjectCreatorComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    MatDividerModule,
    MatRippleModule,
  ],
})
export class ObjectModule {}
