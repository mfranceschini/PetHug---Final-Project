import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the FirstCarePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-first-care',
  templateUrl: 'first-care.html',
})
export class FirstCarePage {
  groups: any;
  shownGroup = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
    console.log("construtor");

    this.initializeList()
    
  }

  presentData(select) {
    if (select == 1) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Cachorros',
        buttons: [
          {
            text: " - Alimentação: a alimentação é dividida conforme o tamanho do cachorro. Para porte pequeno, é indicado entre 78g a 241g por dia. Para porte médio, de 214g a 465g. Para porte grande, de 465g a 559g."
          },{ 
            text: ''
          },{
            text: " - Banho: os banhos são indicados conforme a necessidade. O mais usual é dar 1 vez ao mês. Banho em filhotes é recomendado dar apenas após que todas as vacinas tenham sidos aplicadas."
          }
        ]
      });
      actionSheet.present();
    }
    else if (select == 2) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Gatos',
        buttons: [
          {
            text: " - Alimentação: a alimentação é dividida conforme o tamanho do gato. Para porte pequeno, é indicado entre 14g a 47g por dia. Para porte médio, de 47g a 73g por dia."
          },{ 
            text: ''
          },{
            text: " - Banho: no caso dos gatos, o mais indicado é dar banho apenas uma vez por mês. Além deles não possuírem odores, eles sempre se limpam, portanto, dar banho com muita frequência pode fazer mal ao gato."
          }
        ]
      });
      actionSheet.present();
    }
  }

  initializeList() {
    console.log("Inicializando");
    this.groups = []

    this.groups[0] = {
      name: "Cachorros",
      items: [{
        "Banho": "Os banhos de cachorros variam conforme seu tamanho e a quantidade de pêlo",
        "Comida": "Sempre dê a ração recomendada pelo veterinário seguindo a quantidade indicada pelo profissional"
      }],
      show: false
    }

    this.groups[1] = {
      name: "Gatos",
      items: [{
        "Banho": "Os banhos de gatos variam conforme seu tamanho e a quantidade de pêlo",
        "Comida": "Sempre dê a ração recomendada pelo veterinário seguindo a quantidade indicada pelo profissional"
      }],
      show: false
    }

  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstCarePage');
  }

}
