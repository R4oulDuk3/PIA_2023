import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UpdatePasswordDto } from '../../dtos/auth.dto';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { logout } from 'src/app/state/auth/auth.actions';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  updatePasswordForm: FormGroup;
  hide = true; // for password input
  username: string;
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  initializeForm() {
    this.updatePasswordForm = new FormGroup(
      {
        oldPassword: new FormControl(null, Validators.required),
        newPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/
          ),
        ]),
        confirmPassword: new FormControl(null, Validators.required),
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const passwordControl = control.get('newPassword');
    const confirmPasswordControl = control.get('confirmPassword');

    if (
      passwordControl &&
      confirmPasswordControl &&
      passwordControl.value === confirmPasswordControl.value
    ) {
      confirmPasswordControl.setErrors(null);
      return null;
    } else if (confirmPasswordControl) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };

  setUsername() {
    this.store.select(username).subscribe((username) => {
      this.username = username;
    });
  }

  refresh() {
    this.initializeForm();
    this.setUsername();
  }

  ngOnInit(): void {
    this.refresh();
  }

  onUpdatePassword() {
    if (
      this.updatePasswordForm.value.newPassword !==
      this.updatePasswordForm.value.confirmPassword
    ) {
      this.updatePasswordForm.controls['confirmPassword'].setErrors({
        incorrect: true,
      });
    } else if (this.updatePasswordForm.valid) {
      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: this.updatePasswordForm.value.oldPassword,
        newPassword: this.updatePasswordForm.value.newPassword,
        username: this.username,
      };
      this.authService.updatePassword(updatePasswordDto).subscribe({
        next: () => {
          console.log('Password updated successfully!');
          this.snackbar.showSnackbar('Password updated successfully!');
          this.refresh();
          this.store.dispatch(logout());
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
          this.snackbar.showSnackbar(err.error.message);
        },
      });
      console.log(updatePasswordDto);
    }
  }
}
