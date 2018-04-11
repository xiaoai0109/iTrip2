import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Slides } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { Story } from '../../models/story';
import { Media } from '../../models/media';
import { StoryPage } from '../../pages/story/story';
import { PopoverComponent } from '../../components/popover/popover';

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
  @ViewChild(Slides) slides: Slides;
  
  // static data below
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
      location: 'Universal Studio Singapore, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: 'assets/imgs/photo-l.JPG'
    },
    {
      name: 'Roller Roaster',
      location: 'Universal Studio Singapore, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: 'assets/imgs/photo-p.JPG'
    },
    {
      name: 'Haunted House',
      location: 'Haunted House, USS, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: 'assets/imgs/photo-p.JPG'
    },
    {
      name: 'Haunted House',
      location: 'Haunted House, USS, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: 'assets/imgs/photo-p.JPG'
    },
    {
      name: 'Haunted House',
      location: 'Haunted House, USS, Sentosa',
      createdDate:'Apr 09, 2018',
      fileUrl: 'assets/imgs/photo-l.JPG'
    }
  ]
  // static data above

  isMask: boolean = false;
  slideIndex;
    
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  navToStory() {
    this.navCtrl.push("page-story");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripPage');
  }

  showSlides(index) {
    this.isMask = true;
    this.slideIndex = index;
    // console.log('index of photos', index);
  }

  closeSlides() {
    this.isMask = false;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', currentIndex);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverComponent);
    popover.present({
      ev: myEvent
    });
  }

}
