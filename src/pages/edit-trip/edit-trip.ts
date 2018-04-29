import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { TripListServiceProvider } from '../../providers/trip-list-service/trip-list-service';
import { HomePage } from '../home/home';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import { Story } from '../../models/story';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';

@IonicPage({
  name: 'page-edit-trip'
})
@Component({
  selector: 'page-edit-trip',
  templateUrl: 'edit-trip.html',
})
export class EditTripPage {

  user: User;
  trip: Trip = {
    name: '',
    description: '',
    createdDate: ''
  };
  storyList: Observable<Story[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private tripListService: TripListServiceProvider, private storyListService: StoryListServiceProvider) {
    this.user = this.navParams.get('user');
    this.trip = this.navParams.get('trip');

    this.storyList = this.storyListService.getStoryList(this.trip.key).snapshotChanges()
    .map(
      changes => {
        return changes.map(c => {
          return {
            key: c.payload.key, ...c.payload.val()
          }
        })
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTripPage');
  }

  updateTrip(trip: Trip) {
    this.tripListService.updateTrip(trip, this.user.uid).then(() => {
      this.navCtrl.setRoot(HomePage, { user: this.user });
    })
  }

  removeTrip(trip: Trip) {
    this.storyList.forEach(stories => {
      stories.forEach(story => {
        console.log('remove story', story.key);
        this.storyListService.removeMediaOfStory(story.key, trip.key);
      })
    });
    
    this.tripListService.removeTrip(trip, this.user.uid).then(() => {
      this.navCtrl.setRoot(HomePage, { user: this.user });
    });
  }

  showDeleteConfirm(trip: Trip) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'All the stories in this trip will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.removeTrip(trip);
          }
        }]
    });
    confirm.present();
  }

}
