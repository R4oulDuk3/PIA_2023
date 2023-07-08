import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  AfterViewChecked,
} from '@angular/core';
import {
  GetJobRequestsWithUserAndObjectResultDto,
  GetJobRequestsWithUserAndObjectResultJobRequestDto,
} from '../../dtos/jobs-requests.dto';
import { JobRequestService } from '../../services/jobs-request.service';
import Konva from 'konva';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-job-list-agency',
  templateUrl: './job-list-agency.component.html',
  styleUrls: ['./job-list-agency.component.scss'],
})
export class JobListAgencyComponent implements OnInit, AfterViewChecked {
  jobRequests: GetJobRequestsWithUserAndObjectResultJobRequestDto[];
  stages: Konva.Stage[] = [];
  refreshing = false;
  offerPrice = 0;
  constructor(
    private jobService: JobRequestService,
    private snackbar: SnackbarService
  ) {}
  ngAfterViewChecked(): void {
    if (this.refreshing) {
      console.log('refreshing');
      this.refreshing = false;
      this.redrawCanvases();
    }
  }

  ngOnInit(): void {
    this.refresh();
  }

  makeOffer(requestId: number) {
    this.jobService
      .makeOffer({ jobRequestId: requestId, offer: this.offerPrice })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.snackbar.showSnackbar('Offer made');
          this.refresh();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(`Error: ${error.error.message}`);
        },
      });
  }

  rejectRequest(requestId: number) {
    this.jobService.rejectRequest({ jobRequestId: requestId }).subscribe({
      next: (data) => {
        console.log(data);
        this.snackbar.showSnackbar('Request rejected');
        this.refresh();
      },
      error: (error) => {
        console.log(error);
        this.snackbar.showSnackbar(`Error: ${error.error.message}`);
      },
    });
  }

  refresh() {
    this.jobService.getJobRequestsForAgencyList().subscribe({
      next: (data: GetJobRequestsWithUserAndObjectResultDto) => {
        this.jobRequests = data.jobRequests;
        console.log(this.jobRequests);
        this.refreshing = true;
      },

      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  redrawCanvases() {
    this.stages.forEach((stage) => {
      stage.destroy();
    });
    this.stages = [];
    console.log('Destroyed stages');
    this.jobRequests.forEach((jobRequest) => {
      console.log(jobRequest);
      const stage = new Konva.Stage({
        container: `canvas-${jobRequest.id}`,
        width: 400,
        height: 400,
      });

      this.stages.push(stage);
      const layer = new Konva.Layer();
      stage.add(layer);

      jobRequest.objectInfo.rooms.forEach((room) => {
        const rect = new Konva.Rect({
          x: room.cordX,
          y: room.cordY,
          width: room.width,
          height: room.height,
          stroke: 'green',
          strokeWidth: 3,
        });
        layer.add(rect);
      });
      jobRequest.objectInfo.doors.forEach((door) => {
        const rect = new Konva.Rect({
          x: door.cordX,
          y: door.cordY,
          width: door.width,
          height: door.height,
          fill: 'green',
          stroke: 'black',
          strokeWidth: 1,
        });
        layer.add(rect);
      });
      stage.draw();
      console.log(stage);
    });
  }
}
