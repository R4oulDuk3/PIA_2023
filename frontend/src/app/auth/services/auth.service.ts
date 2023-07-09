import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  GetRegistrationRequestsDto,
  HandleRegistrationRequestDto,
  LoginDto,
  LoginSuccessfullDto,
  RegisterAgencyDto,
  RegisterClientDto,
  RegisterRequestSubmitedSuccessfullyDto,
  UpdatePasswordDto,
} from '../dtos/auth.dto';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import {
  loginFailure,
  loginSuccess,
  registerAgency,
  registerClient,
  registerFailure,
  registerSuccess,
} from 'src/app/state/auth/auth.actions';
import { error } from 'console';
import { Observable } from 'rxjs';
import { backendHost } from 'src/app/config/config';

const loginUrl = backendHost + '/auth/login';
const registerClientUrl = backendHost + '/auth/register/client';
const createClientUrl = backendHost + '/auth/create/client';
const registerAgencyUrl = backendHost + '/auth/register/agency';
const createAgencyUrl = backendHost + '/auth/create/agency';
const registerRequestListUrl = backendHost + '/auth/register/request/list';
const handleRegisterRequestUrl = backendHost + '/auth/register/request/handle';
const updatePasswordUrl = backendHost + '/auth/password/update';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  login(username: string, password: string) {
    const loginDto: LoginDto = new LoginDto();
    loginDto.username = username;
    loginDto.password = password;

    return this.http.post<any>(loginUrl, loginDto).subscribe({
      next: (data: LoginSuccessfullDto) => {
        console.log(data);
        this.store.dispatch(
          loginSuccess({
            accessToken: data.access_token,
            userType: data.type,
            username: data.username,
          })
        );
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.store.dispatch(loginFailure({ error: error }));
      },
    });
  }

  registerClient(data: RegisterClientDto) {
    this.store.dispatch(
      registerClient({ username: data.username, email: data.email })
    );
    return this.http
      .post<RegisterRequestSubmitedSuccessfullyDto>(registerClientUrl, data)
      .subscribe({
        next: (data: RegisterRequestSubmitedSuccessfullyDto) => {
          console.log(data);
          this.store.dispatch(registerSuccess({ message: data.message }));
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(registerFailure({ error: error.message }));
        },
      });
  }

  registerAgency(data: RegisterAgencyDto) {
    this.store.dispatch(
      registerAgency({ username: data.username, email: data.email })
    );
    return this.http
      .post<RegisterRequestSubmitedSuccessfullyDto>(registerAgencyUrl, data)
      .subscribe({
        next: (data: RegisterRequestSubmitedSuccessfullyDto) => {
          console.log(data);
          this.store.dispatch(registerSuccess({ message: data.message }));
        },
        error: (error) => {
          console.log(error);
          this.store.dispatch(registerFailure({ error: error.message }));
        },
      });
  }

  createAgency(data: RegisterAgencyDto) {
    return this.http.post(createAgencyUrl, data);
  }

  createClient(data: RegisterClientDto) {
    return this.http.post(createClientUrl, data);
  }

  getRegisterRequestList(): Observable<GetRegistrationRequestsDto> {
    return this.http.get<GetRegistrationRequestsDto>(registerRequestListUrl);
  }

  handleRegisterRequest(
    handleRegistrationRequestDto: HandleRegistrationRequestDto
  ) {
    return this.http.post(
      handleRegisterRequestUrl,
      handleRegistrationRequestDto
    );
  }
  updatePassword(updatePasswordDto: UpdatePasswordDto) {
    return this.http.post(updatePasswordUrl, updatePasswordDto);
  }
}
