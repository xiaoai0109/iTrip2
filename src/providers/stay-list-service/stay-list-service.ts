import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Stay } from '../../models/stay';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the StayListServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StayListServiceProvider {
  private stayListRef;
  private key;
  constructor(public http: HttpClient,private db : AngularFireDatabase) {
    console.log('Hello StayListServiceProvider Provider');
  }

 getKey(){
   return this.key;
 }
  addStay(stay:Stay,storyid){
    this.stayListRef= this.db.list<Stay>("/Stays/"+storyid);
    this.key = this.stayListRef.push(stay).key;
 }
 getStayList(){
   return this.stayListRef;
  }


}
