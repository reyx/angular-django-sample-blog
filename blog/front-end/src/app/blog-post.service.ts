import to from 'await-to-js';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  // error messages received from the login attempt
  public errors: any = {};

  constructor(private _http: HttpClient) { }

  public list(): Promise<any> {
    return this._http.get('/api/posts').toPromise();
  }

  public async create(post): Promise<any> {
    Object.assign(this.errors, { title: [], body: [] });
    return this._http.post('/api/posts', post).toPromise();
  }
}
