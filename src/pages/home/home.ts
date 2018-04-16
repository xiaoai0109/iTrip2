import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController, NavParams } from 'ionic-angular';
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
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tripList: Observable<Trip[]>;
  // static data below
  // googleUser = firebase.auth().currentUser;
  user: User = {
    uid: '222',
    name: 'Peiyan',
    avater: 'assets/img/avater-example.png'
  };

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private popoverCtrl: PopoverController, private navParams: NavParams,
    private facebook: Facebook, private userService: UserServiceProvider, private tripListService: TripListServiceProvider) {

    // if (this.googleUser) {
    //   this.user.uid = this.googleUser.uid;
    //   this.user.name = this.googleUser.displayName;
    //   this.user.avater = this.googleUser.photoURL;
    //   this.userService.updateUser(this.user);
    // } else {
    //   console.log("user failed", this.googleUser);
    // };

    this.user = this.navParams.get('user');
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
    this.navCtrl.push("page-add-trip", { user: this.user });
  }

  editTrip(trip: Trip) {
    this.navCtrl.push('page-edit-trip', { trip: trip, user: this.user  });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

  logOut() {
    this.facebook.logout();
    this.navCtrl.setRoot('page-login');
  }
}
