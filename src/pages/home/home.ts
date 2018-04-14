import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripPage } from '../../pages/trip/trip';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { PopoverComponent } from '../../components/popover/popover';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tripList: Observable<Trip[]>;
  // static data below
  googleUser = firebase.auth().currentUser;
  user: User = {
    uid: '222',
    name: 'Peiyan',
    avater: 'assets/img/avater-example.png'
  };
  // static data below

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

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private popoverCtrl: PopoverController,
    private userService: UserServiceProvider, private tripListService: TripListServiceProvider) {

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
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val()
          }))
        }
      )
  }

  navToTrip(trip: Trip) {
    this.navCtrl.push("page-trip", { trip: trip });
  }

  addTrip() {
    this.navCtrl.push("page-add-trip", { uid: this.user.uid });
  }

  editTrip(trip: Trip) {
    this.navCtrl.push('page-edit-trip', { trip: trip, uid: this.user.uid });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }
}
