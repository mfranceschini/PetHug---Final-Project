import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
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

  constructor(public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public user: User, public toastCtrl: ToastController, public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Cadastrando Usuário...'
    });

    this.ipAddress = 'http://localhost'
  }

  doSignup() {
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
      var promise;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      nome: this.account.name,
      email: this.account.email,
      senha: this.account.password
    }
    promise = this.http.post(this.ipAddress + ':3000/create_user', body, {headers: headers})
        .map(res => res.json())
        .subscribe((data) => {
          this.loading.dismiss()
          console.log("Retorno de criar usuario")
          console.log(data)
          let toast = this.toastCtrl.create({
            message: 'Usuário criado com sucesso! Entre com seu email e senha.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.push(WelcomePage);
        }, (err) => {
          // Unable to sign up
          let toast = this.toastCtrl.create({
            message: this.signupErrorString,
            duration: 3000,
            position: 'top'
          });
          this.loading.dismiss()
          toast.present();
        });
    }
  }
}
