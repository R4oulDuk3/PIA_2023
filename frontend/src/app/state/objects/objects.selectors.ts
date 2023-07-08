import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
export const selectObject = (state: AppState) => state.object;

export const userObjects = createSelector(
  selectObject,
  (object) => object.objects
);

export const userObjectsError = createSelector(
  selectObject,
  (object) => object.error
);
