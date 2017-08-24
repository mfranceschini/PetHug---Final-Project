import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Api } from '../../providers/api';
import { User } from '../../providers/user';
import { Facebook } from '@ionic-native/facebook';

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
  toast: any;
  userId: any;
  params:any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public api: Api, public fb: Facebook, public user: User) {
    this.getIPAddr()
  }

  setIPAddr(){
    this.api.setIP(this.ipAddr)
  }

  getIPAddr(){
    console.log("Pegando IP")
    this.api.getIP().then((data)=>{
      if (data != null){
        console.log("Existe IP: "+data)
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
    console.log("funcao facebook")
    let params = ["public_profile", "email"];
    this.fb.login(params).then((response)=> {
      console.log("Login Response:" + JSON.stringify(response));
      let authId = response.authResponse.userID;
      if (response.status == "connected") {
        this.fb.api( authId + "/?fields=id,email,first_name,last_name",
        ['public_profile', 'email']).then((success)=>{
          console.log("dentro API")
          console.log(JSON.stringify(success))
          this.user.verifyFacebookUser(success.id)
          .map(res => res.json())
          .subscribe((data) => {
            console.log("Retorno de Verificar Facebook!!")
            console.log(data)
          }, (err) => {
            console.log("Erro Verificar Facebook")
            console.log(JSON.stringify(err))
          });
          // this.fb.getLoginStatus().then((status)=>{
          //   console.log("Pegando login status")
          //   console.log(status.authResponse.userID)
          //   console.log(status.status)
          // },
          // (error)=>{
          //   console.log("Erro no login status!")
          //   console.log(error)
          // })
        },
        (error)=>{
          console.log("Erro ao obter dados do usuário!")
          console.log(error)
        })
      }
      },
      function(response) {
        console.log("Other Response: " + JSON.stringify(response))
      });
  }
}
