import { createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';
import { AppState } from '../app.state';

export const selectAuth = (state: AppState) => state.auth;
export const isLoggedIn = createSelector(selectAuth, (auth) => auth.isLoggedIn);

export const accessToken = createSelector(
  selectAuth,
  (auth) => auth.accessToken
);

export const userType = createSelector(selectAuth, (auth) => auth.userType);

export const errorMessage = createSelector(
  selectAuth,
  (auth) => auth.loginErrorMessage
);

export const registerErrorMessage = createSelector(
  selectAuth,
  (auth) => auth.registerErrorMessage
);

export const registerRequestSucessful = createSelector(
  selectAuth,
  (auth) => auth.registerRequestSucessful
);

export const registerEmail = createSelector(
  selectAuth,
  (auth) => auth.registerEmail
);

export const username = createSelector(selectAuth, (auth) => auth.username);
