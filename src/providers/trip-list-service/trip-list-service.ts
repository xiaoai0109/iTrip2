import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Trip } from '../../models/trip';
import { NavParams } from 'ionic-angular';
import { StoryListServiceProvider } from '../story-list-service/story-list-service';

@Injectable()
export class TripListServiceProvider {
  private tripListRef;

  constructor(public http: HttpClient, private db : AngularFireDatabase, private storyListService : StoryListServiceProvider) {
    console.log('Hello TripListServiceProvider Provider');
    // need to pass uid to constructor
    // let uid = '111';
    
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
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    let storyListRef = this.db.list<Trip>('/stories/');
    storyListRef.remove(trip.key);
    // also need to remove stays and media in story
    console.log("remove", this.tripListRef.remove(trip.key));
    return this.tripListRef.remove(trip.key);
  }
}
