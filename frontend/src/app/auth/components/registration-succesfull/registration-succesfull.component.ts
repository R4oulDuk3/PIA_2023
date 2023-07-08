import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { registerReset } from 'src/app/state/auth/auth.actions';
import { registerEmail } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-registration-succesfull',
  templateUrl: './registration-succesfull.component.html',
  styleUrls: ['./registration-succesfull.component.scss'],
})
export class RegistrationSuccesfullComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.resetRegisterState();
  }

  email: Observable<string | undefined> = this.store.select(registerEmail);

  resetRegisterState() {
    this.store.dispatch(registerReset());
  }
}
