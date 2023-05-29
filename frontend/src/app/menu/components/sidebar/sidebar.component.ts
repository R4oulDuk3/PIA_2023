import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostListener, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { toggleSidebar, closeSidebar } from 'src/app/state/menu/menu.actions';
import { isSidebarOpen } from 'src/app/state/menu/menu.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private store: Store<AppState>,) {
  }
  ngOnInit(): void {
    console.log("isOpen$ : ", this.isOpen$);
  }


  public isOpen$: Observable<boolean> = this.store.select(isSidebarOpen);

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];


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
