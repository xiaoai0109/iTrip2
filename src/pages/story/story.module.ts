import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryPage } from './story';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    StoryPage,
  ],
  imports: [
    IonicPageModule.forChild(StoryPage),
    IonicImageLoader
  ],
})
export class StoryPageModule {}
