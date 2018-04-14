import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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
  tripId : string;

  story: Story = {
    name: '',
    description: '',
    createdDate: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    private storyListService: StoryListServiceProvider) {
    this.tripId = this.navParams.get('tripId');
    this.story = this.navParams.get('story');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditStoryPage');
  }

  updateStory(story: Story) {
    this.storyListService.updateStory(story, this.tripId).then(() => {
      this.navCtrl.pop();
    })
  }

  removeStory(story: Story) {
    this.storyListService.removeStory(story, this.tripId).then(() => {
      this.navCtrl.pop();
    })
  }

  showDeleteConfirm(story: Story) {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'All the memories in this story will be deleted permanently',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          }},
        {
          text: 'Yes',
          handler: () => {
            this.removeStory(story);
          }}]});
    confirm.present();
  }

}
