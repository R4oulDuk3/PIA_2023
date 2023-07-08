import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ImageUploadSuccessfullDto } from 'src/app/services/image-upload.dto';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { AppState } from 'src/app/state/app.state';
import {
  registerRequestSucessful,
  registerErrorMessage,
  isLoggedIn,
  userType,
} from 'src/app/state/auth/auth.selectors';
import { RegisterAgencyDto, RegisterClientDto } from '../../dtos/auth.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-agency',
  templateUrl: './register-agency.component.html',
  styleUrls: ['./register-agency.component.scss'],
})
export class RegisterAgencyComponent implements OnInit {
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
        agencyName: new FormControl('', Validators.required),
        country: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        agencyCode: new FormControl('', Validators.required),
        shortDescription: new FormControl('', Validators.required),
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
    const password = this.registerForm.get('password')?.value;
    const phone = this.registerForm.get('phone')?.value;
    const email = this.registerForm.get('email')?.value;
    const name = this.registerForm.get('agencyName')?.value;
    const country = this.registerForm.get('country')?.value;
    const city = this.registerForm.get('city')?.value;
    const address = this.registerForm.get('address')?.value;
    const agencyCode = this.registerForm.get('agencyCode')?.value;
    const shortDescription = this.registerForm.get('shortDescription')?.value;

    let image = this.registerForm.get('image')?.value;
    if (!image) {
      image =
        'https://pia-projekat-bucket.s3.eu-west-2.amazonaws.com/default.png';
    }
    const registerDto: RegisterAgencyDto = {
      username: username,
      name: name,
      password: password,
      phone: phone,
      email: email,
      image: image,
      country: country,
      city: city,
      address: address,
      uniqueCode: agencyCode,
      description: shortDescription,
    };
    this.store.select(isLoggedIn).subscribe({
      next: (isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.authService.createAgency(registerDto).subscribe({
            next: (response: any) => {
              this.snackBar.showSnackbar('Creation successful');
              this.router.navigate(['/profile/list']);
            },
            error: (error: any) => {
              this.snackBar.showSnackbar(error.error.message);
            },
          });
        } else {
          this.authService.registerAgency(registerDto);
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
            image.width <= 300 &&
            image.height <= 300 &&
            file.type.startsWith('image/')
          ) {
            this.uploadImage(file);
          } else {
            this.uploadError =
              'Invalid image dimensions. Image must be 300x300 pixels.';
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
