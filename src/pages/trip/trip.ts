import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Trip } from '../../models/trip';
import { Story } from '../../models/story';
import { Media } from '../../models/media';
import { StoryPage } from '../../pages/story/story';
import { Observable } from 'rxjs/Observable';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';
import { MediaListServiceProvider } from '../../providers/media-list-service/media-list-service';
import { StayListServiceProvider } from '../../providers/stay-list-service/stay-list-service';

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

  storyCount: number = 0;
  photoCount: number = 0;
  mediaCount: { [index: string]: number } = {};
  stayCount: { [index: string]: number } = {};

  storyList: Observable<Story[]>;
  mediaListForStory: Observable<Media[]>;
  mediaListForTrip: { [index: string]: Observable<Media[]> } = {};

  isMask: boolean = false;
  displayedStoryId: string;
  slideIndex: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storyListService: StoryListServiceProvider,
    private stayListService: StayListServiceProvider, private mediaListService: MediaListServiceProvider) {
    this.trip = this.navParams.get('trip');

    this.storyList = this.storyListService.getStoryList(this.trip.key)
      .snapshotChanges()
      .map(
        changes => {
          return changes.map(c => {
            this.mediaListForStory = this.mediaListService.getMediaListForStory(c.payload.key).snapshotChanges()
              .map(
                changes => {
                  return changes.map(c => {
                    return {
                      key: c.payload.key, ...c.payload.val()
                    }
                  })
                }
              );

            this.mediaListForTrip[c.payload.key] = this.mediaListForStory;
            this.mediaListForStory.subscribe(result => {
              this.mediaCount[c.payload.key] = result.length;
              this.photoCount = 0;
              for (var key in this.mediaCount) {
                this.photoCount += this.mediaCount[key];
              }
            });

            this.stayListService.getStayList(c.payload.key).snapshotChanges()
              .subscribe(result => {
                this.stayCount[c.payload.key] = result.length;
              })

            return {
              key: c.payload.key, ...c.payload.val()
            }
          })
        });

  }

  navToStory(story: Story) {
    this.navCtrl.push("page-story", { isStart: false, story: story, tripId: this.trip.key });
  }

  startStory() {
    this.navCtrl.push("page-story", { isStart: true, tripId: this.trip.key });
  }

  editStory(story: Story) {
    this.navCtrl.push('page-edit-story', { story: story, tripId: this.trip.key });
  }

  showSlides(index, storyId) {
    this.displayedStoryId = storyId;
    this.isMask = true;
    this.slideIndex = index;
  }

  closeSlides() {
    this.isMask = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripPage');
  }

}
