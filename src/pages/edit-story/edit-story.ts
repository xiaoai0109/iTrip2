import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Story } from '../../models/story';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';
import { HomePage } from '../home/home';

@IonicPage({
  name : 'page-edit-story'
})
@Component({
  selector: 'page-edit-story',
  templateUrl: 'edit-story.html',
})
export class EditStoryPage {

  story: Story = {
    name: '',
    description: '',
    createdDate: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private storyListService: StoryListServiceProvider) {
    this.story = this.navParams.get('story');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditStoryPage');
  }

  updateStory(story: Story) {
    this.storyListService.updateStory(story).then(() => {
      this.navCtrl.pop();
    })
  }

  removeTrip(story: Story) {
    this.storyListService.removeStory(story).then(() => {
      this.navCtrl.pop();
    })
  }

}
