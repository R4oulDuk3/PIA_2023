import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, firstValueFrom, from, lastValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { accessToken } from '../state/auth/auth.selectors';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.handle(request, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    const token: string | undefined = await firstValueFrom(
      this.store.select(accessToken)
    );
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return await lastValueFrom(next.handle(req));
  }
}
