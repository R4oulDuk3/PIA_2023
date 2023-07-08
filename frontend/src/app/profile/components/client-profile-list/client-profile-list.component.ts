import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  GetClientUserInfoListResultDto,
  GetClientUserInfoResultDto,
} from '../../dtos/profile.dto';
import { ProfileService } from '../../services/profile.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { error } from 'console';

@Component({
  selector: 'app-client-profile-list',
  templateUrl: './client-profile-list.component.html',
  styleUrls: ['./client-profile-list.component.scss'],
})
export class ClientProfileListComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'name',
    'surname',
    'email',
    'phone',
    'image',
    'actions',
  ];

  clients: GetClientUserInfoResultDto[] = [];

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.loadClientInfo();
  }

  loadClientInfo() {
    this.profileService.getAllClientProfileInfo().subscribe({
      next: (data: GetClientUserInfoListResultDto) => {
        console.log('data', data);
        this.clients = data.clients;
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.showSnackbar('Failed to load clients');
      },
    });
  }

  editClient(client: GetClientUserInfoResultDto) {
    this.router.navigate(['/profile/overview/client', client.username]);
  }

  deleteClient(client: GetClientUserInfoResultDto) {
    console.log('deleteClient', client);
    this.profileService.deleteProfile({ username: client.username }).subscribe({
      next: () => {
        this.snackbar.showSnackbar('Client deleted');
        this.loadClientInfo();
      },
      error: (error: any) => {
        console.error(error);
        this.snackbar.showSnackbar('Failed to delete client');
      },
    });
  }
}
