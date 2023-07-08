import { Component, OnInit } from '@angular/core';
import {
  GetAgencyUserInfoListResultDto,
  GetAgencyUserInfoResultDto,
} from '../../dtos/profile.dto';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-agency-profile-list',
  templateUrl: './agency-profile-list.component.html',
  styleUrls: ['./agency-profile-list.component.scss'],
})
export class AgencyProfileListComponent implements OnInit {
  agencies: GetAgencyUserInfoResultDto[] = [];
  displayedColumns: string[] = [
    'username',
    'name',
    'country',
    'city',
    'address',
    'email',
    'phone',
    'image',
    'actions',
  ];

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.loadAgencyInfo();
  }
  loadAgencyInfo() {
    this.profileService.getAllAgencyProfileInfo().subscribe({
      next: (data: GetAgencyUserInfoListResultDto) => {
        console.log('data', data);
        this.agencies = data.agencies;
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.showSnackbar('Failed to load agencies');
      },
    });
  }
  editAgency(agency: GetAgencyUserInfoResultDto) {
    this.router.navigate(['/profile/overview/agency', agency.username]);
  }

  deleteAgency(agency: GetAgencyUserInfoResultDto) {
    console.log('deleteAgency', agency);
    this.profileService.deleteProfile({ username: agency.username }).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Agency deleted');
        this.loadAgencyInfo();
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.showSnackbar('Failed to delete agency');
      },
    });
  }

  goToWorkersPage(agency: GetAgencyUserInfoResultDto) {
    this.router.navigate(['/workers/list', agency.username]);
  }
}
