import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Trip } from '../../models/trip';

/*
  Generated class for the TripListServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TripListServiceProvider {
  private tripListRef = this.db.list<Trip>('trip-list');

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello TripListServiceProvider Provider');
  }

  addTrip(trip : Trip) {
    // user-trips also need to push
    return this.tripListRef.push(trip);
  }


}
