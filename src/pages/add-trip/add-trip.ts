import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../../models/trip';
import { DatePipe } from '@angular/common';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
import { HomePage } from '../home/home';


/**
 * Generated class for the AddTripPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-add-trip'
})
@Component({
  selector: 'page-add-trip',
  templateUrl: 'add-trip.html',
})
export class AddTripPage {
  trip : Trip = {
    name: '',
    description: '',
    createdDate: ''
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public datepipe: DatePipe, private tripListService: TripListServiceProvider) {
  }

  addTrip(trip: Trip) {
    trip.createdDate = this.datepipe.transform(new Date(), 'mediumDate');
    this.tripListService.addTrip(trip).then(
      ref => {
        this.navCtrl.setRoot(HomePage);
      }
    ) 
    console.log(trip.createdDate);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTripPage');
  }

}
