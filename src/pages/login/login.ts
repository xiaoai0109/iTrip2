import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private facebook: Facebook,
    private auth: AuthService, private userService: UserServiceProvider) {
  }

  // loginWithGoogle() {
  //   this.auth.signInWithGoogle()
  //     .then(
  //       () => this.navCtrl.setRoot(HomePage),
  //       error => console.log(error.message)
  //     );
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  navigate() {
    this.navCtrl.setRoot(HomePage);
  }

  loginWithFB() {
    this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(pic)', []).then(profile => {
        
        this.user.uid = profile['id'];
        this.user.name = profile['first_name'];
        this.user.avater = profile['pic']['data']['url'];
        this.userService.updateUser(this.user);

        if (this.user) {
          this.navCtrl.setRoot(HomePage, { user : this.user });
        }
      });
    });
    
  }

}
