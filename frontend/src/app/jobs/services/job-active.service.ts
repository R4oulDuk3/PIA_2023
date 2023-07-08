import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import {
  AssignWorkerDto,
  FinishWorkOnRoomDto,
  GetActiveJobResultDto,
  GetSimpleJobListResultDto,
  PayAndCommentJobDto,
  StartWorkOnRoomDto,
} from '../dtos/jobs-active.dto';
import { backendHost } from 'src/app/config/config';

const getListOfActiveJobsUrl = backendHost + '/jobs/active/list';
const getActiveJobUrl = backendHost + '/jobs/active';
const assignWorkersToJobUrl = backendHost + '/jobs/active/assign';
const startWorkOnRoomUrl = backendHost + '/jobs/active/start';
const finishWorkOnRoomUrl = backendHost + '/jobs/active/finish';
const payWorkForJobUrl = backendHost + '/jobs/active/pay';

@Injectable({
  providedIn: 'root',
})
export class JobActiveService {
  username = '';
  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.store
      .select((state) => state.auth.username)
      .subscribe((username) => {
        this.username = username;
      });
  }

  getListOfActiveJobs(
    username: string,
    userType: string
  ): Observable<GetSimpleJobListResultDto> {
    return this.http.get<GetSimpleJobListResultDto>(
      `${getListOfActiveJobsUrl}/${username}/${userType}`
    );
  }

  getActiveJob(jobId: number): Observable<GetActiveJobResultDto> {
    return this.http.get<GetActiveJobResultDto>(`${getActiveJobUrl}/${jobId}`);
  }

  assignWorkerToJob(jobId: number, workerId: number) {
    const assignWorkersDto: AssignWorkerDto = {
      jobId,
      workerId,
    };
    return this.http.post(`${assignWorkersToJobUrl}`, assignWorkersDto);
  }

  startWorkOnRoom(jobId: number, roomId: number) {
    const startWorkOnRoomDto: StartWorkOnRoomDto = {
      jobId,
      roomId,
    };
    return this.http.post(`${startWorkOnRoomUrl}`, startWorkOnRoomDto);
  }

  finishWorkOnRoom(jobId: number, roomId: number) {
    const finishWorkOnRoomDto: FinishWorkOnRoomDto = {
      jobId,
      roomId,
    };
    return this.http.post(`${finishWorkOnRoomUrl}`, finishWorkOnRoomDto);
  }

  payWorkForJob(payAndCommentJobDto: PayAndCommentJobDto) {
    return this.http.post(`${payWorkForJobUrl}`, payAndCommentJobDto);
  }
}
