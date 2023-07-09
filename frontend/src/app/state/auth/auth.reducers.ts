import { createReducer, on } from '@ngrx/store';
import {
  loginSuccess,
  loginFailure,
  registerFailure,
  registerSuccess,
  registerClient,
  registerAgency,
  GUEST,
  CLIENT,
  AGENCY,
  ADMIN,
  logout,
  becomeUserSuccess,
  registerReset,
} from './auth.actions';
import { access } from 'fs';
import { HttpErrorResponse } from '@angular/common/http';

export interface AuthState {
  isLoggedIn: boolean;
  isAdminBecomeUser: boolean;
  adminUsername?: string;
  accessToken?: string;
  loginError?: HttpErrorResponse;
  registerRequestSucessful?: boolean;
  registerUsername?: string;
  registerEmail?: string;
  registerErrorMessage?: string;
  userType: string;
  username: string;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false,
  accessToken: undefined,
  userType: GUEST,
  username: '',
  isAdminBecomeUser: false,
  adminUsername: undefined,
};

export const authReducer = createReducer(
  initialAuthState,
  on(becomeUserSuccess, (state, action) => {
    return {
      ...state,
      isAdminBecomeUser: true,
      adminUsername: state.username,
      username: action.username,
      userType: action.userType,
    };
  }),
  on(logout, (state, action) => {
    if (state.isAdminBecomeUser && state.adminUsername) {
      return {
        ...state,
        isAdminBecomeUser: false,
        username: state.adminUsername,
        userType: ADMIN,
      };
    }
    return {
      ...state,
      isLoggedIn: false,
      accessToken: undefined,
      userType: GUEST,
      username: '',
      isAdminBecomeUser: false,
    };
  }),
  on(loginSuccess, (state, action) => {
    return {
      ...state,
      isLoggedIn: true,
      accessToken: action.accessToken,
      userType: action.userType,
      username: action.username,
    };
  }),
  on(loginFailure, (state, action) => {
    return {
      ...state,
      loginError: action.error,
    };
  }),
  on(registerFailure, (state, action) => {
    return {
      ...state,
      registerErrorMessage: action.error,
      registerRequestSucessful: false,
    };
  }),
  on(registerSuccess, (state, action) => {
    return {
      ...state,
      registerRequestSucessful: true,
    };
  }),
  on(registerReset, (state, action) => {
    return {
      ...state,
      registerErrorMessage: undefined,
      registerRequestSucessful: false,
    };
  }),
  on(registerClient, (state, action) => {
    return {
      ...state,
      registerUsername: action.username,
      registerEmail: action.email,
    };
  }),
  on(registerAgency, (state, action) => {
    return {
      ...state,
      registerUsername: action.username,
      registerEmail: action.email,
    };
  })
);
