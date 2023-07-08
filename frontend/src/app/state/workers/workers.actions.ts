import { createAction, props } from '@ngrx/store';
import { UpsertWorkerDto } from 'src/app/workers/dtos/workers.dto';

export const putWorkerForEditing = createAction(
  '[Workers] Put Worker For Editing',
  props<{ upsertWorkerDto: UpsertWorkerDto }>()
);

export const clearWorkerForEditing = createAction(
  '[Workers] Clear Worker For Editing'
);
