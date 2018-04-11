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
    // need to pass uid to constructor
    let uid = '111';
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
  }

  getTripList() {
    return this.tripListRef;
  }

  addTrip(trip : Trip) {
    return this.tripListRef.push(trip);
  }

  updateTrip(trip : Trip) {
    return this.tripListRef.update(trip.key, trip);
  }

  removeTrip(trip : Trip) {
    return this.tripListRef.remove(trip.key);
  }
}
