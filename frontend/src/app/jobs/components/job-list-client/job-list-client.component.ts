import { Component, OnInit } from '@angular/core';
import { JobRequestService } from '../../services/jobs-request.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { GetJobRequestResponseDto } from '../../dtos/jobs-requests.dto';
import { jobRequests } from 'src/app/state/jobs/jobs.selectors';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list-client.component.html',
  styleUrls: ['./job-list-client.component.scss'],
})
export class JobListClientComponent implements OnInit {
  constructor(
    private jobRequestService: JobRequestService,
    private store: Store<AppState>,
    private snackbar: SnackbarService
  ) {}

  refresh() {
    this.jobRequestService.getJobRequestsForClientList();
    this.store.select(jobRequests).subscribe((jobRequests) => {
      this.jobRequests = jobRequests;
    });
  }
  ngOnInit(): void {
    this.refresh();
  }
  jobRequests: GetJobRequestResponseDto[] = [];

  acceptRequest(requestId: number) {
    this.jobRequestService
      .acceptRequest({ jobRequestId: requestId })
      .subscribe({
        next: (data) => {
          this.snackbar.showSnackbar('Request accepted');
          this.refresh();
        },
        error: (error) => {
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
  }

  rejectRequest(requestId: number) {
    this.jobRequestService
      .rejectRequest({ jobRequestId: requestId })
      .subscribe({
        next: (data) => {
          this.snackbar.showSnackbar('Request rejected');
          this.refresh();
        },
        error: (error) => {
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending_no_offer':
        return 'yellow'; // Apply your desired CSS color for pending status
      case 'pending_with_offer':
        return 'orange'; // Apply your desired CSS color for pending status
      case 'accepted':
        return 'green'; // Apply your desired CSS color for accepted status
      case 'rejected':
        return 'red'; // Apply your desired CSS color for rejected status
      default:
        return 'black'; // Apply a default color if status is unknown
    }
  }
}
