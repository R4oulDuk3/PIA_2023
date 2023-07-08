import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';

export const selectWorkers = (state: AppState) => state.workers;

export const workerForEditing = createSelector(
  selectWorkers,
  (workers) => workers.workerForEditing
);
