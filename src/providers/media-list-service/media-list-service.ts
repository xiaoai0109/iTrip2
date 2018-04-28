import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Media } from '../../models/media';
import { NavParams } from 'ionic-angular';

@Injectable()
export class MediaListServiceProvider {
  private mediaListRef;
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello MediaListServiceProvider Provider');
  }
  addMedia(media: Media, storyId: string, stayId: string) {
    this.mediaListRef = this.db.list<Media>("/media/" + storyId + "/" + stayId);
    let key = this.mediaListRef.push(media).key;
    this.mediaListRef = this.db.list<Media>("/story-media/" + storyId);
    this.mediaListRef.update(key, media);
  }
  getMediaList(storyId, stayId) {
    this.mediaListRef = this.db.list<Media>("/media/" + storyId + "/" + stayId);
    return this.mediaListRef;
  }
  getMediaListForStory(storyId) {
    this.mediaListRef = this.db.list<Media>("/story-media/" + storyId);
    return this.mediaListRef;
  }

}
