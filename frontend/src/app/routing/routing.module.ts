import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('../home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'agency',
    loadChildren: () =>
      import('../agency-list/agency-list.module').then(
        (m) => m.AgencyListModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('../profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'object',
    loadChildren: () =>
      import('../object/object.module').then((m) => m.ObjectModule),
  },
  {
    path: 'jobs',
    loadChildren: () => import('../jobs/jobs.module').then((m) => m.JobsModule),
  },
  {
    path: 'workers',
    loadChildren: () =>
      import('../workers/workers.module').then((m) => m.WorkersModule),
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
