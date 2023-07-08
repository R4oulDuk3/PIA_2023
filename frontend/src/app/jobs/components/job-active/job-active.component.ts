import { Component, OnInit } from '@angular/core';
import {
  GetActiveJobResultDto,
  GetActiveJobResultRoomDto,
  GetActiveJobResultRoomProgressDto,
  GetActiveJobResultRoomProgressWorkerDto,
  PayAndCommentJobDto,
} from '../../dtos/jobs-active.dto';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  GetAgencyWorkersResultDto,
  GetAgencyWorkersResultWorkerDto,
} from 'src/app/workers/dtos/workers.dto';
import { ActivatedRoute } from '@angular/router';
import { JobActiveService } from '../../services/job-active.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { WorkerService } from 'src/app/workers/services/worker.service';
import Konva from 'konva';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { username, userType } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-job-active',
  templateUrl: './job-active.component.html',
  styleUrls: ['./job-active.component.scss'],
})
export class JobActiveComponent implements OnInit {
  job: GetActiveJobResultDto;
  availableWorkers: GetAgencyWorkersResultWorkerDto[];
  assignedWorkers: GetActiveJobResultRoomProgressWorkerDto[];
  stage: Konva.Stage;
  jobState: string;
  username: string;
  userType: string;
  ratingOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  payAndCommentForm: FormGroup;
  payAndCommentDto: PayAndCommentJobDto = new PayAndCommentJobDto();
  roomAndRoomProgress: {
    room: GetActiveJobResultRoomDto;
    roomProgress?: GetActiveJobResultRoomProgressDto | undefined;
  }[] = [];
  displayedColumns: string[] = [
    'ordinalNumber',
    'x',
    'y',
    'width',
    'height',
    'workStarted',
    'state',
    'action',
  ];

