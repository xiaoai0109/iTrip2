import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { DatePipe } from '@angular/common';
import { TripListServiceProvider } from '../providers/trip-list-service/trip-list-service';
import { HttpClientModule } from '@angular/common/http';
import { StoryListServiceProvider } from '../providers/story-list-service/story-list-service';
import { AuthService } from '../services/auth.service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { PopoverComponent } from '../components/popover/popover';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatePipe,
    TripListServiceProvider,
    StoryListServiceProvider,
    AngularFireAuth,
		AuthService,
    UserServiceProvider
  ]
})
export class AppModule {}
