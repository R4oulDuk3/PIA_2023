import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { ProfileService } from '../../services/profile.service';
import {
  GetAgencyUserInfoResultDto,
  GetClientUserInfoResultDto,
  UpdateClientUserInfoDto,
  UpdateAgencyUserInfoDto,
} from '../../dtos/profile.dto';
import { userType, username } from 'src/app/state/auth/auth.selectors';
import { Observable, Subject, filter, switchMap, takeUntil } from 'rxjs';
import {
  agencyProfile,
  clientProfile,
} from 'src/app/state/profile/profile.selectors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ImageUploadSuccessfullDto } from 'src/app/services/image-upload.dto';
import { UploadService } from 'src/app/services/upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss'],
})
export class ProfileOverviewComponent implements OnInit, OnDestroy {
  formClient: FormGroup;
  formAgency: FormGroup;
  showClientForm = false;
  showAgencyForm = false;
  isUploading = false;
  uploadError = '';
  username = '';
  userType = '';
  clientUserInfo: GetClientUserInfoResultDto | null = null;
  agencyUserInfo: GetAgencyUserInfoResultDto | null = null;
  private onDestroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private snackBar: SnackbarService,
    private uploadService: UploadService,
    private route: ActivatedRoute
  ) {}
  initializeFormClient(clientUserInfo: GetClientUserInfoResultDto) {
    this.formClient = this.formBuilder.group({
      name: [clientUserInfo.name, Validators.required],
      surname: [clientUserInfo.surname, Validators.required],
      email: [clientUserInfo.email, [Validators.required, Validators.email]],
      phone: [clientUserInfo.phone, Validators.required],
      image: [clientUserInfo.image, Validators.required],
    });
  }

  initalizeAgencyForm(agencyUserInfo: GetAgencyUserInfoResultDto) {
    this.formAgency = this.formBuilder.group({
      name: [agencyUserInfo.name, Validators.required],
      country: [agencyUserInfo.country, Validators.required],
      city: [agencyUserInfo.city, Validators.required],
      address: [agencyUserInfo.address, Validators.required],
      email: [agencyUserInfo.email, [Validators.required, Validators.email]],
      phone: [agencyUserInfo.phone, Validators.required],
      image: [agencyUserInfo.image, Validators.required],
    });
  }
  setUserType() {
    if (this.route.snapshot.params.usertype) {
      this.userType = this.route.snapshot.params.usertype;
    } else {
      this.store.select(userType).subscribe((userType) => {
        this.userType = userType;
      });
    }
  }
  setUserName() {
    if (this.route.snapshot.params.username) {
      this.username = this.route.snapshot.params.username;
    } else {
      this.store.select(username).subscribe((username) => {
        this.username = username;
      });
    }
  }
  toggleClientForm() {
    this.showClientForm = !this.showClientForm;
  }
  toggleAgencyForm() {
    this.showAgencyForm = !this.showAgencyForm;
  }
  submitAgencyForm() {
    if (this.agencyUserInfo) {
      const agencyInfo: UpdateAgencyUserInfoDto = {
        username: this.username,
        name: this.formAgency.value.name,
        country: this.formAgency.value.country,
        city: this.formAgency.value.city,
        address: this.formAgency.value.address,
        email: this.formAgency.value.email,
        phone: this.formAgency.value.phone,
        image: this.formAgency.value.image,
      };
      this.profileService.updateAgencyProfile(agencyInfo).subscribe({
        next: () => {
          this.snackBar.showSnackbar('Profile updated');
          this.refresh();
          this.toggleAgencyForm();
        },
        error: (err) => {
          this.snackBar.showSnackbar(err.error);
          console.log(err);
        },
      });
    }
  }

  submitClientForm() {
    if (this.clientUserInfo) {
      const clientInfo: UpdateClientUserInfoDto = {
        username: this.username,
        name: this.formClient.value.name,
        surname: this.formClient.value.surname,
        email: this.formClient.value.email,
        phone: this.formClient.value.phone,
        image: this.formClient.value.image,
      };
      this.profileService.updateClientProfile(clientInfo).subscribe({
        next: () => {
          this.snackBar.showSnackbar('Profile updated');
          this.refresh();
          this.toggleClientForm();
        },
        error: (err) => {
          this.snackBar.showSnackbar(err.error);
          console.log(err);
        },
      });
    }
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.setUserName();
    this.setUserType();

    if (this.userType === 'client') {
      this.profileService.getClientProfile(this.username);
      this.store.select(clientProfile).subscribe((clientProfile) => {
        this.clientUserInfo = clientProfile;
        if (this.clientUserInfo) {
          this.initializeFormClient(this.clientUserInfo);
        }
      });
    } else if (this.userType == 'agency') {
      this.profileService.getAgencyProfile(this.username);
      this.store.select(agencyProfile).subscribe((agencyProfile) => {
        this.agencyUserInfo = agencyProfile;
        if (this.agencyUserInfo) {
          this.initalizeAgencyForm(this.agencyUserInfo);
        }
      });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  onImageChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      const reader = new FileReader();

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
        if (this.userType == 'client') {
          this.formClient
            .get('image')
            ?.setValue(imageUploadSuccessfullDto.imageNames[0]);
          this.snackBar.showSnackbar('Image uploaded successfully.');
        } else if (this.userType == 'agency') {
          this.formAgency
            .get('image')
            ?.setValue(imageUploadSuccessfullDto.imageNames[0]);
          this.snackBar.showSnackbar('Image uploaded successfully.');
        }
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
