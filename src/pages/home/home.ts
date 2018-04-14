import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripPage } from '../../pages/trip/trip';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tripList : Observable<Trip[]>;
  googleUser = firebase.auth().currentUser;
  user: User = {
    name: '',
    avater: ''
  };

  // static data below
  // userName: string = "Peiyan";
  // uid: string = "111";

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
  
  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private userService: UserServiceProvider,
    private tripListService: TripListServiceProvider) {

    if (this.googleUser) {
      this.user.uid = this.googleUser.uid;
      this.user.name = this.googleUser.displayName;
      this.user.avater = this.googleUser.photoURL;
      this.userService.updateUser(this.user);
    } else {
      console.log("user failed", this.googleUser);
    };

    this.tripList = this.tripListService.getTripList(this.user.uid)
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
    this.navCtrl.push("page-add-trip", { uid : this.user.uid });
  }

  editTrip(trip: Trip) {
    this.navCtrl.push('page-edit-trip', { trip : trip, uid : this.user.uid });
  }
}
