import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AgencyBasicInfoDto,
  AgencyBasicInfoSearchQueryDto,
} from '../../dtos/agency.dto';
import { Store } from '@ngrx/store';
import { selectAgenciesAgencyList } from 'src/app/state/agency-list/agency-list.selectors';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { AgencyListService } from '../../services/agency-list.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.scss'],
})
export class AgencyListComponent implements OnInit, OnDestroy {
  agencyData: AgencyBasicInfoDto[] = []; //this.store.select(selectAgenciesAgencyList); // Holds the search results
  displayedColumns: string[] = [
    'name',
    'address',
    'description',
    'image',
    'actions',
  ]; // Columns to display in the table
  agencyDataSubscription: Subscription; // Holds the subscription to the agency data

  constructor(
    private store: Store<AppState>,
    private agencyListService: AgencyListService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.agencyDataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.agencyDataSubscription = this.store
      .select(selectAgenciesAgencyList)
      .subscribe({
        next: (agencyData: AgencyBasicInfoDto[]) => {
          this.agencyData = agencyData;
        },
      });
    this.performSearch();
  }

  visitAgency(agencyId: number): void {
    this.router.navigate(['/agency/', agencyId]);
  }

  name = '';
  address = '';
  sortByName = '';
  sortByAddress = '';
  performSearch(): void {
    console.log(this.sortByName);
    const agencyBasicInfoSearchQueryDto: AgencyBasicInfoSearchQueryDto = {
      name: this.name,
      adress: this.address,
      sortAdressAsc: this.sortByAddress === 'asc',
      sortNameAsc: this.sortByName === 'asc',
    };
    this.agencyListService.searchAgencies(agencyBasicInfoSearchQueryDto);
  }
}
