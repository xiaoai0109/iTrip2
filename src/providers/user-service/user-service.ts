import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../../models/user';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  private userListRef;

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello UserServiceProvider Provider');
  }

  updateUser(user : User) {
    this.userListRef = this.db.list<User>('/users/');
    return this.userListRef.update(user.uid, user);
  }
}
