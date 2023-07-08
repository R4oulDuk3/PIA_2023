import { createReducer, on } from '@ngrx/store';
import { GetJobRequestResponseDto } from 'src/app/jobs/dtos/jobs-requests.dto';
import {
  fetchedJobRequestsForClientFailure,
  fetchedJobRequestsForClientSuccess,
} from './jobs.actions';

export interface JobsState {
  jobRequestsForClient: GetJobRequestResponseDto[];
  error: string | null;
}

export const initialJobsState: JobsState = {
  jobRequestsForClient: [],
  error: null,
};

export const jobsReducer = createReducer(
  initialJobsState,
  on(fetchedJobRequestsForClientSuccess, (state, action) => {
    return {
      ...state,
      jobRequestsForClient: action.jobRequests,
    };
  }),
  on(fetchedJobRequestsForClientFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  })
);
