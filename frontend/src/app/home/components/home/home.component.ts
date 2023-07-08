import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { userType } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userType$: Observable<string> = this.store.select(userType);
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}
}
