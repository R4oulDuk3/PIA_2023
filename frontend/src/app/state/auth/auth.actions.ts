import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
export const GUEST = 'guest';
export const CLIENT = 'client';
export const AGENCY = 'agency';
export const ADMIN = 'admin';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ accessToken: string; userType: string; username: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>()
);

export const becomeUserSuccess = createAction(
  '[Auth] Become User',
  props<{ username: string; userType: string }>()
);

export const logout = createAction('[Auth] Logout');

export const registerClient = createAction(
  '[Auth] Register Client',
  props<{ username: string; email: string }>()
);

export const registerAgency = createAction(
  '[Auth] Register Agency',
  props<{ username: string; email: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ message: string }>()
);

export const registerReset = createAction('[Auth] Register Reset');

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);
