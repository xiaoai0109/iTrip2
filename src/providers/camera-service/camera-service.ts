import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the CameraProvideProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraServiceProvider {

  constructor(public http: HttpClient, public camera: Camera, 
    private db: AngularFireDatabase, private afStorage: AngularFireStorage) {
    console.log('Hello CameraProvideProvider Provider');
  }

  captureImage(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }
    return this.camera.getPicture(options);
  }

  uploadImage(image) {
    let storageRef: AngularFireStorageReference;

    let newName = `${new Date().getTime()}`;
    storageRef = this.afStorage.ref(`/image/${newName}`);
    return storageRef.putString(image, 'base64', { contentType:'jpg'});
  }

  storeImageInformation(metainfo, otherData) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType,
    }
      this.db.list('images').push(toSave);
  }

}//End of CameraProvideProvider
