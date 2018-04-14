import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class PopoverComponent {
  googleUser = firebase.auth().currentUser;
  userName = this.googleUser.displayName;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
  private auth: AuthService) {
    console.log("gUser", this.googleUser);
    console.log("userName", this.userName);
    console.log('Hello PopoverComponent Component');
  }

  signOut() {
    this.viewCtrl.dismiss();
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

}
