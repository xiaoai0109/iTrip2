import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddStoryPage } from './add-story';

@NgModule({
  declarations: [
    AddStoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddStoryPage),
  ],
})
export class AddStoryPageModule {}
