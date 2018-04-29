import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Story } from '../../models/story';
import { NavParams } from 'ionic-angular';

@Injectable()
export class StoryListServiceProvider {
  private storyListRef;
  private key;

  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello StoryListServiceProvider Provider');
  }

  getKey() {
    return this.key;
  }

  getStoryList(tripId: string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    return this.storyListRef;
  }

  addStory(story: Story, tripId: string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    this.key = this.storyListRef.push(story).key;
  }

  updateStory(story: Story, tripId: string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    return this.storyListRef.update(story.key, story);
  }

  removeMediaOfStory(storyId: string, tripId: string) {
    // remove all the stays and media of this story
    this.storyListRef = this.db.list<Story>('/stays/');
    this.storyListRef.remove(storyId);
    this.storyListRef = this.db.list<Story>('/media/');
    this.storyListRef.remove(storyId);
    this.storyListRef = this.db.list<Story>('/story-media/');
    return this.storyListRef.remove(storyId);
  }

  removeStory(storyId: string, tripId: string) {
    this.storyListRef = this.db.list<Story>('/stories/' + tripId);
    return this.storyListRef.remove(storyId);
  }

}

