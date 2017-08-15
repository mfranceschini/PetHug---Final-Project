import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Api } from '../../providers/api';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  ipAddr: string;

  constructor(public navCtrl: NavController, private fb: Facebook, public toastCtrl: ToastController, public api: Api) {
    this.getIPAddr()
  }

  setIPAddr(){
    this.api.setIP(this.ipAddr)
  }

  getIPAddr(){
    console.log("Pegando IP")
    this.api.getIP().then((data)=>{
      if (data != null){
        console.log("Existe IP")
      }
    })
  }
  
  login() {
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  facebookLogin() {
    console.log("entrou")
    let permissions = new Array();
    //the permissions your facebook app needs from the user
    permissions = ["public_profile", "email"];
    this.fb.login(permissions).then(function(response) {
        let userId = response.authResponse.userID;
        let params = new Array();
        //Getting name and gender properties
        this.fb.api("/" + userId + "/me?fields=name,gender", params).then(function(user) {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //now we have the users info, let's save it in the NativeStorage
            let toast = this.toastCtrl.create({
              message: user,
              duration: 3000,
              position: 'top'
            });
            toast.present();
        })
    }, function(error) {
      console.log(error)
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
    });
  }
}
