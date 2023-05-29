import { AuthState } from "./auth/auth.reducers";
import { MenuState } from "./menu/menu.reducers";

export interface AppState {
  auth: AuthState;
  menu: MenuState;
}
