import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Api } from './api'

@Injectable()
export class User {
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
    console.log("Dentro Funcao de verificar!!")
    console.log("Facebook ID: " + facebook_id.toString())
    this.ipAddress = 'http://' + this.api.url
    console.log(this.ipAddress)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/verify_facebook', '1234', {headers: headers})
  }
}
