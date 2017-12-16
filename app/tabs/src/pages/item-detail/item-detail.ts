import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Animals, Complaints, LostAnimals, FoundAnimals } from '../../providers/providers';
import { EmailComposer } from '@ionic-native/email-composer';
import { UserPage } from '../../providers/user'
import { MainPage } from '../../pages/pages';
import { FoundPage } from '../found/found';
import { LostPage } from '../lost/lost';
import { ComplaintPage } from '../complaint/complaint';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/api'


@Component({
  selector: 'page-item-detail', 
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  animal: any;
  user_id: any;
  showDelete: boolean;
  showEmail: boolean;  
  found: any;
  lost: any;
  normal: any;
  complaint: any;
  ipAddress: any;

  constructor(public api: Api, public http: Http, public toastCtrl: ToastController, public user: UserPage, private emailComposer: EmailComposer, public navCtrl: NavController, navParams: NavParams, public animals: Animals, public foundAnimals: FoundAnimals, public lostAnimals: LostAnimals, public complaints: Complaints) {
    this.animal = navParams.get('animal') || animals.defaultAnimal;

    this.emailComposer.addAlias('gmail', 'com.google.android.gm');

    this.found = false
    this.lost = false
    this.normal = false
    this.complaint = false

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
    else if (navParams.get('complaint') == true) {
      console.log('veio de denuncias');      
      this.complaint = true
    }
  }

  ionViewDidLoad() {
    this.user.getUser().then((data) => {      
      this.user_id = JSON.parse(data);
      
      if (this.animal.complaint) {
        if (this.animal.complaint.user == this.user_id.id) {
          this.showDelete = true      
        }
        else {
          this.showDelete = false
        }
      }
      else {
        if (this.animal.user == this.user_id.id) {
          this.showDelete = true      
        }
        else {
          this.showDelete = false
        }
      }
    })

    if (this.animal.share_email == 1) {
      this.showEmail = true
    }
    else {
      this.showEmail = false
    }    
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
        this.navCtrl.setRoot(MainPage);
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

  deleteLostAnimal(animal) {
    // this.loadingDel.present()
    console.log("Apagando animal perdido")
    let ret = this.lostAnimals.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Animal Perdido Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(LostPage);
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Animal Perdido!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.loadingDel.dismiss()
    });
  }

  deleteFoundAnimal(animal) {
    // this.loadingDel.present()
    console.log("Apagando animal encontrado")
    let ret = this.foundAnimals.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Animal Encontrado Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(FoundPage);
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Animal Encontrado!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      // this.loadingDel.dismiss()
    });
  }

  deleteComplaint(animal) {
    // this.loadingDel.present()
    console.log("Apagando denúncia")
    let ret = this.complaints.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Denúncia Excluída com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot(ComplaintPage);
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Denúncia!",
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
      
      // if(available) {
        this.user.getUserData(this.user_id.id)
        .map(res => res.json())
        .subscribe(usuario => {
          this.user.getUserData(this.animal.user)
          .map(res => res.json())
          .subscribe(responsavel => {

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
                subject: 'PetHug - ' + usuario.nome.split(" ",1) + ' quer adotar ' + this.animal.name,
                body: 'Olá ' + responsavel.nome.split(" ",1) + ', o usuário ' + usuario.nome.split(" ",1) + 
                ', através do PetHug encontrou ' + this.animal.name + 
                " e quer adotá-la/o! Para isso, por favor entre em contato com a futura família através dos dados abaixo. \n\n\n" 
                + "Nome Completo: " + usuario.nome
                + ", Email: " + usuario.email
                + ". Mais uma vez, obrigado por utilizar o PetHug. Atenciosamente, Equipe PetHug",
                isHtml: true
              };
            }    
            this.emailComposer.open(email);
          });

        });
      // }
     });
  }

  sendNotification() {
    this.ipAddress = 'http://' + this.api.url
    if (this.ipAddress == 'http://undefined'){
      this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      'user': this.animal.user,
      'animal': this.animal.name,
      'species': this.animal.species
    };
    this.http.post(this.ipAddress + ':3000/notify_interrest', body, {headers: headers})
      .map(res => res.json())
      .subscribe((data) => {
        console.log("Notificação enviada com sucesso!");
        if (data.success == "sucesso") {
          let toast = this.toastCtrl.create({
            message: "Usuário notificado!",
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      })
  }

}
