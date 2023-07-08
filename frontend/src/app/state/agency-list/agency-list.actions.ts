import { createAction, props } from '@ngrx/store';
import { AgencyBasicInfoDto } from 'src/app/agency-list/dtos/agency.dto';

export const fetchingAgencies = createAction('[Agency List] Fetching Agencies');

export const fetchingAgenciesSuccess = createAction(
  '[Agency List] Fetching Agencies Success',
  props<{ agencies: AgencyBasicInfoDto[] }>()
);

export const fetchingAgenciesFailure = createAction(
  '[Agency List] Fetching Agencies Failure',
  props<{ error: string }>()
);
