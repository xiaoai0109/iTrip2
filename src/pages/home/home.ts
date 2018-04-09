import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripPage } from '../../pages/trip/trip';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName: string = "Peiyan";

  tripList: Trip[] = [
    {
      name: 'Activities in Singapore',
      description: 'I am going here from April 5th',
      createdDate: 'Apr 05, 2018'
    },
    {
      name: 'Happiness in normal days',
      description: 'Where I have been in Singapore~',
      createdDate: 'Mar 15, 2018'
    }
  ]
  constructor(public navCtrl: NavController) {
  }

  navToTrip() {
    this.navCtrl.push("page-trip");
  }

}
