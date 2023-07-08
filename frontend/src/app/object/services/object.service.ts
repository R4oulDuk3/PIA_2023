import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import {
  DeleteObjectDto,
  DeleteObjectResultDto,
  GetObjectForUserResultDto,
  GetSimpleObjectForUserResultDto,
  UpsertObjectDto,
} from '../dtos/object.dto';
import { getAllUserObjectsSuccessful } from 'src/app/state/objects/object.actions';
import { Observable } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const objectsForUserListUrl = backendHost + '/object/all';
const objectGetUrl = backendHost + '/object';
const objectUpsertUrl = backendHost + '/object/upsert';
const objectDeleteUrl = backendHost + '/object/delete';
@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getSimpleObjectsForUser(requestless = false) {
    this.store.select(username).subscribe((username: string) => {
      this.http
        .get<GetSimpleObjectForUserResultDto>(
          `${objectsForUserListUrl}/${username}?requestless=${requestless}`
        )
        .subscribe({
          next: (data: GetSimpleObjectForUserResultDto) => {
            console.log(data);
            this.store.dispatch(
              getAllUserObjectsSuccessful({ getObjectForUserResultDto: data })
            );
          },
          error: (error: Error) => {
            console.log(error);
          },
        });
    });
  }

  getObjectForUser(id: number): Observable<GetObjectForUserResultDto> {
    return this.http.get<GetObjectForUserResultDto>(`${objectGetUrl}/${id}`);
  }

  upsertObject(upsertObjectDto: UpsertObjectDto) {
    return this.http.post(objectUpsertUrl, upsertObjectDto);
  }

  deleteObject(
    deleteObjectDto: DeleteObjectDto
  ): Observable<DeleteObjectResultDto> {
    return this.http.post<DeleteObjectResultDto>(
      objectDeleteUrl,
      deleteObjectDto
    );
  }
}
