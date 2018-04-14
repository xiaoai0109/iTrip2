import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripPage } from '../../pages/trip/trip';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tripList : Observable<Trip[]>;

  // static data below
  userName: string = "Peiyan";
  uid: string = "111";

  // tripList: Trip[] = [
  //   {
  //     name: 'Activities in Singapore',
  //     description: 'I am going here from April 5th',
  //     createdDate: 'Apr 05, 2018'
  //   },
  //   {
  //     name: 'Happiness in normal days',
  //     description: 'Where I have been in Singapore~',
  //     createdDate: 'Mar 15, 2018'
  //   }
  // ]
  // static data above
  
  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private tripListService: TripListServiceProvider) {
    this.tripList = this.tripListService.getTripList(this.uid)
    .snapshotChanges()
    .map(
      changes => {
        return changes.map ( c=> ({
          key: c.payload.key, ...c.payload.val()
        }))
      }
    )
  }

  navToTrip(trip: Trip) {
    this.navCtrl.push("page-trip", { trip : trip });
  }

  addTrip() {
    this.navCtrl.push("page-add-trip");
  }

  editTrip(trip: Trip) {
    this.navCtrl.push('page-edit-trip', { trip : trip });
  }
}