  assignWorkersForm = new FormGroup({
    selectedWorker: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private jobActiveService: JobActiveService,
    private snackbar: SnackbarService,
    private workerService: WorkerService,
    private store: Store<AppState>,
    private formBuilder: FormBuilder
  ) {
    // Assign sample data to job and availableWorkers
  }
  setUsernameAndUserType() {
    this.store.select(username).subscribe((username) => {
      this.username = username;
    });
    this.store.select(userType).subscribe((userType) => {
      this.userType = userType;
    });
    if (this.userType === 'agency') {
      this.displayedColumns = [
        'ordinalNumber',
        'x',
        'y',
        'width',
        'height',
        'state',
        'action',
      ];
    } else {
      this.displayedColumns = [
        'ordinalNumber',
        'x',
        'y',
        'width',
        'height',
        'state',
      ];
    }
  }
  initializePayForm() {
    this.payAndCommentForm = this.formBuilder.group({
      comment: new FormControl(''),
      rating: new FormControl('', [Validators.min(1), Validators.max(5)]),
    });
  }
  refresh() {
    this.setUsernameAndUserType();
    this.initializePayForm();
    if (this.userType === 'agency') {
      this.workerService.getUnassignedWorkerList().subscribe({
        next: (data: GetAgencyWorkersResultDto) => {
          console.log(data);
          this.availableWorkers = data.workers;
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
    }
    this.route.params.subscribe((params) => {
      if (params['id']) {
        console.log('Active job ID:', params['id']);
        this.jobActiveService.getActiveJob(params['id']).subscribe({
          next: (data: GetActiveJobResultDto) => {
            console.log(data);
            this.job = data;
            this.assignedWorkers = data.assignedWorkers;
            this.roomAndRoomProgress = this.combineRoomsAndRoomProgress();
            this.jobState = this.job.state;

            this.drawChart(data);
          },
          error: (error) => {
            console.log(error);
            this.snackbar.showSnackbar(`Error: ${error.error.message}`);
          },
        });
      }
    });
  }

  combineRoomsAndRoomProgress() {
    const roomAndRoomProgress: {
      room: GetActiveJobResultRoomDto;
      roomProgress?: GetActiveJobResultRoomProgressDto | undefined;
    }[] = [];
    this.job.rooms.forEach((room) => {
      const roomProgress = this.job.roomProgress.find(
        (roomProgress) => roomProgress.roomId === room.id
      );
      roomAndRoomProgress.push({
        room,
        roomProgress,
      });
    });
    return roomAndRoomProgress;
  }

  checkIfJobHasEnoughAssignedWorkers() {
    console.log(
      `Checking if job has enough assigned workers [assignedWorkers: ${this.job.assignedWorkers.length}, rooms: ${this.job.rooms.length}]`
    );
    return this.job.assignedWorkers.length >= this.job.rooms.length;
  }

  startWork(roomId: number): void {
    console.log(`Starting work for room ${roomId}`);
    this.jobActiveService.startWorkOnRoom(this.job.id, roomId).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Work on room started');
        this.refresh();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.showSnackbar(`Error: ${error.error.message}`);
      },
    });
  }
  finishWork(roomId: number): void {
    this.jobActiveService.finishWorkOnRoom(this.job.id, roomId).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Work on room finished');
        this.refresh();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.showSnackbar(`Error: ${error.error.message}`);
      },
    });
  }

  getColorByRoomProgress(
    roomProgress: GetActiveJobResultRoomProgressDto | undefined
  ) {
    if (!roomProgress) {
      return 'yellow';
    }

    if (roomProgress.state == 'notStarted') {
      return 'yellow';
    } else if (roomProgress.state == 'inConstruction') {
      return 'red';
    } else if (roomProgress.state == 'finished') {
      return 'green';
    }
    return 'yellow';
  }

  drawChart(job: GetActiveJobResultDto) {
    if (this.stage) {
      this.stage.destroy();
    }
    this.stage = new Konva.Stage({
      container: 'chartCanvas',
      width: 400,
      height: 400,
    });
    const layer = new Konva.Layer();
    job.rooms.forEach((room) => {
      const roomProgress = job.roomProgress.find((roomProgress) => {
        return roomProgress.roomId == room.id;
      });
      const roomRect = new Konva.Rect({
        x: room.cordX,
        y: room.cordY,
        width: room.width,
        height: room.height,
        stroke: 'black',
        fill: this.getColorByRoomProgress(roomProgress),
      });
      layer.add(roomRect);
    });

    job.doors.forEach((door) => {
      const doorRect = new Konva.Rect({
        x: door.cordX,
        y: door.cordY,
        width: door.width,
        height: door.height,
        stroke: 'black',
        fill: 'green',
      });
      layer.add(doorRect);
    });
    this.stage.add(layer);
    this.stage.draw();
  }

  ngOnInit(): void {
    this.refresh();
  }

  assignWorker() {
    const selectedWorkerId = this.assignWorkersForm.value.selectedWorker;
    const selectedWorker = this.availableWorkers.find(
      (worker) => worker.id === selectedWorkerId
    );
    if (selectedWorker) {
      this.jobActiveService
        .assignWorkerToJob(this.job.id, selectedWorker.id)
        .subscribe({
          next: () => {
            this.refresh();
            this.snackbar.showSnackbar('Worker assigned successfully!');
          },
          error: (error) => {
            console.log(error);
            this.snackbar.showSnackbar(`Error: ${error.error.message}`);
          },
        });
    }
  }

  startRoomProgress(roomId: number) {
    console.log('Started progress for room ID:', roomId);
  }
  submitForm() {
    if (this.payAndCommentForm.valid) {
      this.payAndCommentDto.jobId = this.job.id;
      this.payAndCommentDto.comment = this.payAndCommentForm.value.comment;
      this.payAndCommentDto.rating = this.payAndCommentForm.value.rating;
      this.jobActiveService.payWorkForJob(this.payAndCommentDto).subscribe({
        next: () => {
          this.snackbar.showSnackbar('Payment successful!');
          console.log(this.payAndCommentDto);
          this.payAndCommentForm.reset();
          this.refresh();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
    }
  }
}
