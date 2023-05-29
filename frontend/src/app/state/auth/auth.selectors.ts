import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';
import { AppState } from '../app.state';

export const selectAuth = (state: AppState) => state.auth;
export const isLoggedIn = createSelector(
  selectAuth,
  (auth) => auth.isLoggedIn
);
