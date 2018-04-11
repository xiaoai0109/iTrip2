import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';


/**
 * Generated class for the StoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  // static photos
  photos: string[] = ["assets/imgs/logo.png", 
  "assets/imgs/logo.png", "assets/imgs/logo.png", "assets/imgs/logo.png"];

  // declare an array variable for holds markers
  markers = [];

  // reference to firebase database to store updated geolocation information
  ref = firebase.database().ref('geos/');

  // Inject Ionic Platform and required framework to the constructor
  constructor(public navCtrl: NavController, public platform: Platform,
    private geolocation: Geolocation, private device: Device, public popoverCtrl: PopoverController) {

    platform.ready().then(() => {
      this.initMap();
    });

  }

  // Create this function to init or load the Google Maps
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
      // var image = 'assets/imgs/marker.png';
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

  // function for update/add Geolocation data on Firebase database
  updateGeolocation(uuid, lat, lng) {
    if (localStorage.getItem('myKey')) {
      firebase.database().ref('geos/' + localStorage.getItem('myKey')).set({
        uuid: uuid,
        latitude: lat,
        longitude: lng,
      });
    } else {
      var newData = this.ref.push();
      newData.set({
        uuid: uuid,
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

}

// Get the list of other device position
// 1. Create this function below the closing of the Class to convert Firebase object to an array
export const snapshotToArray = snapshot => {
  var returnArr = [];
  snapshot.forEach(childSnapshot => {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
}

