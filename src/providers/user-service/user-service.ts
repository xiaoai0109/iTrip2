import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';

@Injectable()
export class UserServiceProvider {
  private userListRef;

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello UserServiceProvider Provider');
  }

  updateUser(user : User) {
    window.localStorage.setItem('uid', user.uid);
    window.localStorage.setItem('name', user.name);
    window.localStorage.setItem('avatar', user.avatar);
    this.userListRef = this.db.list<User>('/users/');
    return this.userListRef.update(user.uid, user);
  }
}
