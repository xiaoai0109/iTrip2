import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Stay } from '../../models/stay';
import { NavParams } from 'ionic-angular';

@Injectable()
export class StayListServiceProvider {
  private stayListRef;
  private key;
  constructor(public http: HttpClient,private db : AngularFireDatabase) {
    console.log('Hello StayListServiceProvider Provider');
  }
  getKey() {
    return this.key;
  }
  addStay(stay: Stay, storyId: string) {
    this.stayListRef = this.db.list<Stay>("/stays/" + storyId);
    this.key = this.stayListRef.push(stay).key;
  }
  getStayList(storyId: string) {
    this.stayListRef = this.db.list<Stay>("/stays/" + storyId);
    return this.stayListRef;
  }

}
