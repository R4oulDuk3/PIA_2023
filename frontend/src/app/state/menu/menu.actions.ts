import { createAction, props } from "@ngrx/store";

export const toggleSidebar = createAction(
  '[Menu] Toggle Sidebar'
);


export const openSidebar = createAction(
  '[Menu] Open Sidebar'
);

export const closeSidebar = createAction(
  '[Menu] Close Sidebar'
);
