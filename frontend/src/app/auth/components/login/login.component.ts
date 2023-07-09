import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { errorMessage, isLoggedIn } from 'src/app/state/auth/auth.selectors';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
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
        next: (error?: HttpErrorResponse) => {
          if (error) {
            if (error.status === 404) {
              this.snackBar.showSnackbar('User not found');
            } else if (error.status === 500) {
              this.snackBar.showSnackbar("There's a problem with the server");
            }
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
