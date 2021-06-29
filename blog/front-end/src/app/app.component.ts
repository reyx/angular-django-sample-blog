import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { BlogPostService } from './blog-post.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: any;

  /**
  * An array of all the BlogPost objects from the API
  */
  public posts;

  /**
   * An object representing the data in the "add" form
   */
  public new_post: any;

  constructor(private _blogPostService: BlogPostService, public _userService: UserService) { }

  ngOnInit() {
    this.getPosts();
    this.new_post = { title: '', body: '' };
    this.user = { username: '', password: '' };
  }

  getPosts() {
    this._blogPostService.list().then(
      data => (this.posts = data),
      err => console.error(err)
    );
  }

  createPost() {
    this._blogPostService.create(this.new_post).then(
      res => {
        this.new_post.title = '';
        this.new_post.body = '';
        this.posts.push(res);
      },
      err => Object.assign(this._blogPostService.errors, err['error'])
    );
  }

  login() {
    this._userService.login({ 'username': this.user.username, 'password': this.user.password }).then(() => {
      this.user.username = '';
      this.user.password = '';
      this.new_post.title = '';
      this.new_post.body = '';
    });
  }

  refreshToken() {
    this._userService.refreshToken();
  }

  logout() {
    this._userService.logout();
  }
}
