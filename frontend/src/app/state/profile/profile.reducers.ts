import { createReducer, on } from '@ngrx/store';
import {
  GetAgencyUserInfoResultDto,
  GetClientUserInfoResultDto,
} from 'src/app/profile/dtos/profile.dto';
import {
  fetchedAgencyProfileSuccess,
  fetchedProfileFailure,
  fetchedClientProfileSuccess,
} from './profile.actions';

export interface ProfileState {
  clientInfo: GetClientUserInfoResultDto | null;
  agencyInfo: GetAgencyUserInfoResultDto | null;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  clientInfo: null,
  agencyInfo: null,
  error: null,
};

export const profileReducer = createReducer(
  initialProfileState,
  on(fetchedClientProfileSuccess, (state, action) => {
    return {
      ...state,
      clientInfo: action.clientProfile,
    };
  }),
  on(fetchedAgencyProfileSuccess, (state, action) => {
    return {
      ...state,
      agencyInfo: action.agencyProfile,
    };
  }),
  on(fetchedProfileFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  })
);
