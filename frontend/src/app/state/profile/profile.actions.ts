import { createAction, props } from '@ngrx/store';
import {
  GetAgencyUserInfoResultDto,
  GetClientUserInfoResultDto,
} from 'src/app/profile/dtos/profile.dto';

export const fetchedClientProfileSuccess = createAction(
  '[Profile] Fetched Client Profile Success',
  props<{ clientProfile: GetClientUserInfoResultDto }>()
);

export const fetchedProfileFailure = createAction(
  '[Profile] Fetched Client Profile Failure',
  props<{ error: string }>()
);

export const fetchedAgencyProfileSuccess = createAction(
  '[Profile] Fetched Agency Profile Success',
  props<{ agencyProfile: GetAgencyUserInfoResultDto }>()
);
