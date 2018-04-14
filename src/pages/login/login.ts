import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@IonicPage({
  name: 'page-login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = {
    name: '',
    avater: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private auth: AuthService, private userService: UserServiceProvider) {
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  navigate() {
    this.navCtrl.setRoot(HomePage);
  }

}
