import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { userType } from 'src/app/state/auth/auth.selectors';
import { toggleSidebar, closeSidebar } from 'src/app/state/menu/menu.actions';
import { isSidebarOpen } from 'src/app/state/menu/menu.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  constructor(private store: Store<AppState>) {}

  public isOpen$: Observable<boolean> = this.store.select(isSidebarOpen);
  public userType$: Observable<string> = this.store.select(userType);

  sidebarItems: SidebarItem[] = [];

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    console.log('isOpen$ : ', this.isOpen$);
    this.userType$.subscribe({
      next: (type: string) => {
        if (type == 'client') {
          this.sidebarItems = [
            { label: 'Agencies', icon: 'dashboard', route: '/' },
            { label: 'Objects', icon: 'people', route: '/object/list' },
            { label: 'Jobs', icon: 'settings', route: '/jobs/client/list' },
          ];
        } else if (type == 'agency') {
          this.sidebarItems = [
            { label: 'Workers', icon: 'dashboard', route: '/workers/list' },
            {
              label: 'Jobs',
              icon: 'settings',
              route: '/jobs/main',
            },
          ];
        } else if (type == 'admin') {
          this.sidebarItems = [
            { label: 'Registration', icon: 'dashboard', route: '/' },
            {
              label: 'Worker',
              icon: 'people',
              route: '/workers/admin/worker-increase-requests',
            },
            { label: 'Profiles', icon: 'people', route: '/profile/list' },
          ];
        }
      },
    });
  }

  closeSidebar() {
    this.store.dispatch(closeSidebar());
  }

  toggleSidebar() {
    this.store.dispatch(toggleSidebar());
  }
}

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
}
