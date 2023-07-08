import { createReducer, on } from '@ngrx/store';

import {
  fetchingAgencies,
  fetchingAgenciesSuccess,
  fetchingAgenciesFailure,
} from './agency-list.actions';
import { AgencyBasicInfoDto } from 'src/app/agency-list/dtos/agency.dto';

export interface AgencyListState {
  agencies: AgencyBasicInfoDto[];
  isFetching: boolean;
  error: string;
}

export const initialAgencyListState: AgencyListState = {
  agencies: [],
  isFetching: false,
  error: '',
};

export const agencyListReducer = createReducer(
  initialAgencyListState,
  on(fetchingAgencies, (state, action) => {
    return {
      ...state,
      isFetching: true,
    };
  }),
  on(fetchingAgenciesSuccess, (state, action) => {
    return {
      ...state,
      agencies: action.agencies,
      isFetching: false,
    };
  }),
  on(fetchingAgenciesFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      isFetching: false,
    };
  })
);
