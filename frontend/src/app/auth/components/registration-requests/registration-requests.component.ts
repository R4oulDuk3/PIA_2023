import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  GetRegistrationRequestsDto,
  RegistrationRequestDto,
} from '../../dtos/auth.dto';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-registration-requests',
  templateUrl: './registration-requests.component.html',
  styleUrls: ['./registration-requests.component.scss'],
})
export class RegistrationRequestsComponent implements OnInit {
  dataSource: MatTableDataSource<RegistrationRequestDto>;
  displayedColumns: string[] = [
    'username',
    'email',
    'phone',
    'image',
    'type',
    'actions',
  ];

  constructor(
    private authService: AuthService,
    private snackbar: SnackbarService
  ) {}

  refresh() {
    this.authService.getRegisterRequestList().subscribe({
      next: (data: GetRegistrationRequestsDto) => {
        console.log(data);
        this.snackbar.showSnackbar('Refreshed data');
        this.dataSource = new MatTableDataSource(data.registrationRequests);
      },
      error: (error) => {
        console.log(error);
        this.snackbar.showSnackbar(error);
      },
    });
  }
  ngOnInit(): void {
    this.refresh();
  }
  acceptRequest(request: RegistrationRequestDto) {
    console.log('Accepted request:', request);
    this.authService
      .handleRegisterRequest({ id: request.id, status: 'accepted' })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.snackbar.showSnackbar('Accepted request');
          this.refresh();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(error);
        },
      });
  }

  denyRequest(request: RegistrationRequestDto) {
    console.log('Denied request:', request);
    this.authService
      .handleRegisterRequest({ id: request.id, status: 'rejected' })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.snackbar.showSnackbar('Rejected request');
          this.refresh();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar(error);
        },
      });
  }
}
