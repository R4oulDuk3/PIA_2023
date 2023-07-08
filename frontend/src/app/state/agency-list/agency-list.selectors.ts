import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAgencyList = (state: AppState) => state.agencyList;

export const selectAgenciesAgencyList = createSelector(
  selectAgencyList,
  (agencyList) => agencyList.agencies
);
export const selectIsFetchingAgencyList = createSelector(
  selectAgencyList,
  (agencyList) => agencyList.isFetching
);

export const selectErrorAgencyList = createSelector(
  selectAgencyList,
  (agencyList) => agencyList.error
);
