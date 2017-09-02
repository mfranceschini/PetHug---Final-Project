import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../../pages/pages';

import { UserPage } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  loading: any;

  ipAddress: any;

  resp: any;

  toast: any;

  constructor(public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController,public userCtrl: UserPage,public toastCtrl: ToastController,public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Conectando...'
    });

  }

  // Attempt to login in through our User service
  doLogin() {
    this.loading.present()
    if (this.account.email == null || this.account.password == null) {
      let toast = this.toastCtrl.create({
            message: this.loginErrorString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.loading.dismiss()
    }
    else {
      let body = {
        email: this.account.email,
        senha: this.account.password
      }

      var login = this.userCtrl.login(body)

      login.map(res => res.json())
      .subscribe((data) => {
        this.userCtrl._loggedIn(data);
        this.loading.dismiss()
        var nome = data.nome.split(" ",1)
        this.toast = this.toastCtrl.create({
          message: 'Bem-vindo, ' + nome,
          duration: 3000,
          position: 'top'
        });
        this.toast.present();
        this.navCtrl.push(MainPage);
      }, (err) => {
        this.toast = this.toastCtrl.create({
          message: this.loginErrorString,
          duration: 3000,
          position: 'top'
        });
        this.toast.present();
        this.loading.dismiss()
      });
    }
  }
}
