import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TripPage } from './trip';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TripPage,
  ],
  imports: [
    IonicPageModule.forChild(TripPage),
    IonicImageLoader
  ],
})
export class TripPageModule {}
