import { Component, OnInit } from '@angular/core';
import { UpsertWorkerDto } from '../../dtos/workers.dto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { WorkerService } from '../../services/worker.service';
import { username } from 'src/app/state/auth/auth.selectors';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-worker-editor',
  templateUrl: './worker-editor.component.html',
  styleUrls: ['./worker-editor.component.scss'],
})
export class WorkerEditorComponent implements OnInit {
  worker: UpsertWorkerDto = {
    name: '',
    surname: '',
    specialization: '',
    email: '',
    agencyUsername: '',
  };
  workerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private workerService: WorkerService,
    private snackbar: SnackbarService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.store
      .select((state) => state.workers.workerForEditing)
      .subscribe((worker) => {
        if (worker) {
          this.worker = worker;
        } else {
          this.store.select(username).subscribe((username) => {
            this.worker.agencyUsername = username;
          });
        }
        this.initializeForm();
        this.subscribeToFormChanges();
      });
  }

  initializeForm() {
    this.workerForm = this.formBuilder.group({
      name: [
        this.worker?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      surname: [
        this.worker?.surname || '',
        [Validators.required, Validators.minLength(2)],
      ],
      specialization: [
        this.worker?.specialization || '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [
        this.worker?.email || '',
        [Validators.required, Validators.email],
      ],
    });
  }

  get form() {
    return this.workerForm.controls;
  }
  subscribeToFormChanges() {
    if (this.worker) {
      this.workerForm.valueChanges.subscribe((formValues) => {
        console.log('formValues : ', formValues);
        this.worker = {
          id: this.worker.id,
          name: formValues.name,
          surname: formValues.surname,
          specialization: formValues.specialization,
          email: formValues.email,
          agencyUsername: this.worker.agencyUsername,
        };
        console.log('this.worker : ', this.worker);
      });
    }
  }

  confirm() {
    if (this.workerForm.invalid) {
      this.snackbar.showSnackbar('Please fill all required fields');
    }
    this.workerService.upsertWorker(this.worker).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Worker saved successfully');
        // this.router.navigate(['/workers/list']);
        this.location.back();
      },
      error: (error) => {
        console.log('error : ', error);
        this.snackbar.showSnackbar('Error while saving worker');
      },
    });

    // Perform save or update logic here
  }
}
