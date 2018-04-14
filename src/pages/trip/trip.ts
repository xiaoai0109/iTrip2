import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Slides } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { Story } from '../../models/story';
import { Media } from '../../models/media';
import { StoryPage } from '../../pages/story/story';
import { Observable } from 'rxjs/Observable';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';

@IonicPage({
  name: 'page-trip'
})
@Component({
  selector: 'page-trip',
  templateUrl: 'trip.html',
})
export class TripPage {
  @ViewChild(Slides) slides: Slides;
  
  selectedSegment: string = "stories";

  trip: Trip = {
      name: '', 
      description: '', 
      createdDate: ''
  }

  storyList : Observable<Story[]>;

  // static data below
  userName: string = "Peiyan";
  storyCount: number = 2;
  photoCount: number = 15;

  // storyList: Story[] = [
  //   {
  //     name: 'USS 1 day',
  //     description: 'USS!',
  //     createdDate: 'Apr 09, 2018',
  //   },
  //   {
  //     name: 'Marina Bay Sands',
  //     // description: 'It is very beautiful',
  //     createdDate: 'Apr 06, 2018',
  //   }
  // ]

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
      fileUrl: 'assets/imgs/photo-l.JPG'
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
    
  constructor(public navCtrl: NavController, public navParams: NavParams, private storyListService: StoryListServiceProvider) {
    this.trip = this.navParams.get('trip');
    this.storyList = this.storyListService.getStoryList(this.trip.key)
    .snapshotChanges()
    .map(
      changes => {
        return changes.map ( c=> ({
          key: c.payload.key, ...c.payload.val()
        }))
      }
    )
  }

  navToStory(story: Story) {
    this.navCtrl.push("page-story", { isStart : false, story : story, tripId : this.trip.key });
  }

  startStory() {
    this.navCtrl.push("page-story", { isStart : true, tripId : this.trip.key});
  }

  editStory(story: Story) {
    this.navCtrl.push('page-edit-story', { story : story, tripId : this.trip.key });
  }

  showSlides(index) {
    this.isMask = true;
    this.slideIndex = index;
  }

  closeSlides() {
    this.isMask = false;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripPage');
  }

  // presentPopover(myEvent) {
  //   let popover = this.popoverCtrl.create(PopoverComponent);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

}
