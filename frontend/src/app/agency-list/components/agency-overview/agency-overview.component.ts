import { Component, OnInit } from '@angular/core';
import { AgencyQueryResultDto } from '../../dtos/agency.dto';
import { AgencyListService } from '../../services/agency-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { isLoggedIn } from 'src/app/state/auth/auth.selectors';
import { Observable } from 'rxjs';
import { SimpleObjectForUserResultDto } from 'src/app/object/dtos/object.dto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ObjectService } from 'src/app/object/services/object.service';
import { userObjects } from 'src/app/state/objects/objects.selectors';
import { JobRequestService } from 'src/app/jobs/services/jobs-request.service';
import { CreateJobRequestDto } from 'src/app/jobs/dtos/jobs-requests.dto';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-agency-overview',
  templateUrl: './agency-overview.component.html',
  styleUrls: ['./agency-overview.component.scss'],
})
export class AgencyOverviewComponent implements OnInit {
  agency: AgencyQueryResultDto;
  objects: SimpleObjectForUserResultDto[] = [];
  objectId: number;
  minStartDate: Date;
  addressForm: FormGroup;

  constructor(
    private agencyListService: AgencyListService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private router: Router,
    private objectService: ObjectService,
    private jobsService: JobRequestService,
    private snackbar: SnackbarService
  ) {
    this.addressForm = new FormGroup({
      address: new FormControl('', Validators.required),
      startDate: new FormControl('', [
        Validators.required,
        this.validateStartDate.bind(this),
      ]),
      endDate: new FormControl('', Validators.required),
    });
  }

  isLoggedIn$: Observable<boolean> = this.store.select(isLoggedIn);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.agencyListService.getAgency(parseInt(id)).subscribe((agency) => {
            this.agency = agency;
          });
        } else {
          this.agencyListService
            .getAgencyDepersonalized(parseInt(id))
            .subscribe((agency) => {
              this.agency = agency;
            });
        }
      });
    }

    this.fetchObjects();

    // Set minimum start date to current date
    this.minStartDate = new Date();

    // Initialize the form group
  }
  fetchObjects() {
    this.objectService.getSimpleObjectsForUser(true);
    this.store.select(userObjects).subscribe({
      next: (objects: SimpleObjectForUserResultDto[]) => {
        this.objects = objects;
      },
    });
  }

  onSubmit() {
    // Handle form submission
    if (this.addressForm.valid) {
      const startDate = this.addressForm.get('startDate')?.value;
      const endDate = this.addressForm.get('endDate')?.value;
      const createJobRequestDto: CreateJobRequestDto = {
        startDate: startDate,
        endDate: endDate,
        agencyId: this.agency.id,
        objectId: this.objectId,
      };
      this.jobsService.createJobRequest(createJobRequestDto).subscribe({
        next: (response) => {
          this.snackbar.showSnackbar('Job request created');
          this.fetchObjects();
        },
        error: (error) => {
          this.snackbar.showSnackbar('Error creating job request');
        },
      });
    }
  }

  validateStartDate(control: FormControl): { [key: string]: any } | null {
    const selectedStartDate = new Date(control.value);
    const currentDateTime = new Date();

    if (selectedStartDate <= currentDateTime) {
      return {
        startDateInvalid: true,
        message: 'Start date must be after current time',
      };
    }

    const selectedEndDate = new Date(this.addressForm?.get('endDate')?.value);

    if (selectedStartDate >= selectedEndDate) {
      return {
        startDateInvalid: true,
        message: 'Start date must be before end date',
      };
    }

    return null;
  }
}
