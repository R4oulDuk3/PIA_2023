import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/services/upload.service';
import { AuthService } from '../../services/auth.service';
import { ImageUploadSuccessfullDto } from 'src/app/services/image-upload.dto';
import { RegisterClientDto } from '../../dtos/auth.dto';
import { Observable, Subscribable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import {
  isLoggedIn,
  registerErrorMessage,
  registerRequestSucessful,
  userType,
} from 'src/app/state/auth/auth.selectors';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss'],
})
export class RegisterClientComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  isRegistering = false;
  isUploading = false;
  uploadError = '';
  registrationSuccessSubscription: Subscription;
  registrationErrorSubscription: Subscription;
  userType$: Observable<string> = this.store.select(userType);
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private authService: AuthService,
    private uploadService: UploadService,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.registrationSuccessSubscription = this.store
      .select(registerRequestSucessful)
      .subscribe({
        next: (success: boolean | undefined) => {
          if (success) {
            this.snackBar.showSnackbar('Registration successful');
            this.router.navigate(['/register/success']);
          }
        },
      });
    this.registrationErrorSubscription = this.store
      .select(registerErrorMessage)
      .subscribe({
        next: (error?: string) => {
          if (error) {
            this.snackBar.showSnackbar(error);
          }
        },
      });
  }
  ngOnInit() {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        firstname: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        lastname: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(12),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,12}$/
          ),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        image: new FormControl(''),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const passwordControl = control.get('password');
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

  get f() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }
    const username = this.registerForm.get('username')?.value;
    const firstname = this.registerForm.get('firstname')?.value;
    const lastname = this.registerForm.get('lastname')?.value;
    const password = this.registerForm.get('password')?.value;
    const phone = this.registerForm.get('phone')?.value;
    const email = this.registerForm.get('email')?.value;
    let image = this.registerForm.get('image')?.value;
    console.log('Image:', image);
    if (!image) {
      image =
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png';
    }
    const registerDto: RegisterClientDto = {
      username: username,
      name: firstname,
      surname: lastname,
      password: password,
      phone: phone,
      email: email,
      image: image,
    };
    this.store.select(isLoggedIn).subscribe({
      next: (isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.authService.createClient(registerDto).subscribe({
            next: (response: any) => {
              this.snackBar.showSnackbar('Creation successful');
              this.router.navigate(['/profile/list']);
            },
            error: (error: any) => {
              this.snackBar.showSnackbar(error.error.message);
            },
          });
        } else {
          this.authService.registerClient(registerDto);
        }
      },
    });
  }

  onImageChange(event: any) {
    // Check if a file is selected
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

      // Validate image size and type
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          if (
            image.width >= 100 &&
            image.height >= 100 &&
            image.width <= 300 &&
            image.height <= 300 &&
            file.type.startsWith('image/')
          ) {
            this.uploadImage(file);
          } else {
            this.uploadError =
              'Invalid image dimensions. Image must be between 100x100 and 300x300 pixels.';
            this.snackBar.showSnackbar('Invalid image dimensions.');
          }
        };
        image.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  uploadImage(file: File) {
    this.isUploading = true;
    this.uploadError = '';

    // Call the upload service to send the image to the backend
    this.uploadService.uploadImage(file).subscribe({
      next: (imageUploadSuccessfullDto: ImageUploadSuccessfullDto) => {
        this.isUploading = false;
        console.log(imageUploadSuccessfullDto);
        this.registerForm
          .get('image')
          ?.setValue(imageUploadSuccessfullDto.imageNames[0]);
        this.snackBar.showSnackbar('Image uploaded successfully.');
      },
      error: (error: any) => {
        console.log(error);
        this.isUploading = false;
        this.uploadError = 'Error uploading image.';
        this.snackBar.showSnackbar('Error uploading image.');
      },
    });
  }
}
