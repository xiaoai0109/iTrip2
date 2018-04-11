import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  text: string;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController) {
    console.log('Hello PopoverComponent Component');
    this.text = 'Hello World';
  }
  signOut() {
    // sign out
    // this.navCtrl.setRoot(HomePage);
    this.viewCtrl.dismiss()
  }

}
