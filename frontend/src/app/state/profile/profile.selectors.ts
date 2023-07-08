import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';

export const selectProfile = (state: AppState) => state.profile;

export const clientProfile = createSelector(
  selectProfile,
  (profile) => profile.clientInfo
);

export const agencyProfile = createSelector(
  selectProfile,
  (profile) => profile.agencyInfo
);

export const profileError = createSelector(
  selectProfile,
  (profile) => profile.error
);
