import { Component } from '@angular/core';
import { NavController, PopoverController, NavParams } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripPage } from '../../pages/trip/trip';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
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
  user: User = {
    uid: '',
    name: '',
    avatar: ''
  };

  constructor(public navCtrl: NavController, public db: AngularFireDatabase, private popoverCtrl: PopoverController, private navParams: NavParams,
    private facebook: Facebook, private userService: UserServiceProvider, private tripListService: TripListServiceProvider) {

    // load user from local storage
    this.user.uid = window.localStorage.getItem('uid');
    this.user.name = window.localStorage.getItem('name');
    this.user.avatar = window.localStorage.getItem('avatar');
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
    this.navCtrl.push('page-trip', { trip: trip });
  }

  addTrip() {
    this.navCtrl.push('page-add-trip', { user: this.user });
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

}
