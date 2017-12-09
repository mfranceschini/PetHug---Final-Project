import { Component } from '@angular/core';
import { MenuController, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { WelcomePage } from '../welcome/welcome';
import { OneSignal } from '@ionic-native/onesignal'
import { TranslateService } from '@ngx-translate/core';
import { UserPage } from "../../providers/user";



export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;
  toast: any;

  constructor(private oneSignal: OneSignal, public navCtrl: NavController, public toastCtrl: ToastController, public menu: MenuController, translate: TranslateService, public user: UserPage) {
    
    translate.get(["TUTORIAL_SLIDE1_TITLE",
      "TUTORIAL_SLIDE1_DESCRIPTION",
      "TUTORIAL_SLIDE2_TITLE",
      "TUTORIAL_SLIDE2_DESCRIPTION",
      "TUTORIAL_SLIDE3_TITLE",
      "TUTORIAL_SLIDE3_DESCRIPTION",
      "TUTORIAL_SLIDE4_TITLE",
      "TUTORIAL_SLIDE4_DESCRIPTION",
      "TUTORIAL_SLIDE5_TITLE",
      "TUTORIAL_SLIDE5_DESCRIPTION",
    ]).subscribe(
      (values) => {
        console.log('Loaded values', values);
        this.slides = [
          {
            title: values.TUTORIAL_SLIDE1_TITLE,
            description: values.TUTORIAL_SLIDE1_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-1.png',
          },
          {
            title: values.TUTORIAL_SLIDE2_TITLE,
            description: values.TUTORIAL_SLIDE2_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: values.TUTORIAL_SLIDE3_TITLE,
            description: values.TUTORIAL_SLIDE3_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: values.TUTORIAL_SLIDE4_TITLE,
            description: values.TUTORIAL_SLIDE4_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: values.TUTORIAL_SLIDE5_TITLE,
            description: values.TUTORIAL_SLIDE5_DESCRIPTION,
            image: 'assets/img/ica-slidebox-img-3.png',
          }
        ];
      });
  }

  startApp(user) {
    let usuario
    if (user.id) {
      usuario = user.id
    }
    else {
      usuario = user
    }
    
    this.oneSignal.getIds().then((os)=>{
      let json = {
        "usuario_id": usuario,
        "dispositivo": os.userId
      }
      this.user.setDevice(json)
      .map(res => res.json())
      .subscribe((device) => {
        if (device.success == "success") {
          this.navCtrl.setRoot(TabsPage, {}, {
            animate: true,
            direction: 'forward'
          });
        }
        else {
          console.log("Erro ao adicionar dispositivo!")
        }
      })
    })
    
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    this.user.getUser().then((data) => {
      let usr = JSON.parse(data);
      console.log("USUARIO: " + JSON.stringify(usr));
      
      if (usr != null){
        if (usr.nome != null) {
          var nome = usr.nome.split(" ",1)
          this.toast = this.toastCtrl.create({
            message: 'Bem-vindo, ' + nome,
            duration: 3000,
            position: 'top'
          });
          this.toast.present();
        }
        this.startApp(usr)
      }
      else {
        this.navCtrl.setRoot(WelcomePage, {}, {
          animate: true,
          direction: 'forward'
        });
      }
      this.menu.enable(false);
    })
    
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
