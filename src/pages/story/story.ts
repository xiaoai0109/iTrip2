import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Slides } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';
import * as firebase from 'firebase';
import { Story } from '../../models/story';
import { Location } from '../../models/location';
import { Media } from "../../models/media";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { StoryListServiceProvider } from '../../providers/story-list-service/story-list-service';
import { PathListServiceProvider } from '../../providers/path-list-service/path-list-service';
import { StayListServiceProvider } from '../../providers/stay-list-service/stay-list-service';
import { Stay } from '../../models/stay';
import { MediaListServiceProvider } from '../../providers/media-list-service/media-list-service';
import { CameraServiceProvider } from '../../providers/camera-service/camera-service';
// import { sha256 } from 'sha256';

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
  image: Observable<any>;
  
  @ViewChild(Slides) slides: Slides;

  @ViewChild('map')
  mapElement: ElementRef;
  map;

  isMask: boolean = false;
  slideIndex;
  firstStay: boolean = true;

  isShow: boolean = false;
  counter_stay = 0;

  // static data below
  // photos: string[] = ["assets/imgs/photo-l.JPG"];
  static photos: string[] = [];
  // static photosForStay: Observable<Media[]>;
  photos: string[] = [];
  photosForStay: Observable<Media[]>;
  story_photos: string[][] = [[]];
  stayCount: number = 11;
  mediaCount: number = 15;
  // static data above

  tripId: string = '';

  story: Story = {
    name: '',
    description: '',
    createdDate: '',
    cover: ''
  };
  stay: Stay = {
    // location: { lat: 0, long: 0 },
    lat: 0,
    long: 0,
    address: '',
  };
  media: Media = {
    fileUrl: '',
    location: this.stay,
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

  pathList: Observable<Location[]>;
  stayList: Observable<Stay[]>;
  markers = [];
  newPath = [];
  // static sMediaListService;
  // path = [];
  ref = firebase.database().ref('geos/');

  // Inject Ionic Platform and required framework to the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private alertCtrl: AlertController, public datepipe: DatePipe,
    private storyListService: StoryListServiceProvider, public platform: Platform, 
    private geolocation: Geolocation, private device: Device, 
    private pathListService: PathListServiceProvider, private stayListService: StayListServiceProvider, 
    private mediaListService: MediaListServiceProvider,
    private imageService: CameraServiceProvider) {
    this.tripId = this.navParams.get('tripId');
    let isStart = this.navParams.get('isStart');
    // initialize the map 
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
    if (isStart) {
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
            return { key: c.payload.key, ...c.payload.val()
          }})
        }
      );
    // View the story, get all the points of the path from db and display

    this.firstStay = true;
    var IsInitMap = true;
    this.stayList.subscribe(stayList => stayList.forEach(element => {
      if (IsInitMap) {
        this.addMarkerandPath(element);
      }



    }));

    IsInitMap = false;
  }
  addMarkerandPath(element) {

    console.log('this.stay ', this.stay.key);

    var myLocation = new google.maps.LatLng(element.lat, element.long);
    var loc = { lat: element.lat, long: element.long };
    console.log('loc.lat', loc.lat);
    if (this.firstStay) {
      // this.map = new google.maps.Map(this.mapElement.nativeElement, {
      //   zoom: 15,
      //   center: myLocation
      // });
      var image = 'assets/imgs/marker-red.svg';
      this.addMarker(myLocation, image);
      console.log('add marker ?', myLocation);
      this.drawPath(myLocation);
      this.firstStay = false;

    } else {
      var image = 'assets/imgs/marker-green.svg';
      this.addMarker(myLocation, image);
      this.drawPath(myLocation);
      console.log('add marker ?', image);
    }
    this.currentLocation = loc;

  }
  genStoryCover(location) {
    // Toshi's api_key
    // var API_key = "AIzaSyDenrrtx-cvyF7Nl6Xb-dABsneP6f2mm3o";
    // Peiyan's api_key 
    var API_key = "AIzaSyBNqJryyNoAtZp0LwqFz6ABzS2bBMh6u10";
    this.story.cover = "https://maps.googleapis.com/maps/api/staticmap?center=" + location.lat + "," + location.long + "&zoom=12&size=400x100&scale=2&markers=color:red%7Clabel:S%7C" + this.currentLocation.lat + "," + this.currentLocation.long + "&key=" + API_key + "&path=color:0x0000ff|weight:5";
    // this.story.cover = "https://maps.googleapis.com/maps/api/staticmap?center=" + this.currentLocation.lat + "," + this.currentLocation.long + "&zoom=12&size=400x100&scale=2&markers=color:red%7Clabel:S%7C" + this.currentLocation.lat + "," + this.currentLocation.long + "&key=" + API_key + "&path=color:0x0000ff|weight:5";
    this.story.cover = this.story.cover + "|" + location.lat + "," + location.long;
    this.storyListService.updateStory(this.story, this.tripId);

  }
  addMarker(location, image) {

    var marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image,
      title: this.stay.key
    });
    // console.log('marker.location',marker.position.toString());
    // console.log('addMarker?', 'yes');
    this.markers.push(marker);
    var me = this;
    google.maps.event.addListener(marker, 'click', (function (story_key, stay_key) {
      {
        return function () {
          console.log("listener clicked for " + stay_key)
          me.photosForStay = me.mediaListService.getMediaList(story_key, stay_key).snapshotChanges()
            .map(
              changes => {
                return changes.map(c => {
                  return { key: c.payload.key, ...c.payload.val()
                }})
              }
            );
          me.change();
          
        }
      }
    })(this.story.key, this.stay.key));

    //     google.maps.event.addListener(marker, 'click', (function(story_key,stay_key) {
    //       {
    //         return function(){
    //         console.log("listener clicked for "+stay_key)  
    //         StoryPage.photosForStay = StoryPage.sMediaListService.getMediaList(story_key, stay_key).snapshotChanges()
    //         .map(
    //           changes => {
    //             return changes.map(c => ({
    //               key: c.payload.key, ...c.payload.val()
    //             }))
    //           }
    //         );
    //         me.change();
    //         } 
    //       }
    //  })(this.story.key,this.stay.key));

    console.log("listener added for " + this.story.key + " , " + this.stay.key);
    // this.story_photos[this.markers.length - 1] = [];
    // if (!this.story_photos[this.markers.length - 1])
    //   this.story_photos[this.markers.length - 1] = [];
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryPage');
  }

  takeNewPhoto() {
    // TODO: take photo, get local fileUrl
    var photoUrl = 'assets/imgs/photo-l.JPG';
    var image = 'assets/imgs/marker-blue.svg';
    this.geolocation.getCurrentPosition({
      maximumAge: 3000, timeout: 5000,
      enableHighAccuracy: true
    }).then((resp) => {
      var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.loc.lat = resp.coords.latitude;
      this.loc.long = resp.coords.longitude;
      if (this.getDistance(this.loc, this.currentLocation) > 20) {

        // this.addMarker(myLocation, image);
        // this.drawPath(myLocation);
        this.currentLocation = this.loc;
        this.addStay();

      }
      // add Media to DB
      this.media.fileUrl = photoUrl;
      this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
    });

  }


  // dropPoint() {

  //   this.geolocation.getCurrentPosition({
  //     maximumAge: 3000, timeout: 5000,
  //     enableHighAccuracy: true
  //   }).then((resp) => {

  //     this.loc.lat = resp.coords.latitude;
  //     this.loc.long = resp.coords.longitude;
  //     console.log('Location loc', this.loc.lat + " " + this.loc.long);

  //     //this.stay.key = this.loc.lat+""+this.loc.long;
  //     // this.stay.key = sha256(this.loc.lat + "" + this.loc.long);
  //     //this.stay.address = "Singapore";
  //     //if (marker == 0)//this location already exists
  //     // this.stayListService.addStay(this.stay, this.story.key);

  //     //this.media.fileUrl = "assets/imgs/photo-l.JPG";
  //     // this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
  //     //TODO : go through the list of media and set it to photos[]
  //     /*marker.addListener('click', function () {
  //       this.photos.push(this.media.fileUrl);
  //       this.change();
  //       for (var i = 0; i < this.photos.length; i++)
  //         console.log(this.photos[i]);
  //     });*/

  //     // console.log(sha256(this.loc.lat + "" + this.loc.long));

  //     //add a point in path only when moved by 50m and photo is taken
  //     var images = ['assets/imgs/marker-red.svg', 'assets/imgs/marker-green.svg', 'assets/imgs/marker-yellow.svg', 'assets/imgs/marker-purple.svg', 'assets/imgs/marker-blue.svg', 'assets/imgs/marker-orange.svg'];
  //     if (this.getDistance(this.loc, this.currentLocation) > 1) {
  //       // var image = 'assets/imgs/marker-example.2.svg';
  //       var image = images[Math.floor(Math.random() * Math.floor(6))];

  //       var loc = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //       console.log('maps.LatLng loc', loc);
  //       var marker = this.addMarker(loc, image);

  //       //     cannot use - addlistener
  //       //     var i = this.markers.length-1;

  //       //     google.maps.event.addListener(marker, 'click', (function(marker,i) {
  //       //       {

  //       //         for(var j =0;j<this.photos.length;j++)
  //       //         this.photos.pop();
  //       //         for(var j =0;j<this.story_photos[i].length;j++)
  //       //         this.photos.push(this.story_photos[i][j]);
  //       //         this.change();
  //       //         console.log(marker + "  i: " + i);    
  //       //       }
  //       //  })(marker, i));

  //       // change loc for what?
  //       this.loc.lat = resp.coords.latitude;
  //       this.loc.long = resp.coords.longitude;
  //       this.stay.location.lat = this.loc.lat;
  //       this.stay.location.long = this.loc.long;
  //       this.stay.address = "Singapore"
  //       this.stayListService.addStay(this.stay, this.story.key);
  //       this.media.fileUrl = "http://cdn1.vox-cdn.com/assets/4677547/Screen_Shot_2014-06-26_at_5.13.43_PM.png";
  //       // this.photos.push(this.media.fileUrl);
  //       this.story_photos[this.markers.length - 1].push(this.media.fileUrl);
  //       this.mediaListService.addMedia(this.media, this.story.key, this.stayListService.getKey());

  //       // update currentLocation
  //       this.currentLocation.lat = this.loc.lat;
  //       this.currentLocation.long = this.loc.long;

  //       //show this point in the path also
  //       this.path.push(loc);
  //       var mPath = new google.maps.Polyline({
  //         path: this.path,
  //         geodesic: true,
  //         strokeColor: '#0000FF',
  //         strokeOpacity: 0.7,
  //         strokeWeight: 5
  //       });
  //       mPath.setMap(this.map);
  //       //update DB to save this point on the path
  //       this.pathListService.addPath(this.loc);
  //       this.genStoryCover(this.loc);
  //     }
  //     else {
  //       //Point already exists(within 50m of last location) so just add the new media
  //       this.media.fileUrl = "assets/imgs/photo-l.JPG";
  //       // this.photos.push(this.media.fileUrl);
  //       this.story_photos[this.markers.length - 1].push(this.media.fileUrl);
  //       // use the last stay id
  //       this.mediaListService.addMedia(this.media, this.story.key, this.stayListService.getKey());
  //     }
  //   });
  // }
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

  endStory() {
    // this.dropPoint();
    // var image = 'assets/imgs/marker-blue.svg';
    // this.addMarker(this.path[this.path.length - 1], image);
  }

  // a PromptAlert to add story 
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Start your Story',
      subTitle: 'Give it an awesome name!',
      inputs: [{ name: 'name', placeholder: 'e.g. A sunny day' }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Start',
        handler: data => {
          if (data.name !== '') {
            // add story
            this.story.name = data.name;
            this.story.createdDate = this.datepipe.transform(new Date(), 'mediumDate');
            // console.log('story.name', this.story.name);
            this.storyListService.addStory(this.story, this.tripId);
            this.story.key = this.storyListService.getKey();
            console.log('start story.key', this.story.key);
            // this.addStay();

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

    // add stay (startPoint)

  }

  addStay() {

    //Add the first stay to DB 
    //Story must have been created at this point
    this.stay.lat = this.currentLocation.lat;
    this.stay.long = this.currentLocation.long;
    this.stay.address = "Singapore";
    console.log('addStay story.key', this.story.key);
    this.stayListService.addStay(this.stay, this.story.key);
    this.stay.key = this.stayListService.getKey();
    console.log('addStay stay.key', this.stay.key);
    this.addMarkerandPath(this.currentLocation);
    // generate cover for this story
    // this.genStoryCover(this.currentLocation); currentLocation = {lat: x, long: y}
    var newLocation: Location = { lat: this.stay.lat, long: this.stay.long };
    this.genStoryCover(newLocation);

  }

  change() {
    // StoryPage.isShow = !StoryPage.isShow;
    this.isShow = !this.isShow;
    // console.log("change() "+StoryPage.isShow);
    console.log("change() " + this.isShow);
  }

  showSlides(index) {
    this.isMask = true;
    this.slideIndex = index;
  }

  closeSlides() {
    this.isMask = false;
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
  }

  dropImage(){
    this.geolocation.getCurrentPosition({maximumAge: 3000, timeout: 5000, enableHighAccuracy: true}).then((resp) => {
      this.loc.lat = resp.coords.latitude;
      this.loc.long = resp.coords.longitude;

      this.imageService.captureImage().then(data => { /* Capture image and handle*/
        let upload = this.imageService.uploadImage(data); /* Upload img to Firebase */
        upload.then().then(res => { //update info to new point or current point
          if(this.getDistance(this.loc, this.currentLocation) > LOCATION_THRESHOLD ){ //New points
            var loc = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            var img = 'assets/imgs/marker-example.svg';
            var marker = this.addMarker(loc, img);
            this.stay.lat = this.loc.lat;
            this.stay.long = this.loc.long;
            this.stay.address = ''; //Todo: update later by gg api
            this.stayListService.addStay(this.stay, this.storyListService.getKey());
            
            //Display new point in the path
            // this.path.push(loc);
            // var mPath = new google.maps.Polyline({
            //   path: this.path,
            //   geodesic: true,
            //   strokeColor: '#0000FF',
            //   strokeOpacity: 0.7,
            //   strokeWeight: 5
            // });
            // mPath.setMap(this.map);
            // //update DB to save this point on the path
            // this.pathListService.addPath(this.loc);
            // this.addPoint(this.loc);
          }
          
          //Both case (new or current point) we have to save data into firebase
          this.media.fileUrl = res.metadata.fullPath;
          this.media.location = this.stay;
          this.media.createdDate = res.metadata.timeCreated;
          this.media.downloadUrl = res.metadata.downloadURLs[0];

          this.photos.push(this.media.fileUrl);
          this.mediaListService.addMedia(this.media, this.storyListService.getKey(), this.stayListService.getKey());
        }); /* Finish update info */
      });/* Finish Capture image and handle*/

      
    });
    
  } /* End of dropImage() */



} /* End of Class StoryPage */

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

