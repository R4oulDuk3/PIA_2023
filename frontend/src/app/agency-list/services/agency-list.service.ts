import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import {
  AgencyBasicInfoSearchQueryDto,
  AgencyBasicInfoSearchResultDto,
  AgencyQueryResultDto,
} from '../dtos/agency.dto';
import {
  fetchingAgencies,
  fetchingAgenciesSuccess,
  fetchingAgenciesFailure,
} from 'src/app/state/agency-list/agency-list.actions';
import { Observable } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const agencyListUrl = backendHost + '/agency/search';
const agencyGetUrl = backendHost + '/agency';
const agencyDepersonalizedGetUrl = backendHost + '/agency/depersonalized';
@Injectable({
  providedIn: 'root',
})
export class AgencyListService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  searchAgencies(agencyBasicInfoSearchQueryDto: AgencyBasicInfoSearchQueryDto) {
    this.store.dispatch(fetchingAgencies());
    this.http
      .post<AgencyBasicInfoSearchResultDto>(
        agencyListUrl,
        agencyBasicInfoSearchQueryDto
      )
      .subscribe({
        next: (data: AgencyBasicInfoSearchResultDto) => {
          console.log(data);
          this.store.dispatch(
            fetchingAgenciesSuccess({ agencies: data.agencies })
          );
        },
        error: (error: Error) => {
          console.log(error);
          this.store.dispatch(
            fetchingAgenciesFailure({ error: error.message })
          );
        },
      });
  }

  getAgency(agencyId: number): Observable<AgencyQueryResultDto> {
    return this.http.get<AgencyQueryResultDto>(`${agencyGetUrl}/${agencyId}`);
  }

  getAgencyDepersonalized(agencyId: number): Observable<AgencyQueryResultDto> {
    return this.http.get<AgencyQueryResultDto>(
      `${agencyDepersonalizedGetUrl}/${agencyId}`
    );
  }
}
