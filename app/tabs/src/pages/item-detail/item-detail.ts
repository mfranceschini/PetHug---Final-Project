import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Animals } from '../../providers/providers';
import { EmailComposer } from '@ionic-native/email-composer';
import { UserPage } from '../../providers/user'
import { MainPage } from '../../pages/pages';
import { FoundPage } from '../found/found'

@Component({
  selector: 'page-item-detail', 
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  animal: any;
  user_id: any;
  showDelete: boolean;
  found: any;
  lost: any;
  normal: any;

  constructor(public toastCtrl: ToastController, public user: UserPage, private emailComposer: EmailComposer, public navCtrl: NavController, navParams: NavParams, public animals: Animals) {
    this.animal = navParams.get('animal') || animals.defaultAnimal;

    this.emailComposer.addAlias('gmail', 'com.google.android.gm');

    this.found = false
    this.lost = false
    this.normal = false

    if (navParams.get('found') == true) {
      console.log('veio de animais encontrados');
      this.found = true
    }
    else if (navParams.get('lost') == true) {
      console.log('veio de animais perdidos');
      this.lost = true
    }
    else if (navParams.get('normal') == true) {
      console.log('veio de animais disponiveis');
      this.normal = true
    }
  }

  ionViewDidLoad() {
    this.user.getUser().then((data) => {      
      this.user_id = JSON.parse(data);      

      if (this.animal.user == this.user_id.id) {
        this.showDelete = true      
      }
      else {
        this.showDelete = false
      }
    })
  }

  deleteAnimal(animal) {
    // this.loadingDel.present()
    console.log("Apagando animal")
    let ret = this.animals.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Animal Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.push(FoundPage);
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Animal!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.loadingDel.dismiss()
    });
  }

  sendEmail() {
    let email = {}
    this.emailComposer.isAvailable().then((available: boolean) =>{
      console.log("Email disponivel");
      
      // if(available) {
        this.user.getUserData(this.user_id.id)
        .map(res => res.json())
        .subscribe(usuario => {
          this.user.getUserData(this.animal.user)
          .map(res => res.json())
          .subscribe(responsavel => {
            console.log("Responsavel pegado!!")
            console.log(JSON.stringify(responsavel))

            if (this.normal == true) {
              console.log('Enviando email de disponíveis');
              
              email = {
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
            }
            else if (this.found == true) {
              console.log('Enviando email de encontrados');
              
              email = {
                to: responsavel.email,
                cc: 'm.franceschini17@gmail.com',
                attachments: [
                  // 'file://img/logo.png',
                  // 'res://icon.png',
                  // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
                  // 'file://README.pdf'
                ],
                subject: 'PetHug - ' + usuario.nome.split(" ",1) + ' tem informações sobre ' + this.animal.name,
                body: 'Olá ' + responsavel.nome.split(" ",1) + ', a/o ' + usuario.nome.split(" ",1) + 
                ', através do PetHug, pode ter novas informações sobre ' + this.animal.name + "!" +
                " Para isso, por favor entre em contato através dos dados abaixo." 
                + "Nome Completo: " + usuario.nome
                + ",Email: " + usuario.email
                + ". Mais uma vez, obrigado por utilizar o PetHug, Atenciosamente Equipe PetHug",
                isHtml: true
              };
            }
            else if (this.lost == true) {
              console.log("Enviando email de perdidos");
              
              email = {
                to: responsavel.email,
                cc: 'm.franceschini17@gmail.com',
                attachments: [
                  // 'file://img/logo.png',
                  // 'res://icon.png',
                  // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
                  // 'file://README.pdf'
                ],
                subject: 'PetHug - ' + usuario.nome.split(" ",1) + ' tem informações sobre ' + this.animal.name,
                body: 'Olá ' + responsavel.nome.split(" ",1) + ', a/o ' + usuario.nome.split(" ",1) + 
                ', através do PetHug, pode ter novas informações sobre ' + this.animal.name + "!" +
                " Para isso, por favor entre em contato através dos dados abaixo." 
                + "Nome Completo: " + usuario.nome
                + ",Email: " + usuario.email
                + ". Mais uma vez, obrigado por utilizar o PetHug, Atenciosamente Equipe PetHug",
                isHtml: true
              };
            }
    
            this.emailComposer.open(email);
          });

        });
      // }
     });
  }

}
