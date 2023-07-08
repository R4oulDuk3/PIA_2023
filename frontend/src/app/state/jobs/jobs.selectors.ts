import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';

export const selectJobs = (state: AppState) => state.jobs;

export const jobRequests = createSelector(
  selectJobs,
  (jobs) => jobs.jobRequestsForClient
);

export const jobRequestsError = createSelector(
  selectJobs,
  (jobs) => jobs.error
);
