import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Animals } from '../../providers/providers';
import { EmailComposer } from '@ionic-native/email-composer';
import { UserPage } from '../../providers/user'

@Component({
  selector: 'page-item-detail', 
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  animal: any;
  user_id: any;

  constructor(public user: UserPage, private emailComposer: EmailComposer, public navCtrl: NavController, navParams: NavParams, animals: Animals) {
    this.animal = navParams.get('animal') || animals.defaultAnimal;

    console.log(this.animal.user_id)

    this.emailComposer.addAlias('gmail', 'com.google.android.gm');
  }

  ionViewDidLoad() {
  }

  sendEmail() {
    console.log("Dentro funcao de email!!!")

    this.emailComposer.isAvailable().then((available: boolean) =>{
      // if(available) {
        console.log("Email esta disponivel")

        this.user.getUserData(this.user._user.id)
        .map(res => res.json())
        .subscribe(usuario => {
          this.user.getUserData(this.animal.user_id)
          .map(res => res.json())
          .subscribe(responsavel => {
            console.log("Responsavel pegado!!")
            console.log(JSON.stringify(responsavel))
  
            let email = {
              to: responsavel.email,
              cc: 'm.franceschini17@gmail.com',
              attachments: [
                // 'file://img/logo.png',
                // 'res://icon.png',
                // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
                // 'file://README.pdf'
              ],
              subject: 'PetHug - ' + usuario.nome.split(" ",1) + ' quer adotar a/o ' + this.animal.name,
              body: 'Olá ' + responsavel.nome.split(" ",1) + ', a/o ' + usuario.nome.split(" ",1) + 
              ', através do PetHug encontrou a/o ' + this.animal.name + 
              " e quer adotá-la/o! Para isso, por favor entre em contato com a futura família através dos dados abaixo." 
              + "Nome Completo: " + usuario.nome
              + ",Email: " + usuario.email
              + ". Mais uma vez, obrigado por utilizar o PetHug, Atenciosamente Equipe PetHug",
              isHtml: true
            };
  
            console.log("Email Composto:")
            console.log(JSON.stringify(email))
    
            this.emailComposer.open(email);
          });

        });
      // }
     });
  }

}
