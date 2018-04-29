import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Slides } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
// import { Device } from '@ionic-native/device';
// import * as firebase from 'firebase';
import { Story } from '../../models/story';
import { Location } from '../../models/location';
import { Media } from "../../models/media";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';
import { StayListServiceProvider } from '../../providers/stay-list-service/stay-list-service';
import { Stay } from '../../models/stay';
import { MediaListServiceProvider } from '../../providers/media-list-service/media-list-service';
import { CameraServiceProvider } from '../../providers/camera-service/camera-service';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

declare var google;
const LOCATION_THRESHOLD = 10;

@IonicPage({
  name: 'page-story'
})
@Component({
  selector: 'page-story',
  templateUrl: 'story.html',
})
export class StoryPage {
  @ViewChild(Slides) slides: Slides;

  @ViewChild('map')
  mapElement: ElementRef;
  map;

  isStart: boolean;
  isMask: boolean = false;
  isShow: boolean = false;
  slideIndex: number;

  firstStay: boolean = true;
  IsInitMap = true;

  stayCount: number = 0;
  photoCount: number = 0;

  stayAddress: string = '';

  tripId: string = '';
  story: Story = {
    name: '',
    description: '',
    createdDate: '',
    cover: ''
  };
  stay: Stay = {
    lat: 0,
    long: 0,
    address: '',
  };
  media: Media = {
    fileUrl: '',
    location: '',
    createdDate: '',
    downloadUrl: '',
  }
  currentLocation: Location = {
    lat: 0,
    long: 0
  };
  loc: Location = {
    lat: 0,
    long: 0
  }

  stayList: Observable<Stay[]>;
  photosForStay: Observable<Media[]>;
  markers = [];
  newPath = [];
  image = 'assets/imgs/marker-red.svg';

