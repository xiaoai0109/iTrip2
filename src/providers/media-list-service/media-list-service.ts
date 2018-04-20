import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Media } from '../../models/media';
import { NavParams } from 'ionic-angular';
/*
  Generated class for the MediaListServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaListServiceProvider {
  private mediaListRef;
  constructor(public http: HttpClient, private db: AngularFireDatabase) {
    console.log('Hello MediaListServiceProvider Provider');
  }
  addMedia(media: Media, storyId: string, stayId: string) {
    this.mediaListRef = this.db.list<Media>("/story-media/" + storyId);
    this.mediaListRef.push(media);
    this.mediaListRef = this.db.list<Media>("/media/" + storyId + "/" + stayId);
    return this.mediaListRef.push(media);
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
