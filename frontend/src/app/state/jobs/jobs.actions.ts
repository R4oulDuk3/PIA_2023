import { createAction, props } from '@ngrx/store';
import { GetJobRequestResponseDto } from 'src/app/jobs/dtos/jobs-requests.dto';

export const fetchedJobRequestsForClientSuccess = createAction(
  '[Jobs] Fetched Job Requests Success',
  props<{ jobRequests: GetJobRequestResponseDto[] }>()
);

export const fetchedJobRequestsForClientFailure = createAction(
  '[Jobs] Fetched Job Requests Failure',
  props<{ error: string }>()
);
