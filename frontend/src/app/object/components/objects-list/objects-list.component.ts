import { Component, OnInit } from '@angular/core';
import {
  DeleteObjectResultDto,
  SimpleObjectForUserResultDto,
} from '../../dtos/object.dto';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ObjectService } from '../../services/object.service';
import { userObjects } from 'src/app/state/objects/objects.selectors';
import { Observable, Subscription } from 'rxjs';
import { username } from 'src/app/state/auth/auth.selectors';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-objects-list',
  templateUrl: './objects-list.component.html',
  styleUrls: ['./objects-list.component.scss'],
})
export class ObjectsListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'type',
    'address',
    'country',
    'city',
    'area',
    'roomCount',
    'actions',
  ];
  objects$: Subscription;
  objects: SimpleObjectForUserResultDto[] = [];
  clientUsername: string;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private objectService: ObjectService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.objects$ = this.store.select(userObjects).subscribe({
      next: (objects: SimpleObjectForUserResultDto[]) => {
        this.objects = objects;
      },
    });
    this.objectService.getSimpleObjectsForUser();
    this.store.select(username).subscribe((username: string) => {
      this.clientUsername = username;
    });
  }

  navigateToChangePage(id: number) {
    // Implement your navigation logic here
  }

  destroyRow(id: number) {
    this.objectService
      .deleteObject({ id: id, username: this.clientUsername })
      .subscribe({
        next: (data: DeleteObjectResultDto) => {
          this.snackbar.showSnackbar(data.message);
          this.objectService.getSimpleObjectsForUser();
        },
        error: (error) => {
          console.log(error);
          this.snackbar.showSnackbar('An error has occured!');
          this.objectService.getSimpleObjectsForUser();
        },
      });
  }
  navigateToOverviewPage(id: number) {
    this.router.navigate(['object/editor/', id]);
  }
  navigateToCreatePage() {
    this.router.navigate(['object/editor']);
  }
}
