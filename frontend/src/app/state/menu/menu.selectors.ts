import { createSelector } from "@ngrx/store";


import { MenuState } from "./menu.reducers";
import { AppState } from "../app.state";
export const selectMenu = (state: AppState) => state.menu;
export const isSidebarOpen = createSelector(
  selectMenu,
  (menu) => menu.isSidebarOpen
);
