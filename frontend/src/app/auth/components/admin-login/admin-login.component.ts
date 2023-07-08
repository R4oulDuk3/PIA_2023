import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AppState } from 'src/app/state/app.state';
import { errorMessage, isLoggedIn } from 'src/app/state/auth/auth.selectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  username = '';
  password = '';
  isLoading = false;

  loginErrorMessageSubscription: Subscription;

  isLoggedInSubscription: Subscription;

  constructor(
    private snackBar: SnackbarService,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.loginErrorMessageSubscription = this.store
      .select(errorMessage)
      .subscribe({
        next: (error?: string) => {
          if (error) {
            this.snackBar.showSnackbar(error);
          }
        },
      });

    this.isLoggedInSubscription = this.store.select(isLoggedIn).subscribe({
      next: (isLoggedIn: boolean) => {
        console.log('isLoggedIn: ' + isLoggedIn);
        if (isLoggedIn) {
          this.snackBar.showSnackbar('Login successful');
          this.router.navigate(['/']);
        }
      },
    });
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.loginErrorMessageSubscription.unsubscribe();
    this.isLoggedInSubscription.unsubscribe();
  }

  login() {
    this.auth.login(this.username, this.password);
  }
}
