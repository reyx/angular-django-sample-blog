import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import to from 'await-to-js';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: Date;

  // the username of the logged in user
  public username: string;

  // the email of the logged in user
  public email: string;

  // error messages received from the login attempt
  public errors: any = {};

  constructor(private _http: HttpClient) {
    let storage = localStorage.getItem('user');
    if (storage) {
      let user = JSON.parse(storage);
      Object.assign(this, user);
    }
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
    this.email = null;
    localStorage.removeItem('user');
  }

  public async refreshToken() {
    let err, res;
    [err, res] = await to(this._http.post('/api-token-refresh/', { token: this.token }).toPromise());

    if (err) this.errors = err['error'];
    else this.updateData(res['token']);
  }

  public async login(credentials: { username: any; password: any; }) {
    let err, res;
    [err, res] = await to(this._http.post('/api-token-auth/', credentials).toPromise());

    if (err) this.errors = err['error'];
    else this.updateData(res['token']);
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
    this.email = token_decoded.email;

    localStorage.setItem('user', JSON.stringify({
      token: this.token,
      token_expires: this.token_expires,
      username: this.username,
      email: this.email,
    }));
  }
}
