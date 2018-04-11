import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Story } from '../../models/story';
import { NavParams } from 'ionic-angular';

@Injectable()
export class StoryListServiceProvider {
  private storyListRef;

  constructor(public http: HttpClient, private db : AngularFireDatabase) {
    console.log('Hello StoryListServiceProvider Provider');
        // need to pass tripId to constructor
        let tripId = 'ttt';
        this.storyListRef = this.db.list<Story>('/stories/' + tripId);
  }

  getStoryList() {
    return this.storyListRef;
  }

  addStory(story : Story) {
    return this.storyListRef.push(story);
  }

  updateStory(story : Story) {
    return this.storyListRef.update(story.key, story);
  }

  removeStory(story : Story) {
    return this.storyListRef.remove(story.key);
  }

}

