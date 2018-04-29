import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Trip } from '../../models/trip';
import { NavParams } from 'ionic-angular';

@Injectable()
export class TripListServiceProvider {
  private tripListRef;

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello TripListServiceProvider Provider');
  }

  getTripList(uid : string) {
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    return this.tripListRef;
  }

  addTrip(trip : Trip, uid : string) {
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    return this.tripListRef.push(trip);
  }

  updateTrip(trip : Trip, uid : string) {
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    return this.tripListRef.update(trip.key, trip);
  }

  removeTrip(trip : Trip, uid : string) {
    let storyListRef = this.db.list<Trip>('/stories/');
    storyListRef.remove(trip.key);
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    return this.tripListRef.remove(trip.key);
  }
}
