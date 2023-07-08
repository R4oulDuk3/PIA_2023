import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-object-creator',
  templateUrl: './object-creator.component.html',
  styleUrls: ['./object-creator.component.scss'],
})
export class ObjectCreatorComponent implements OnInit {
  maxRooms = 3;
  buildingForm: FormGroup;
  step = 0;
  constructor(private fb: FormBuilder, private snackbar: SnackbarService) {
    this.buildingForm = this.fb.group({
      objectType: ['', Validators.required],
      address: ['', Validators.required],
      roomNumber: ['', [Validators.required, Validators.max(this.maxRooms)]],
      area: ['', Validators.required],
      layout: [''],
    });
  }

  ngOnInit() {}

  submit() {
    // Here, you would add the logic to handle form submission, such as sending the form data to a server.
    console.log(this.buildingForm.value);
  }
}
