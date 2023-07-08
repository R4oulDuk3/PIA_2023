import { createReducer, on } from '@ngrx/store';

import {
  getAllUserObjectsFailed,
  getAllUserObjectsSuccessful,
} from './object.actions';
import { SimpleObjectForUserResultDto } from 'src/app/object/dtos/object.dto';

export interface ObjectState {
  objects: SimpleObjectForUserResultDto[];
  error?: Error;
}

export const initialObjectState: ObjectState = {
  objects: [],
  error: undefined,
};

export const objectReducer = createReducer(
  initialObjectState,
  on(getAllUserObjectsSuccessful, (state, action) => {
    return {
      ...state,
      objects: action.getObjectForUserResultDto.objects,
    };
  }),
  on(getAllUserObjectsFailed, (state, action) => {
    return {
      ...state,
      error: action.error,
    };
  })
);
