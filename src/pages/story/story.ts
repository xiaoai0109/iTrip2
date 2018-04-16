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
// import { sha256 } from 'sha256';

declare var google;

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

  isMask: boolean = false;
  slideIndex;

  isShow: boolean = false;

  // static data below
  photos: string[] = ["assets/imgs/photo-l.JPG"];
  stayCount: number = 11;
  mediaCount: number = 15;
  // static data above

  tripId: string = '';

  story: Story = {
    name: '',
    description: '',
    createdDate: '',
    icon: ''
  };
  stay: Stay = {
    location: { lat: 0, long: 0 },
    address: '',
    key: ''
  };
  media: Media = {
    fileUrl: '',
    location: '',
    createdDate: '',
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
  path = [];
  ref = firebase.database().ref('geos/');

  // Inject Ionic Platform and required framework to the constructor
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public datepipe: DatePipe,
    private storyListService: StoryListServiceProvider, public platform: Platform, private geolocation: Geolocation, private device: Device, private pathListService: PathListServiceProvider, private stayListService: StayListServiceProvider, private mediaListService: MediaListServiceProvider) {
    this.tripId = this.navParams.get('tripId');
    // get story.name according to flag 'isStart' 
    let isStart = this.navParams.get('isStart');
    if (isStart) {
      this.presentPrompt();
    } else {
      this.story = this.navParams.get('story');
      this.pathListService.setKey(this.story.key);
      console.log(this.story.key);
      console.log(this.pathListService.getPathList());
      this.pathList = this.pathListService.getPathList().snapshotChanges()
        .map(
          changes => {
            return changes.map(c => ({
              key: c.payload.key, ...c.payload.val()
            }))
          }
        )
        this.stayList = this.stayListService.getStayList().snapshotChanges()
        .map(
          changes => {
            return changes.map(c => ({
              key: c.payload.key, ...c.payload.val()
            }))
          }
        )
      this.platform.ready().then(() => {
        this.initMap(false);
      });
    }


  }

  initMap(isStart) {
    var image = 'assets/imgs/marker-example.svg';
    if (isStart) {
      
      this.geolocation.getCurrentPosition({
        maximumAge: 3000, timeout: 5000,
        enableHighAccuracy: true
      }).then((resp) => {
        var myLocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
          zoom: 15,
          center: myLocation
        });
        //Add start point here
        this.addMarker(myLocation, image);
        this.currentLocation.lat = resp.coords.latitude;
        this.currentLocation.long = resp.coords.longitude;
        this.pathListService.addPath(this.currentLocation);
        this.path.push(myLocation);
        //Add the first stay point here just in DB 
        //Story must have been created at this point , get the key for story
        this.stay.location.lat = this.loc.lat;
        this.stay.location.long = this.loc.long;
        this.stay.address = "Singapore"
        this.stayListService.addStay(this.stay, this.storyListService.getKey());
        //create icon for list of stories
        var API_key = "AIzaSyDenrrtx-cvyF7Nl6Xb-dABsneP6f2mm3o";
        this.story.icon = "https://maps.googleapis.com/maps/api/staticmap?center=" + this.currentLocation.lat + "," + this.currentLocation.long + "&zoom=12&size=400x100&scale=2&markers=color:red%7Clabel:S%7C" + this.currentLocation.lat + "," + this.currentLocation.long + "&key=" + API_key + "&path=color:0x0000ff|weight:5";
        this.addPoint(this.currentLocation);
      });
    }
    else {
      //View the story, get all the points of the path from db and display
      let start = true;
      this.pathList.subscribe(pathList => pathList.forEach(element => {
        console.log("Retrieve location points " + element);
        if (start) {
          var myLocation = new google.maps.LatLng(element.lat, element.long);
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 15,
            center: myLocation
          });
          this.addMarker(myLocation, image);
          start = false;
        }



        this.path.push(new google.maps.LatLng(element.lat, element.long));
        var mPath = new google.maps.Polyline({
          path: this.path,
          geodesic: true,
          strokeColor: '#0000FF',
          strokeOpacity: 0.7,
          strokeWeight: 5
        });
        mPath.setMap(this.map);

      }));
      //Add the marker for end point of the story
      var endlocation = new google.maps.LatLng(this.path[this.path.length - 1].lat, this.path[this.path.length - 1].long);
      this.addMarker(endlocation, image);

      this.pathList
    }




    /*var watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      this.updateGeolocation(this.device.uuid, data.coords.latitude, data.coords.longitude);
      var updateLocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
      // var image = 'assets/imgs/marker.JPG';
      this.addMarker(updateLocation, image);
      this.setMapOnAll(this.map);
    });*/
  }

  addPoint(location) {
    this.story.icon = this.story.icon + "|" + location.lat + "," + location.long;
    this.storyListService.updateStory(this.story, this.tripId);

  }
  addMarker(location, image) {


    var mar = this.SearchMarker(location);
    if (mar == 0) {
      var marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: image,
      });
      this.markers.push(marker);
      return marker;
    }
    return mar;
  }

  SearchMarker(location) {
    for (var i = 0; i < this.markers.length; i++) {
      if (this.markers[i].lat == location.lat && this.markers[i].long == location.long)
        return this.markers[i];
    }
    return 0;
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
  dropPoint() {
    
    this.geolocation.getCurrentPosition({
      maximumAge: 3000, timeout: 5000,
      enableHighAccuracy: true
    }).then((resp) => {
     
      this.loc.lat = resp.coords.latitude;
      this.loc.long = resp.coords.longitude;
      
      //this.stay.key = this.loc.lat+""+this.loc.long;
     // this.stay.key = sha256(this.loc.lat + "" + this.loc.long);
      //this.stay.address = "Singapore";
      //if (marker == 0)//this location already exists
       // this.stayListService.addStay(this.stay, this.story.key);

      //this.media.fileUrl = "assets/imgs/photo-l.JPG";
     // this.mediaListService.addMedia(this.media, this.story.key, this.stay.key);
      //TODO : go through the list of media and set it to photos[]
      /*marker.addListener('click', function () {
        this.photos.push(this.media.fileUrl);
        this.change();
        for (var i = 0; i < this.photos.length; i++)
          console.log(this.photos[i]);
      });*/

     // console.log(sha256(this.loc.lat + "" + this.loc.long));

      //add a point in path only when moved by 50m and photo is taken
      
      if (this.getDistance(this.loc, this.currentLocation) > 10) {
        var image = 'assets/imgs/marker-example.svg';
      var loc = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      var marker = this.addMarker(loc, image);
      this.loc.lat = resp.coords.latitude;
      this.loc.long = resp.coords.longitude;
      this.stay.location.lat = this.loc.lat;
      this.stay.location.long = this.loc.long;
      this.stay.address = "Singapore"
      this.stayListService.addStay(this.stay, this.storyListService.getKey());
      this.media.fileUrl = "http://cdn1.vox-cdn.com/assets/4677547/Screen_Shot_2014-06-26_at_5.13.43_PM.png";
      this.photos.push(this.media.fileUrl);
      this.mediaListService.addMedia(this.media, this.storyListService.getKey(), this.stayListService.getKey());


        this.currentLocation.lat = this.loc.lat;
        this.currentLocation.long = this.loc.long;

        //show this point in the path also
        this.path.push(loc);
        var mPath = new google.maps.Polyline({
          path: this.path,
          geodesic: true,
          strokeColor: '#0000FF',
          strokeOpacity: 0.7,
          strokeWeight: 5
        });
        mPath.setMap(this.map);
        //update DB to save this point on the path
        this.pathListService.addPath(this.loc);
        this.addPoint(this.loc);
      }
      else{
     //Point already exists(within 50m of last location) so just add the new media
      this.media.fileUrl = "assets/imgs/photo-l.JPG";
      this.photos.push(this.media.fileUrl);
      this.mediaListService.addMedia(this.media, this.storyListService.getKey(), this.stayListService.getKey());
      }


    });

  }
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
    this.dropPoint();
    var image = 'assets/imgs/marker-example.svg';
    this.addMarker(this.path[this.path.length - 1], image);
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
      inputs: [{ name: 'name', placeholder: 'e.g. A sunny day' }],
      buttons: [{ text: 'Cancel', role: 'cancel' },
      {
        text: 'Start',
        handler: data => {
          if (data.name !== '') {
            this.story.name = data.name;
            this.story.createdDate = this.datepipe.transform(new Date(), 'mediumDate');
            // add story

            this.storyListService.addStory(this.story, this.tripId);
            this.pathListService.setKey(this.storyListService.getKey());
            this.story.key = this.storyListService.getKey();

            this.platform.ready().then(() => {
              this.initMap(true);
            });




          } else {
            return false;
          }
        }
      }]
    });
    alert.present();

    // alert.present().then(() => {
    //   const firstInput: any = document.querySelector('ion-alert input');
    //   console.log("firstinput", firstInput);
    //   firstInput.focus();
    //   return;
    // });
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

