import { createReducer, on } from '@ngrx/store';
import { toggleSidebar, openSidebar, closeSidebar } from './menu.actions';

export interface MenuState {
  isSidebarOpen: boolean;
}

export const initialMenuState: MenuState = {
  isSidebarOpen: false,
};

export const menuReducer = createReducer(
  initialMenuState,
  on(toggleSidebar, (state, action) => {
    return {
      ...state,
      isSidebarOpen: !state.isSidebarOpen,
    };
  }),
  on(openSidebar, (state, action) => {
    return {
      ...state,
      isSidebarOpen: true,
    };
  }),
  on(closeSidebar, (state, action) => {
    return {
      ...state,
      isSidebarOpen: false,
    };
  })
);
