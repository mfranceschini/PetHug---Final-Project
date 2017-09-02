import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Api } from './api'

@Injectable()
export class UserPage {
  _user: any;

  ipAddress: any;
  toast:any;
  local: Storage;

  constructor(public http: Http, public toastCtrl: ToastController, private storage: Storage, public api: Api) {
    this.api.getIP().then((data)=>{
      this.ipAddress = data
    })
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    this.ipAddress = 'http://' + this.api.url
    var promise;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/get_user', accountInfo, {headers: headers})
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    this.ipAddress = 'http://' + this.api.url
    var promise, response;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/create_user', accountInfo, {headers: headers})
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
    return this.storage.clear()
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp;
    let val = JSON.stringify(this._user);
    this.storage.set("user", val);
  }

  getUser(){
    return this.storage.get("user")
    // .then((profile) => {
    // console.log("retornou usuario")
    // var val = JSON.parse(profile);
    // console.log(val);
    // return val;
    // })
  }

  verifyFacebookUser(facebook_id:any) {
    let json = {"facebook_id": facebook_id}
    this.ipAddress = 'http://' + this.api.url
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/verify_facebook', json, {headers: headers})
  }

  signupFacebook(accountInfo: any) {
    this.ipAddress = 'http://' + this.api.url
    var promise, response;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/create_facebook_user', accountInfo, {headers: headers})
  }

  verifyInstagramUser(instagram_id:any) {
    let json = {"instagram_id": instagram_id}
    this.ipAddress = 'http://' + this.api.url
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/verify_instagram', json, {headers: headers})
  }

  signupInstagram(accountInfo: any) {
    this.ipAddress = 'http://' + this.api.url
    var promise, response;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/create_instagram_user', accountInfo, {headers: headers})
  }
}
