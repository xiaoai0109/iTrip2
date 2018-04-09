import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { Story } from '../../models/story';
import { Media } from '../../models/media';

/**
 * Generated class for the TripPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-trip'
})
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html',
})
export class TripPage {

  selectedSegment: string = "stories";

  userName: string = "Peiyan";

  trip: Trip = {
      name: 'Activities in Singapore',
      description: 'I am going here from April 5th',
      createdDate: 'Apr 05, 2018'
  }

  storyCount: number = 2;
  photoCount: number = 15;

  storyList: Story[] = [
    {
      name: 'USS 1 day',
      description: 'USS!',
      createdDate: 'Apr 09, 2018',
      pinCount: 2,
      photoCount: 15
    },
    {
      name: 'Marina Bay Sands',
      // description: 'It is very beautiful',
      createdDate: 'Apr 06, 2018',
      pinCount: 5,
      photoCount: 20
    }
  ]

  mediaList: Media[] = [
    {
      name: '',
      address: 'Universal Studio Singapore, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: ''
    },
    {
      name: 'Roller Roaster',
      address: 'Universal Studio Singapore, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: ''
    },
    {
      name: 'Haunted House',
      address: 'Haunted House, USS, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: ''
    }
  ]
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  navToStory() {
    this.navCtrl.push("page-story");
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TripPage');
  }

}
