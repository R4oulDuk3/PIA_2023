import { createReducer, on } from '@ngrx/store';
import { UpsertWorkerDto } from 'src/app/workers/dtos/workers.dto';
import { clearWorkerForEditing, putWorkerForEditing } from './workers.actions';

export interface WorkersState {
  workerForEditing: UpsertWorkerDto | null;
}

export const initialWorkersState: WorkersState = {
  workerForEditing: null,
};

export const workersReducer = createReducer(
  initialWorkersState,
  on(putWorkerForEditing, (state, action) => {
    return {
      ...state,
      workerForEditing: action.upsertWorkerDto,
    };
  }),
  on(clearWorkerForEditing, (state) => {
    return {
      ...state,
      workerForEditing: null,
    };
  })
);
