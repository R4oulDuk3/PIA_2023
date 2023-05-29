import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { isLoggedIn } from '../../../state/auth/auth.selectors';
import { AppState } from '../../../state/app.state';
import { toggleSidebar } from '../../../state/menu/menu.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
  }

  public isLoggedIn$: Observable<boolean> = this.store.select(isLoggedIn); // Set to true if the user is logged in
  userName: string = 'John Doe'; // User name of the logged-in user

  navigateToProfile(): void {
    // Implement navigation to the profile overview page
  }

  navigateToSecurity(): void {
    // Implement navigation to the security overview page
  }

  toggleSidebar(): void {
    console.log("toggleSidebar");
    this.store.dispatch(toggleSidebar());
  }

}
