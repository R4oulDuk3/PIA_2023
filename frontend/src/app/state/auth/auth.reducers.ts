import { createReducer, on } from "@ngrx/store";
import { loginSuccess } from "./auth.actions";


export interface AuthState {
  isLoggedIn: boolean;
}

export const initialAuthState: AuthState = {
  isLoggedIn: false
};

export const authReducer = createReducer(
  initialAuthState,
  on (loginSuccess, (state, action) => {
    return {
      ...state,
      isLoggedIn: true
    };
  })
);
