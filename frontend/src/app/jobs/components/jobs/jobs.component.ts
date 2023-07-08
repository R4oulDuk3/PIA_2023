import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { userType } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  userType$: Observable<string> = this.store.select(userType);
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
