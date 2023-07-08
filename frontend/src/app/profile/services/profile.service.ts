import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GetAgencyUserInfoResultDto,
  GetClientUserInfoResultDto,
  UpdateClientUserInfoDto,
  UpdateAgencyUserInfoDto,
  GetClientUserInfoListResultDto,
  GetAgencyUserInfoListResultDto,
  DeleteUserDto,
} from '../dtos/profile.dto';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import {
  fetchedProfileFailure,
  fetchedClientProfileSuccess,
  fetchedAgencyProfileSuccess,
} from 'src/app/state/profile/profile.actions';
import { Observable } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const getClientProfileInfoUrl = backendHost + '/profile/client';
const getAgencyProfileInfoUrl = backendHost + '/profile/agency';
const updateClientProfileInfoUrl = backendHost + '/profile/client/update';
const updateAgencyProfileInfoUrl = backendHost + '/profile/agency/update';

const getProfileClientListUrl = backendHost + '/profile/list/client';
const getProfileAgencyListUrl = backendHost + '/profile/list/agency';
const deleteProfileUrl = backendHost + '/profile/delete';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  getClientProfile(username: string) {
    this.http
      .get<GetClientUserInfoResultDto>(`${getClientProfileInfoUrl}/${username}`)
      .subscribe({
        next: (data: GetClientUserInfoResultDto) => {
          console.log(data);

          this.store.dispatch(
            fetchedClientProfileSuccess({ clientProfile: data })
          );
        },
        error: (error: Error) => {
          console.log(error);
          this.store.dispatch(fetchedProfileFailure({ error: error.message }));
        },
      });
  }

  getAgencyProfile(username: string) {
    this.http
      .get<GetAgencyUserInfoResultDto>(`${getAgencyProfileInfoUrl}/${username}`)
      .subscribe({
        next: (data: GetAgencyUserInfoResultDto) => {
          console.log(data);
          this.store.dispatch(
            fetchedAgencyProfileSuccess({ agencyProfile: data })
          );
        },
        error: (error: Error) => {
          console.log(error);
          this.store.dispatch(fetchedProfileFailure({ error: error.message }));
        },
      });
  }

  updateClientProfile(updateClientUserInfoDto: UpdateClientUserInfoDto) {
    return this.http.post(updateClientProfileInfoUrl, updateClientUserInfoDto);
  }

  updateAgencyProfile(UpdateAgencyUserInfoDto: UpdateAgencyUserInfoDto) {
    return this.http.post(updateAgencyProfileInfoUrl, UpdateAgencyUserInfoDto);
  }

  getAllClientProfileInfo(): Observable<GetClientUserInfoListResultDto> {
    return this.http.get<GetClientUserInfoListResultDto>(
      getProfileClientListUrl
    );
  }

  getAllAgencyProfileInfo(): Observable<GetAgencyUserInfoListResultDto> {
    return this.http.get<GetAgencyUserInfoListResultDto>(
      getProfileAgencyListUrl
    );
  }

  deleteProfile(deleteUserDto: DeleteUserDto) {
    return this.http.post(deleteProfileUrl, deleteUserDto);
  }
}
