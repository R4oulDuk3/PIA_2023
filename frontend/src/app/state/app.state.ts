import { AgencyListState } from './agency-list/agency-list.reducers';
import { AuthState } from './auth/auth.reducers';
import { JobsState } from './jobs/jobs.reducers';
import { MenuState } from './menu/menu.reducers';
import { ObjectState } from './objects/object.reducers';
import { ProfileState } from './profile/profile.reducers';
import { WorkersState } from './workers/workers.reducers';

export interface AppState {
  auth: AuthState;
  menu: MenuState;
  agencyList: AgencyListState;
  object: ObjectState;
  jobs: JobsState;
  profile: ProfileState;
  workers: WorkersState;
}
