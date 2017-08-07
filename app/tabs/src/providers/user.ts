import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

@Injectable()
export class User {
  _user: any;

  ipAddress: any;
  toast:any;

  constructor(public http: Http, public toastCtrl: ToastController) {

    this.ipAddress = 'http://localhost'
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
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
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp;
  }
}
