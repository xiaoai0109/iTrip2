import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../../pages/login/login';
import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
  private auth: AuthService, private facebook: Facebook) {
    console.log('Hello PopoverComponent Component');
  }

  signOut() {
    this.facebook.logout()
    .then(
      () => {
        window.localStorage.removeItem('uid');
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('avater');
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();  
      }
    );
    this.viewCtrl.dismiss();
  }

}
