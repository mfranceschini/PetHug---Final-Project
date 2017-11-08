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
            text: " - Higiene: os banhos são indicados conforme a necessidade. O mais usual é dar 1 vez ao mês. Banho em filhotes é recomendado dar apenas após que todas as vacinas tenham sidos aplicadas."
          },{ 
            text: ''
          },{
            text: " - Vermifugação: a vermifugação é recomendada ser aplicada a cada 4 a 6 meses, ou seja, de 2 a 3 vezes ao ano."
          },{ 
            text: ''
          },{
            text: " - Vacina: em relação às vacinas, é sempre recomendado seguir o que for informado pelo veterinário, preferindo sempre pela vacina importada a nacional."
          },{ 
            text: ''
          },{
            text: " - Pulgas/Carrapatos: sempre é preciso estar atento e deixar o cachorro protegido. Existem diversos produtos de qualidade disponíveis no mercado. Para a aplicação, siga a recomendação informada pelo produto escolhido."
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
            text: " - Higiene: no caso dos gatos, o mais indicado é dar banho apenas uma vez por mês. Além deles não possuírem odores, eles sempre se limpam, portanto, dar banho com muita frequência pode fazer mal ao gato. Além disso, é necessário sempre limpar a caixa de areia de 1 a 2 vezes ao dia."
          },{ 
            text: ''
          },{
            text: " - Vermifugação: a vermifugação é recomendada ser aplicada a cada 4 a 6 meses, ou seja, de 2 a 3 vezes ao ano."
          },{ 
            text: ''
          },{
            text: " - Vacina: em relação às vacinas, é sempre recomendado seguir o que for informado pelo veterinário, preferindo sempre pela vacina importada a nacional."
          },{ 
            text: ''
          },{
            text: " - Pulgas/Carrapatos: sempre é preciso estar atento e deixar o gato protegido. Existem diversos produtos de qualidade disponíveis no mercado. Para a aplicação, siga a recomendação informada pelo produto escolhido."
          }
        ]
      });
      actionSheet.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FirstCarePage');
  }

}
