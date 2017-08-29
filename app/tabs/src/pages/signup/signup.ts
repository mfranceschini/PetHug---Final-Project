import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, Events, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { Api } from '../../providers/api';
import { WelcomePage } from '../welcome/welcome';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: '',
    email: '',
    password: ''
  };

  // Our translated text strings
  private signupErrorString: string;
  ipAddress: any;
  loading: any;
  resp: any;
  toast: any;
  showPassword: boolean;
  facebook_user_id: any;

  constructor(public navParams: NavParams, public api: Api, public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public user: User, public toastCtrl: ToastController, public translateService: TranslateService,private events: Events) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Cadastrando Usuário...'
    });

    this.showPassword = true;
  }

  ionViewDidLoad(){
    this.showPassword = false
    if (this.navParams.get('first_name') && this.navParams.get('last_name')){
      this.account.name = this.navParams.get('first_name') + ' ' + this.navParams.get('last_name')
    }
    if (this.navParams.get('email')){
      this.account.email = this.navParams.get('email')
    }
    if (this.navParams.get('id')){
      this.facebook_user_id = this.navParams.get('id')
    }
  }

  doSignup() {
    this.resp = 0
    this.loading.present()
    if (this.account.name == null || this.account.email == null || this.account.password == null) {
      let toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.loading.dismiss()
    }
    else {
      let body = {
        nome: this.account.name,
        email: this.account.email,
        senha: this.account.password
      }

      var create = this.user.signup(body)
      create.map(res => res.json())
      .subscribe((data) => {
        this.loading.dismiss()
        this.toast = this.toastCtrl.create({
          message: 'Usuário criado com sucesso! Entre com seu email e senha.',
          duration: 3000,
          position: 'top'
        });
        this.toast.present();
        this.navCtrl.push(WelcomePage);
      }, (err) => {
        this.toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: 'top'
          });
          this.loading.dismiss()
          this.toast.present();
      });
    }
  }

  doSignupFacebook() {
    this.resp = 0
    this.loading.present()
    if (this.account.name == null || this.account.email == null) {
      let toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.loading.dismiss()
    }
    else {
      let body = {
        nome: this.account.name,
        email: this.account.email,
        senha: null,
        facebook_id: this.facebook_user_id
      }

      var create = this.user.signupFacebook(body)
      create.map(res => res.json())
      .subscribe((data) => {
        this.loading.dismiss()
        this.toast = this.toastCtrl.create({
          message: 'Usuário criado com sucesso! Selecione "Entrar com Facebook"',
          duration: 3000,
          position: 'top'
        });
        this.toast.present();
        this.navCtrl.push(WelcomePage);
      }, (err) => {
        this.toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: 'top'
          });
          this.loading.dismiss()
          this.toast.present();
      });
    }
  }
}
