import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';
import { Story } from '../../models/story';
import { DatePipe } from '@angular/common';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';

declare var google;

@IonicPage({
  name: 'page-story'
})
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {

  @ViewChild('map')
  mapElement: ElementRef;
  map;

  isShow: boolean = false;

  // static data below
  photos: string[] = ["assets/imgs/photo-l.JPG",
    "assets/imgs/logo.png", "assets/imgs/photo-l.JPG", "assets/imgs/photo-p.JPG", "assets/imgs/logo.png",
    "assets/imgs/logo.png", "assets/imgs/photo-l.JPG", "assets/imgs/photo-p.JPG", "assets/imgs/logo.png"];
  stayCount: number = 11;
  mediaCount: number = 15;
  // static data above

  tripId: string = '';

  story: Story = {
    name: '',
    description: '',
    createdDate: ''
  };

  markers = [];
  ref = firebase.database().ref('geos/');

  // Inject Ionic Platform and required framework to the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public datepipe: DatePipe,
    private storyListService: StoryListServiceProvider, public platform: Platform, private geolocation: Geolocation, private device: Device) {
    this.tripId = this.navParams.get('tripId');
    // get story.name according to flag 'isStart' 
    let isStart = this.navParams.get('isStart');
    if (isStart) {
      this.presentPrompt();
    } else {
      // this.story = this.navParams.get('story');
      this.story.name = 'Test';
    }

    platform.ready().then(() => {
      this.initMap();
    });

  }

  initMap() {
    var image = 'assets/imgs/marker-example.svg';

    this.geolocation.getCurrentPosition({
      maximumAge: 3000, timeout: 5000,
      enableHighAccuracy: true
    }).then((resp) => {
      var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: myLocation
      });
    });

    var watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      this.updateGeolocation(this.device.uuid, data.coords.latitude, data.coords.longitude);
      var updateLocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      // var image = 'assets/imgs/marker.JPG';
      this.addMarker(updateLocation, image);
      this.setMapOnAll(this.map);
    });
  }

  addMarker(location, image) {
    var marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image,
    });
    this.markers.push(marker);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  updateGeolocation(uuid, lat, lng) {
    if (localStorage.getItem('myKey')) {
      firebase.database().ref('geos/' + localStorage.getItem('myKey')).set({
        latitude: lat,
        longitude: lng,
      });
    } else {
      var newData = this.ref.push();
      newData.set({
        latitude: lat,
        longitude: lng,
      });
      localStorage.setItem('myKey', newData.key);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryPage');
  }

  change() {
    if (this.isShow == true) {
      this.isShow = false;
    } else if (this.isShow == false) {
      this.isShow = true;
    }
  }
  // presentPopover(myEvent) {
  //   let popover = this.popoverCtrl.create(PopoverComponent);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  // a PromptAlert to add story 
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Start your Story',
      subTitle: 'Give it an awesome name!',
      inputs: [{ name: 'name', placeholder: 'e.g. A sunny day'}],
      buttons: [{ text: 'Cancel', role: 'cancel'},
        { text: 'Start',
          handler: data => {
            if (data.name !== '') {
              this.story.name = data.name;
              this.story.createdDate = this.datepipe.transform(new Date(), 'mediumDate');
              // add story
              this.storyListService.addStory(this.story, this.tripId);
              console.log('story.name')
            } else {
              return false;
            }}}]
          });

    alert.present();
    
    // alert.present().then(() => {
    //   const firstInput: any = document.querySelector('ion-alert input');
    //   console.log("firstinput", firstInput);
    //   firstInput.focus();
    //   return;
    // });
  }
}

// Get the list of other position
export const snapshotToArray = snapshot => {
  var returnArr = [];
  snapshot.forEach(childSnapshot => {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
}

