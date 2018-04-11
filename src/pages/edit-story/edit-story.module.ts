import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditStoryPage } from './edit-story';

@NgModule({
  declarations: [
    EditStoryPage,
  ],
  imports: [
    IonicPageModule.forChild(EditStoryPage),
  ],
})
export class EditStoryPageModule {}
