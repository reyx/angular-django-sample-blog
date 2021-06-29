import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';


@Injectable()
export class CoreInterceptor implements HttpInterceptor {
  constructor(private _userService: UserService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const isLoggedIn = this._userService.token && this._userService.token_expires > new Date();
    const isApiUrl = request.url.startsWith('/');

    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this._userService.token}`
        }
      });
    }

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this._userService.logout();
        return throwError({ "non_field_errors": ["Session expired."] });
      }

      return throwError(err);
    }))
  }
}
