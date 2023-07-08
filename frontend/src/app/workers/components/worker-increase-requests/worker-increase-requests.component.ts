import { Component, OnInit } from '@angular/core';
import { WorkerService } from '../../services/worker.service';
import {
  GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto,
  GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto,
} from '../../dtos/workers.dto';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-worker-increase-requests',
  templateUrl: './worker-increase-requests.component.html',
  styleUrls: ['./worker-increase-requests.component.scss'],
})
export class WorkerIncreaseRequestsComponent implements OnInit {
  dataSource: MatTableDataSource<GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto>;
  displayedColumns: string[] = [
    'id',
    'agencyName',
    'newMaxWorkerCount',
    'currentWorkerCount',
    'status',
    'actions',
  ];

  constructor(
    private workerService: WorkerService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }
  refresh() {
    this.workerService.getWorkerIncreaseRequestsForAllAgencies().subscribe({
      next: (
        data: GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoDto
      ) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data.requests);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.showSnackbar(`Error: ${err.error.message}`);
      },
    });
  }
  acceptRequest(
    request: GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto
  ) {
    console.log('Accepted request:', request);
    this.workerService
      .approvePendingWorkerIncreaseRequest({ id: request.id })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.snackbar.showSnackbar(`Request accepted.`);
          this.refresh();
        },
        error: (err) => {
          console.log(err);
          this.snackbar.showSnackbar(`Error: ${err.error.message}`);
        },
      });
  }

  rejectRequest(
    request: GetAllPendingWorkerIncreaseRequestsResultWithAgencyInfoRequestDto
  ) {
    console.log('Rejected request:', request);
    this.workerService
      .rejectPendingWorkerIncreaseRequest({ id: request.id })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.snackbar.showSnackbar(`Request rejected.`);
          this.refresh();
        },
        error: (err) => {
          console.log(err);
          this.snackbar.showSnackbar(`Error: ${err.error.message}`);
        },
      });
  }
}
