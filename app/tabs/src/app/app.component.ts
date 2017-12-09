import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Config, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirstRunPage } from '../pages/pages';
import { MainPage } from '../pages/pages';
import { PlacePage } from '../pages/place/place';
import { ComplaintPage } from '../pages/complaint/complaint';
import { SettingsPage } from '../pages/settings/settings';

import { Settings, UserPage } from '../providers/providers';
import { OneSignal } from '@ionic-native/onesignal'

import { TranslateService } from '@ngx-translate/core'

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Páginas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Home', component: MainPage },
    { title: 'Estabelecimentos', component: PlacePage },
    { title: 'Denúncias', component: ComplaintPage },    
    { title: 'Configurações', component: SettingsPage }
  ]

  constructor(public toastCtrl: ToastController,private user: UserPage, private oneSignal: OneSignal, private translate: TranslateService, platform: Platform, settings: Settings, private config: Config, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.initTranslate();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString("#cc0000");
      splashScreen.hide();

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
  
      this.oneSignal
        .startInit("682f1efd-6ede-46bd-b6dc-102ecf7fac50", "463999146678")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('pt-br');

    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // } else {
    //   this.translate.use('pt-br'); // Set your language here
    // }

    // this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
    //   this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    // });
  }

  openPage(page) {    
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.user.getUser().then((data) =>{
      var usuario = JSON.parse(data)
      
      if (page.title == "Denúncias" && usuario.tipo == 2) {
        let toast = this.toastCtrl.create({
          message: "Apenas Instituições têm acesso às Denúncias!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
      else {
        this.nav.push(page.component);
      }
    })
  }
}
