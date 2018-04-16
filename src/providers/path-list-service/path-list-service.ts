import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Location } from '../../models/location';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the PathListServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PathListServiceProvider {
  private pathListRef;
  constructor(public http: HttpClient,private db : AngularFireDatabase) {
    //pass storyid
    console.log('Hello PathListServiceProvider Provider');
    
  }
  setKey(key){
    this.pathListRef = this.db.list<Location>('/paths/'+key);
  }
  addPath(location:Location){
  return this.pathListRef.push(location);
 }
 getPathList(){
   return this.pathListRef;
  }

}
