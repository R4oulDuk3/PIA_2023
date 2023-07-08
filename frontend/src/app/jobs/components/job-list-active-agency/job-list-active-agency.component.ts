import { Component, OnInit } from '@angular/core';
import { JobActiveService } from '../../services/job-active.service';
import {
  GetSimpleJobListResultDto,
  GetSimpleJobListResultJobDto,
} from '../../dtos/jobs-active.dto';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { userType, username } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-job-list-active-agency',
  templateUrl: './job-list-active-agency.component.html',
  styleUrls: ['./job-list-active-agency.component.scss'],
})
export class JobListActiveAgencyComponent implements OnInit {
  constructor(
    private jobActiveService: JobActiveService,
    private router: Router,
    private snackbar: SnackbarService,
    private state: Store<AppState>
  ) {}
  activeJobs: GetSimpleJobListResultJobDto[] = [];
  username = '';
  userType = '';
  ngOnInit(): void {
    this.refresh();
  }

  setUsernameAndType() {
    this.state.select(username).subscribe((username) => {
      this.username = username;
    });
    this.state.select(userType).subscribe((userType) => {
      this.userType = userType;
    });
  }

  refresh() {
    this.setUsernameAndType();
    this.jobActiveService
      .getListOfActiveJobs(this.username, this.userType)
      .subscribe({
        next: (data: GetSimpleJobListResultDto) => {
          console.log(data);
          this.activeJobs = data.jobs;
          this.snackbar.showSnackbar('Active jobs list refreshed');
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
  }
  navigateToJobDetails(jobId: number) {
    // Replace 'job-details' with the actual route/path to the job details page
    this.router.navigate(['active', jobId]);
  }
}
