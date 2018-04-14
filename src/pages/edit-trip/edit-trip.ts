import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  uid : string = "111";

  trip : Trip = {
    name: '',
    description: '',
    createdDate: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private tripListService: TripListServiceProvider) {
    this.trip = this.navParams.get('trip');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTripPage');
  }

  updateTrip(trip: Trip) {
    this.tripListService.updateTrip(trip, this.uid).then(() => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  removeTrip(trip: Trip) {
    this.tripListService.removeTrip(trip, this.uid).then(() => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  showDeleteConfirm(trip: Trip) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'All the stories in this trip will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }},
        {
          text: 'Yes',
          handler: () => {
            this.removeTrip(trip);
          }}]});
    confirm.present();
  }

}
