import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Trip } from '../../models/trip';
import { NavParams } from 'ionic-angular';
import { StoryListServiceProvider } from '../story-list-service/story-list-service';
import { Observable } from 'rxjs/Observable';
import { Story } from '../../models/story';

@Injectable()
export class TripListServiceProvider {
  private tripListRef;
  private storyList: Observable<Story[]>;

  constructor(public http: HttpClient, private db : AngularFireDatabase, private storyListService : StoryListServiceProvider) {
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
    
    // this.storyList = this.storyListService.getStoryList(trip.key).snapshotChanges()
    //   .map(
    //     changes => {
    //       return changes.map(c => {
    //         this.storyListService.removeStory(c.payload.key, trip.key)
    //         return {
    //           key: c.payload.key, ...c.payload.val()
    //         }
    //       })
    //     }
    //   );

    let storyListRef = this.db.list<Trip>('/stories/');
    storyListRef.remove(trip.key);
    this.tripListRef = this.db.list<Trip>('/user-trips/' + uid);
    return this.tripListRef.remove(trip.key);
  }
}
