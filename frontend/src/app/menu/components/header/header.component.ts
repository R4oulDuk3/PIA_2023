import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  isLoggedIn,
  userType,
  username,
} from '../../../state/auth/auth.selectors';
import { AppState } from '../../../state/app.state';
import { toggleSidebar } from '../../../state/menu/menu.actions';
import { Router } from '@angular/router';
import { log } from 'console';
import { logout } from 'src/app/state/auth/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn$.subscribe({
      next: (value) => console.log(`Is logged in: ${value}`),
    });
  }

  public isLoggedIn$: Observable<boolean> = this.store.select(isLoggedIn); // Set to true if the user is logged in
  userName$: Observable<string> = this.store.select(username); // User name of the logged-in user
  public userType$: Observable<string> = this.store.select(userType); // User type of the logged-in user
  navigateToSecurity(): void {
    this.router.navigate(['/auth/security']);
  }

  navigateToHome(): void {
    console.log('navigateToHome');
    this.router.navigate(['/']);
  }

  navigateToProfileOverview() {
    this.router.navigate(['/profile/overview']);
  }

  toggleSidebar(): void {
    console.log('toggleSidebar');
    this.store.dispatch(toggleSidebar());
  }

  logout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  routeToCreateClient(): void {
    this.router.navigate(['/create/client']);
  }

  routeToCreateAgency(): void {
    this.router.navigate(['/create/agency']);
  }
}
