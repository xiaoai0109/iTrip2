import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private imageLoaderConfig: ImageLoaderConfig) {
    platform.ready().then(() => {
      //Image loader Plug-in config (for cache image)
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      this.imageLoaderConfig.setFallbackUrl('assets/imgs/loading.gif');
      this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkPreviousAuthorization();
    });
  }
  checkPreviousAuthorization(): void {
    if ((window.localStorage.getItem('uid') === "undefined" || window.localStorage.getItem('uid') === null) &&
      (window.localStorage.getItem('name') === "undefined" || window.localStorage.getItem('name') === null) &&
      (window.localStorage.getItem('avater') === "undefined" || window.localStorage.getItem('avater') === null)) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = HomePage;
    }
  }

}