  // Inject Ionic Platform and required framework to the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, public datepipe: DatePipe,
    private storyListService: StoryListServiceProvider, public platform: Platform,
    private geolocation: Geolocation,
    private stayListService: StayListServiceProvider, private mediaListService: MediaListServiceProvider,
    private imageService: CameraServiceProvider, private nativeGeocoder: NativeGeocoder) {

    this.tripId = this.navParams.get('tripId');
    this.isStart = this.navParams.get('isStart');

    // initialize the map 
    if (this.isStart) {
      this.geolocation.getCurrentPosition({
        maximumAge: 3000, timeout: 5000,
        enableHighAccuracy: true
      }).then((resp) => {
        var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: myLocation
        });
        this.currentLocation.lat = resp.coords.latitude;
        this.currentLocation.long = resp.coords.longitude;
      });
      this.presentPrompt();
    } else {
      this.story = this.navParams.get('story');
      this.platform.ready().then(() => {
        this.initMap();
      });
    }

  }

  initMap() {
    this.stayList = this.stayListService.getStayList(this.story.key).snapshotChanges()
      .map(
        changes => {
          console.log('getStayList', this.story.key);
          return changes.map(c => {
            // this.addMarkerandPath(c);
            console.log('get stayList', c.payload.key);
            return {
              key: c.payload.key, ...c.payload.val()
            }
          })
        }
      );

    this.mediaListService.getMediaListForStory(this.story.key).snapshotChanges()
      .subscribe(result => {
        this.photoCount = result.length;
      })

    // View the story, get all the points of the path from db and display
    this.firstStay = true;

    this.stayList.subscribe(stayList => stayList.forEach(element => {
      console.log("fetch stay element " + element.key + " " + element.lat);
      // console.log("isInitMap", this.IsInitMap);
      if (this.IsInitMap) {
        this.addMarkerandPath(element);
      }
    }));
  }

  // PromptAlert to add story 
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Start your Story',
      subTitle: 'Give it an awesome name!',
      inputs: [{ name: 'name', placeholder: 'e.g. A sunny day' }],
      enableBackdropDismiss: false,
      buttons: [{ text: 'Cancel', handler: () => { this.navCtrl.pop() } },
      {
        text: 'Start',
        handler: data => {
          if (data.name !== '') {
            // add story
            this.story.name = data.name;
            this.story.createdDate = this.datepipe.transform(new Date(), 'mediumDate');
            this.storyListService.addStory(this.story, this.tripId);
            this.story.key = this.storyListService.getKey();
            console.log('start story.key', this.story.key);
            this.addStay();

            this.platform.ready().then(() => {
              this.initMap();
            });
          } else {
            return false;
          }
        }
      }]
    });
    alert.present();
  }

  addStay() {
    this.IsInitMap = false;
    var stay: Stay = {
      lat: 0,
      long: 0,
      address: ''
    };
    this.stay.lat = this.currentLocation.lat;
    this.stay.long = this.currentLocation.long;
    stay.lat = this.stay.lat;
    stay.long = this.stay.long;
    console.log('addStay story.key', this.story.key);
    this.stayListService.addStay(stay, this.story.key);
    this.stay.key = this.stayListService.getKey();
    console.log('addStay stay.key', this.stay.key);
    this.addMarkerandPath(this.stay);
    // generate cover for this story
    var newLocation: Location = { lat: this.stay.lat, long: this.stay.long };
    this.genStoryCover(newLocation);

  }

  genStoryCover(location) {
    // var API_key = "AIzaSyDenrrtx-cvyF7Nl6Xb-dABsneP6f2mm3o";
    // var API_key = "AIzaSyBNqJryyNoAtZp0LwqFz6ABzS2bBMh6u10";
    var API_key = "AIzaSyD7q4sdr3Hi4mD7A1Kx4gm0GqrQaeQjK34";
    this.story.cover = "https://maps.googleapis.com/maps/api/staticmap?center=" + location.lat + "," + location.long + "&zoom=12&size=400x100&scale=2&markers=color:red%7Clabel:S%7C" + this.currentLocation.lat + "," + this.currentLocation.long + "&key=" + API_key + "&path=color:0x0000ff|weight:5";
    this.story.cover = this.story.cover + "|" + location.lat + "," + location.long;
    this.storyListService.updateStory(this.story, this.tripId);
  }

  addMarkerandPath(element) {
    this.stay = element;
    console.log('this.stay ', this.stay.key);

    var myLocation = new google.maps.LatLng(element.lat, element.long);
    var loc = { lat: element.lat, long: element.long };
    console.log('loc.lat', loc.lat);
    if (this.firstStay) {
      if (!this.isStart) {
        // var myLocation = new google.maps.LatLng(element.lat, element.long);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: myLocation
        });
      }
      this.addMarker(myLocation, this.image);
      this.drawPath(myLocation);
      this.firstStay = false;

    } else {
      this.addMarker(myLocation, this.image);
      this.drawPath(myLocation);
    }
    this.currentLocation = loc;

  }

  addMarker(location, image) {

    var marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image,
      title: this.stay.key
    });

    this.markers.push(marker);
    var me = this;
    google.maps.event.addListener(marker, 'click', (function (story_key, stay_key) {
      {
        console.log("listener added for " + story_key + " , " + stay_key);
        return function () {
          // me.stayAddress = stay.address;
          console.log("listener clicked for " + stay_key);
          me.photosForStay = me.mediaListService.getMediaList(story_key, stay_key).snapshotChanges()
            .map(
              changes => {
                return changes.map(c => {
                  return {
                    key: c.payload.key, ...c.payload.val()
                  }
                })
              }
            );
          me.change();

        }
      }
    })(this.story.key, this.stay.key));

    return marker;
  }

  drawPath(location) {
    this.newPath.push(location);
    console.log('length of newPath', this.newPath.length);
    if (this.newPath.length !== 1) {
      var mPath = new google.maps.Polyline({
        path: this.newPath,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeWeight: 5
      });
      mPath.setMap(this.map);
    }
  }

  dropImage() {
    // var photoUrl = 'assets/imgs/photo-l.JPG'; //initialized image
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
      .then((resp) => {
        this.loc.lat = resp.coords.latitude; //Save this location
        this.loc.long = resp.coords.longitude;
        if (this.getDistance(this.loc, this.currentLocation) > LOCATION_THRESHOLD) { //New points
          //var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          this.currentLocation = this.loc;
          this.addStay();
        }

        this.imageService.captureImage()
          .then(data => { /* Capture image and handle*/
            let upload = this.imageService.uploadImage(data); /* Upload img to Firebase */
            upload.then().then(res => { //update info to new point or current point
              this.media.fileUrl = res.metadata.fullPath;
              //this.media.location = this.stay;
              this.media.createdDate = res.metadata.timeCreated;
              this.media.downloadUrl = res.metadata.downloadURLs[0];

              // this.photos.push(this.media.fileUrl);
              this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
              console.log('storyId, stayId, mediaId', this.story.key + ' ' + this.stay.key + ' ' + this.media.key);
            }); /* Finish update info */
          })
          .catch(function (error) {

          });/* Finish Capture image and handle*/


      });

  } /* End of dropImage() */

  getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = this.rad(p2.lat - p1.lat);
    var dLong = this.rad(p2.long - p1.long);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  }

  rad(x) {
    return x * Math.PI / 180;
  }

  change() {
    if (this.isShow == false) {
      this.isShow = true;
    }
    console.log("change() " + this.isShow);
  }

  showSlides(index) {
    this.isMask = true;
    this.slideIndex = index;
  }

  closeSlides() {
    this.isMask = false;
  }

  endStory() {
    // this.dropPoint();
    // var image = 'assets/imgs/marker-blue.svg';
    // this.addMarker(this.path[this.path.length - 1], image);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryPage');
  }

  // dropImage_temp() {
  //   var photoUrl = 'assets/imgs/photo-l.JPG'; //initialized image
  //   // var image = 'assets/imgs/marker-blue.svg'; //Point logo

  //   this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
  //     .then((resp) => {
  //       this.loc.lat = resp.coords.latitude; //Save this location
  //       this.loc.long = resp.coords.longitude;
  //       if (this.getDistance(this.loc, this.currentLocation) > LOCATION_THRESHOLD) { //New points
  //         //var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //         this.currentLocation = this.loc;
  //         this.nativeGeocoder.reverseGeocode(this.loc.lat, this.loc.long)
  //           .then((result: NativeGeocoderReverseResult) => {
  //             this.stay.address = result.countryName;
  //             this.addStay();
  //             this.imageService.captureImage()
  //               .then(data => { /* Capture image and handle*/
  //                 let upload = this.imageService.uploadImage(data); /* Upload img to Firebase */
  //                 upload.then().then(res => { //update info to new point or current point

  //                   //Both case (new or current point) we have to save data into firebase
  //                   this.media.fileUrl = res.metadata.fullPath;
  //                   this.media.location = this.stay.address;
  //                   this.media.createdDate = res.metadata.timeCreated;
  //                   this.media.downloadUrl = res.metadata.downloadURLs[0];

  //                   this.photos.push(this.media.fileUrl);
  //                   this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
  //                   console.log('storyId, stayId, mediaId', this.story.key + ' ' + this.stay.key + ' ' + this.media.key);
  //                 }); /* Finish update info */
  //               });/* Finish Capture image and handle*/

  //           });
  //       }
  //       else {
  //         this.imageService.captureImage()
  //           .then(data => { /* Capture image and handle*/
  //             let upload = this.imageService.uploadImage(data); /* Upload img to Firebase */
  //             upload.then().then(res => { //update info to new point or current point

  //               //Both case (new or current point) we have to save data into firebase
  //               this.media.fileUrl = res.metadata.fullPath;
  //               this.media.location = this.stay.address;
  //               this.media.createdDate = res.metadata.timeCreated;
  //               this.media.downloadUrl = res.metadata.downloadURLs[0];

  //               this.photos.push(this.media.fileUrl);
  //               this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
  //             });
  //           });


  //       }


  //     });

  /* }  End of dropImage() */

  // deleteMarkers() {
  //   this.clearMarkers();
  //   this.markers = [];
  // }
  // clearMarkers() {
  //   this.setMapOnAll(null);
  // }

  // setMapOnAll(map) {
  //   for (var i = 0; i < this.markers.length; i++) {
  //     this.markers[i].setMap(map);
  //   }
  // }

} /* End of Class StoryPage */

