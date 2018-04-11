import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditTripPage } from './edit-trip';

@NgModule({
  declarations: [
    EditTripPage,
  ],
  imports: [
    IonicPageModule.forChild(EditTripPage),
  ],
})
export class EditTripPageModule {}
