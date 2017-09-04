import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Api } from '../../providers/api';
import { UserPage } from '../../providers/user';
import { Facebook } from '@ionic-native/facebook';
import { MainPage } from '../../pages/pages';
import { Auth, User } from '@ionic/cloud-angular';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
  providers: []
})

export class WelcomePage {
  ipAddr: string;
  toast: any;
  userId: any;
  params:any;

  constructor(public auth: Auth, public user: User, public navCtrl: NavController, public toastCtrl: ToastController, public api: Api, public fb: Facebook, public userCtrl: UserPage) {
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
    let result;
    let authId;
    var user_id = {}
    this.fb.login(params).then((response)=> {
      console.log("dentro fb.login")
      authId = response.authResponse.userID;
      if (response.status == "connected") {
        console.log("status connected")
        this.fb.api( authId + "/?fields=id,email,first_name,last_name",
        ['public_profile', 'email']).then((success)=>{
          result = success;
          this.userCtrl.verifyFacebookUser(success.id)
          .map(res => res.json())
          .subscribe((data) => {
            if (data.success == 'existe'){
              this.userCtrl._loggedIn(data.id);
              var nome = data.nome.split(" ",1)
              this.toast = this.toastCtrl.create({
                message: 'Bem-vindo, ' + nome,
                duration: 3000,
                position: 'top'
              });
              this.toast.present();
              this.navCtrl.push(MainPage);
            }
            else if (data.success == 'nao_existe'){
              console.log("Usuario FB nao tem cadastro!!")
              user_id = {'id':authId}
              this.navCtrl.push(SignupPage,result, user_id)
              this.toast = this.toastCtrl.create({
                message: 'Por Favor, preencha os campos abaixo',
                duration: 5000,
                position: 'top'
              });
              this.toast.present();
            }
          }, (err) => {
            console.log("Erro Verificar Facebook")
            console.log(JSON.stringify(err))
          });
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

  instagramLogin() {
    let result;
    console.log("Dentro Login Instagram")
    this.auth.login('instagram').then(
    (data)=>{
      this.userCtrl.verifyInstagramUser(this.user.social.instagram.uid)
      .map(res => res.json())
      .subscribe((data) => {
        if (data.success == 'existe'){
          this.userCtrl._loggedIn(data.id);
          var nome = data.nome.split(" ",1)
          this.toast = this.toastCtrl.create({
            message: 'Bem-vindo, ' + nome,
            duration: 3000,
            position: 'top'
          });
          this.toast.present();
          this.navCtrl.push(MainPage);
        }
        else if (data.success == 'nao_existe'){
          console.log("Usuario INSTA nao tem cadastro!!")
          let name = this.user.social.instagram.data.full_name
          let email = this.user.social.instagram.data.email
          result = {
            'id': this.user.social.instagram.uid,
            'instagram': true,
            'name':name,
            'email': email}
          this.navCtrl.push(SignupPage, result)
          this.toast = this.toastCtrl.create({
            message: 'Por Favor, preencha os campos abaixo',
            duration: 5000,
            position: 'top'
          });
          this.toast.present();
        }
      }, (err) => {
        console.log("Erro Verificar Instagram")
        console.log(JSON.stringify(err))
      });
    },
    (err)=>{
      console.log("Erro ao obter dados do usuário!")
      console.log(err)
    });
  }
}
