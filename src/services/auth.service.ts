import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import AuthProvider = firebase.auth.GoogleAuthProvider;

@Injectable()
export class AuthService {
 
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	signOut(): Promise<void> {
        return this.afAuth.auth.signOut().then(function() {
            console.log("Sign-out successful");
          }).catch(function(error) {
            console.log("Sign-out failed");
          });
	}

	signInWithGoogle() {
		console.log('Sign in with google');
		return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
	}

	private oauthSignIn(provider: AuthProvider) {
		if (!(<any>window).cordova) {
            console.log('popup');
            return this.afAuth.auth.signInWithPopup(provider);
		} else {
            console.log('redirect');
			return this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				return this.afAuth.auth.getRedirectResult().then( result => {
					let token = result.credential.accessToken;
					let user = result.user;
				}).catch(function(error) {
					alert(error.message);
				});
			});
		}
	}

}