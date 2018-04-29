import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
    private facebook: Facebook) {

  }

  logOut() {
    this.facebook.logout()
      .then(
        () => {
          window.localStorage.removeItem('uid');
          window.localStorage.removeItem('name');
          window.localStorage.removeItem('avatar');
          this.navCtrl.setRoot(LoginPage);
          this.navCtrl.popToRoot();
        }
      );
    this.viewCtrl.dismiss();
  }

}
