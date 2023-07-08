import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  AcceptJobRequestDto,
  CreateJobRequestDto,
  GetJobRequestListResponseDto,
  GetJobRequestsWithUserAndObjectResultDto,
  GetJobRequestsWithUserAndObjectResultJobRequestDto,
  MakeOfferForJobRequestDto,
  RejectJobRequestDto,
} from '../dtos/jobs-requests.dto';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { username } from 'src/app/state/auth/auth.selectors';
import {
  fetchedJobRequestsForClientFailure,
  fetchedJobRequestsForClientSuccess,
} from 'src/app/state/jobs/jobs.actions';
import { Observable, map, switchMap } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const createJobReuestUrl = backendHost + '/jobs/request';
const getJobRequestsForClientListUrl =
  backendHost + '/jobs/request/client/list/';

const getJobRequestsForAgencyListUrl =
  backendHost + '/jobs/request/agency/list/';

const makeOfferUrl = backendHost + '/jobs/request/offer';
const rejectRequestUrl = backendHost + '/jobs/request/reject';
const acceptRequestUrl = backendHost + '/jobs/request/accept';
@Injectable({
  providedIn: 'root',
})
export class JobRequestService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}
  createJobRequest(createJobRequestDto: CreateJobRequestDto) {
    return this.http.post(createJobReuestUrl, createJobRequestDto);
  }

  getJobRequestsForClientList() {
    this.store.select(username).subscribe((username) => {
      this.http
        .get<GetJobRequestListResponseDto>(
          `${getJobRequestsForClientListUrl}${username}`
        )
        .subscribe({
          next: (data: GetJobRequestListResponseDto) => {
            console.log(data);
            this.store.dispatch(
              fetchedJobRequestsForClientSuccess({
                jobRequests: data.jobRequests,
              })
            );
          },
          error: (error: Error) => {
            console.log(error);
            this.store.dispatch(
              fetchedJobRequestsForClientFailure({ error: error.message })
            );
          },
        });
    });
  }

  getJobRequestsForAgencyList(): Observable<GetJobRequestsWithUserAndObjectResultDto> {
    return this.store.select(username).pipe(
      switchMap((username: string) => {
        console.log(
          `username: ${username} url ${getJobRequestsForAgencyListUrl}${username}`
        );
        return this.http.get<GetJobRequestsWithUserAndObjectResultDto>(
          `${getJobRequestsForAgencyListUrl}${username}`
        );
      })
    );
  }

  makeOffer(makeOfferForJobRequestDto: MakeOfferForJobRequestDto) {
    return this.http.post(makeOfferUrl, makeOfferForJobRequestDto);
  }

  rejectRequest(rejectJobRequestDto: RejectJobRequestDto) {
    return this.http.post(rejectRequestUrl, rejectJobRequestDto);
  }

  acceptRequest(acceptJobRequestDto: AcceptJobRequestDto) {
    return this.http.post(acceptRequestUrl, acceptJobRequestDto);
  }
}
