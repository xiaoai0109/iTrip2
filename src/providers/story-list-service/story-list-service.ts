import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Story } from '../../models/story';
import { NavParams } from 'ionic-angular';

@Injectable()
export class StoryListServiceProvider {
  private storyListRef;
  private key;

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello StoryListServiceProvider Provider');
        // need to pass tripId to constructor
        //let tripId = 'ttt';
        //this.storyListRef = this.db.list<Story>('/stories/' + tripId);
  }

  getKey(){
    return this.key;
  }

  getStoryList(tripId : string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    return this.storyListRef;
  }

  addStory(story : Story, tripId : string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
   this.key = this.storyListRef.push(story).key;
  }

  updateStory(story : Story, tripId : string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    return this.storyListRef.update(story.key, story);
  }

  removeStory(story : Story, tripId : string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    // also need to remove the stays and media
    return this.storyListRef.remove(story.key);
  }

}

