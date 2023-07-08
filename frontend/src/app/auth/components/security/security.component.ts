import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdatePasswordDto } from '../../dtos/auth.dto';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { username } from 'src/app/state/auth/auth.selectors';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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
    private snackbar: SnackbarService
  ) {}

  initializeForm() {
    this.updatePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
    });
  }

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
