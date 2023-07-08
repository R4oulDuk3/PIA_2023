import { createAction, props } from '@ngrx/store';
import { GetSimpleObjectForUserResultDto } from 'src/app/object/dtos/object.dto';

export const getAllUserObjectsSuccessful = createAction(
  '[Object] Get All User Objects',
  props<{ getObjectForUserResultDto: GetSimpleObjectForUserResultDto }>()
);

export const getAllUserObjectsFailed = createAction(
  '[Object] Get All User Objects Failed',
  props<{ error: Error }>()
);
