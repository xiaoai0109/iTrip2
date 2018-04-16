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
  constructor(public http: HttpClient,private db : AngularFireDatabase) {
    console.log('Hello MediaListServiceProvider Provider');
  }
  addMedia(media:Media,storyid,stayid){
    this.mediaListRef= this.db.list<Media>("/Media/"+storyid+"/"+stayid);
  return this.mediaListRef.push(media);
 }
 getStayList(storyid,stayid){
  this.mediaListRef= this.db.list<Media>("/Media/"+storyid+"/"+stayid);
   return this.mediaListRef;
  }


}
