import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
import { HomePage } from '../home/home';

@IonicPage({
  name: 'page-edit-trip'
})
@Component({
  selector: 'page-edit-trip',
  templateUrl: 'edit-trip.html',
})
export class EditTripPage {
  trip : Trip = {
    name: '',
    description: '',
    createdDate: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private tripListService: TripListServiceProvider) {
    this.trip = this.navParams.get('trip');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTripPage');
  }

  updateTrip(trip: Trip) {
    this.tripListService.updateTrip(trip).then(() => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  removeTrip(trip: Trip) {
    this.tripListService.removeTrip(trip).then(() => {
      this.navCtrl.setRoot(HomePage);
    })
  }

}
