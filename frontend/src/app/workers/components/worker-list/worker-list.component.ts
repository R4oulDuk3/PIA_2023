import { Component, OnInit } from '@angular/core';
import {
  GetAgencyWorkersResultDto,
  GetWorkerIncreaseRequestsForAgencyDto,
  GetWorkerIncreaseRequestsForAgencyResultDto,
  GetWorkerIncreaseRequestsForAgencyResultRequestDto,
  UpsertWorkerDto,
} from '../../dtos/workers.dto';
import { WorkerService } from '../../services/worker.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import {
  clearWorkerForEditing,
  putWorkerForEditing,
} from 'src/app/state/workers/workers.actions';
import { userType, username } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-worker-list',
  templateUrl: './worker-list.component.html',
  styleUrls: ['./worker-list.component.scss'],
})
export class WorkerListComponent implements OnInit {
  result: GetAgencyWorkersResultDto;
  requests: GetWorkerIncreaseRequestsForAgencyResultRequestDto[];
  showWorkersTable = true;
  newMaxWorkerCount: number;
  username: string;
  userType: string;
  constructor(
    private workerService: WorkerService,
    private snackbar: SnackbarService,
    private router: Router,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {}

  setUsername() {
    if (this.route.snapshot.params.username) {
      this.username = this.route.snapshot.params.username;
    } else {
      this.store.select(username).subscribe((username) => {
        this.username = username;
      });
    }
  }

  setUserType() {
    this.store.select(userType).subscribe((userType) => {
      this.userType = userType;
    });
  }

  refresh() {
    this.setUsername();
    this.setUserType();
    this.workerService.getWorkerList(this.username).subscribe({
      next: (result: GetAgencyWorkersResultDto) => {
        console.log('result : ', result);
        this.result = result;
      },
      error: (error) => {
        console.log('error : ', error);
        this.snackbar.showSnackbar('Error while getting workers list');
      },
    });
    this.workerService
      .getWorkerIncreaseRequestsForAgency(this.username)
      .subscribe({
        next: (result: GetWorkerIncreaseRequestsForAgencyResultDto) => {
          console.log('requests : ', result);
          this.requests = result.requests;
        },
        error: (error) => {
          console.log('error : ', error);
          this.snackbar.showSnackbar(
            'Error while getting worker increase requests list'
          );
        },
      });
  }

  isConfirmEnabled(): boolean {
    return this.newMaxWorkerCount > this.result.maxWorkerCount;
  }

  createIncreaseRequest() {
    this.workerService
      .createWorkerIncreaseRequest(this.newMaxWorkerCount)
      .subscribe({
        next: () => {
          this.snackbar.showSnackbar(
            'Worker increase request created successfully'
          );
          this.refresh();
        },
        error: (error) => {
          console.log('error : ', error);
          this.snackbar.showSnackbar(
            `Error while creating worker increase request: ${error.message}`
          );
        },
      });
  }

  ngOnInit() {
    // Simulated data received from the API
    this.refresh();
  }

  toggleWorkersTable() {
    this.showWorkersTable = !this.showWorkersTable;
  }

  viewWorker(workerId: number) {
    const worker = this.result.workers.find((w) => w.id === workerId);
    if (!worker) {
      this.snackbar.showSnackbar('Worker not found');
      return;
    }
    this.store.select(username).subscribe((username) => {
      const upsertWorkerDto: UpsertWorkerDto = {
        id: worker.id,
        name: worker.name,
        surname: worker.surname,
        email: worker.email,
        specialization: worker.specialization,
        agencyUsername: username,
      };
      this.store.dispatch(
        putWorkerForEditing({ upsertWorkerDto: upsertWorkerDto })
      );
    });
    this.router.navigate(['/workers/editor']);
  }

  deleteWorker(workerId: number) {
    this.workerService.deleteWorker(workerId).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Worker deleted successfully');
        this.refresh();
      },
      error: (error) => {
        console.log('error : ', error);
        this.snackbar.showSnackbar(
          `Error while deleting worker: ${error.message}`
        );
      },
    });
  }

  createWorker() {
    this.store.dispatch(clearWorkerForEditing());
    this.router.navigate(['/workers/editor']);
  }

  getRequestRowClass(status: string) {
    switch (status) {
      case 'pending':
        return 'pending-row';
      case 'accepted':
        return 'accepted-row';
      case 'rejected':
        return 'rejected-row';
      default:
        return '';
    }
  }
}
