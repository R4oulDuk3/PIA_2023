import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import {
  ApproveWorkerIncreaseRequestDto,
  CreateWorkerIncreaseRequestDto,
  GetAgencyWorkersResultDto,
  GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto,
  GetWorkerIncreaseRequestsForAgencyResultDto,
  RejectWorkerIncreaseRequestDto,
  UpsertWorkerDto,
} from '../dtos/workers.dto';
import { Observable } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const getWorkerList = backendHost + '/workers/list';
const getUnassinedWorkerListUrl = backendHost + '/workers/unassigned/list';
const createWorkerIncreaseRequest = backendHost + '/workers/increase-request';
const getWorkerIncreaseRequestsForAgency =
  backendHost + '/workers/increase-request/list';
const upsertWorker = backendHost + '/workers/upsert';
const deleteWorker = backendHost + '/workers/delete';
const getAllPendingWorkerIncreaseRequests =
  backendHost + '/workers/increase-request/pending';
const approvePendingWorkerIncreaseRequest =
  backendHost + '/workers/increase-request/approve';
const rejectPendingWorkerIncreaseRequest =
  backendHost + '/workers/increase-request/reject';
@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  agencyUsername: string;
  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.store.select(username).subscribe((username) => {
      this.agencyUsername = username;
    });
  }

  getWorkerList(username: string): Observable<GetAgencyWorkersResultDto> {
    return this.http.get<GetAgencyWorkersResultDto>(
      `${getWorkerList}/${username}`
    );
  }

  getUnassignedWorkerList(): Observable<GetAgencyWorkersResultDto> {
    return this.http.get<GetAgencyWorkersResultDto>(
      `${getUnassinedWorkerListUrl}/${this.agencyUsername}`
    );
  }

  createWorkerIncreaseRequest(maxWorkerCount: number) {
    const createWorkerIncreaseRequestDto: CreateWorkerIncreaseRequestDto = {
      username: this.agencyUsername,
      maxWorkerCount: maxWorkerCount,
    };

    return this.http.post(
      createWorkerIncreaseRequest,
      createWorkerIncreaseRequestDto
    );
  }

  getWorkerIncreaseRequestsForAgency(
    username: string
  ): Observable<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto> {
    return this.http.get<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto>(
      `${getWorkerIncreaseRequestsForAgency}/${username}`
    );
  }

  getWorkerIncreaseRequestsForAllAgencies(): Observable<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto> {
    return this.http.get<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto>(
      `${getAllPendingWorkerIncreaseRequests}`
    );
  }

  upsertWorker(upsertWorkerDto: UpsertWorkerDto) {
    return this.http.post(upsertWorker, upsertWorkerDto);
  }

  deleteWorker(workerId: number) {
    return this.http.delete(`${deleteWorker}/${workerId}`);
  }

  approvePendingWorkerIncreaseRequest(
    approveWorkerIncreaseRequestDto: ApproveWorkerIncreaseRequestDto
  ) {
    return this.http.post(
      approvePendingWorkerIncreaseRequest,
      approveWorkerIncreaseRequestDto
    );
  }

  rejectPendingWorkerIncreaseRequest(
    rejectWorkerIncreaseRequestDto: RejectWorkerIncreaseRequestDto
  ) {
    return this.http.post(
      rejectPendingWorkerIncreaseRequest,
      rejectWorkerIncreaseRequestDto
    );
  }
}
