import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Places } from '../../providers/providers';
import { Place } from '../../models/place';
import { PlaceRegisterPage } from '../place-register/place-register';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/api'
import { CallNumber } from '@ionic-native/call-number';


@Component({
  selector: 'page-place',
  templateUrl: 'place.html'
})
export class PlacePage {
  currentPlaces: any[];
  ipAddress: any;
  myInput: any;

  constructor(private dialer: CallNumber, public api: Api, public toastCtrl: ToastController, public navCtrl: NavController, public places: Places, public modalCtrl: ModalController, public http: Http) {
    this.loadPlaces(false)
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  onInput(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() != '') {
      if (ev.inputType == "deleteContentBackward") {        
        this.currentPlaces = []
        this.loadPlaces(false)
      }
      this.currentPlaces = this.currentPlaces.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                item.city.toLowerCase().indexOf(val.toLowerCase()) > -1 || 
                item.type.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                item.neighbor.toLowerCase().indexOf(val.toLowerCase()) > -1                
        );
      })
    }
    else {
      this.currentPlaces = []
      this.loadPlaces(false)
    }
  }

  onCancel(ev: any) {
    this.currentPlaces = []
    this.loadPlaces(false)    
  }

  doRefresh(refresher) {
    this.myInput = null;
    setTimeout(() => {
      this.loadPlaces(true)
      refresher.complete()
      let toast = this.toastCtrl.create({
        message: "Estabelecimentos atualizados!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, 2000);
  }

  loadPlaces(loading){
    console.log("Carregando Estabelecimentos")
    this.currentPlaces = []
    this.currentPlaces.splice(0,this.currentPlaces.length)
    this.places.query().map(res => res.json())
    .subscribe((data) => {
      this.ipAddress = 'http://' + this.api.url
      if (this.ipAddress == 'http://undefined'){
        this.ipAddress = 'http://localhost'
      }
      console.log(JSON.stringify(data));
      data.places.forEach(d => {
        this.currentPlaces.push({
          "name": d.nome.toString(),
          "profilePic": this.ipAddress + ':3000/images/places/' + d.imagem.toString(),
          "city":d.cidade.toString(),
          "neighbor":d.bairro.toString(),
          "address":d.endereco.toString(),
          "id": d.id.toString(),
          "email": d.email.toString(),
          "phone": d.telefone.toString(),
          "type": d.tipo.toString()
        })
      });
    }, (err) => {
      console.log('deu erro')
      console.log(err)
    });
  }


  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addPlace() {
    this.navCtrl.push(PlaceRegisterPage);
  }

  /**
   * Delete an item from the list of items.
   */
  deletePlace(place) {
    console.log("Apagando estabelecimento")
    let ret = this.places.delete(place);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Estabelecimento Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      this.loadPlaces(true)
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Estabelecimento!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  openPlace(place) {
    let toast = this.toastCtrl.create({
      message: "Abrindo Discador...",
      duration: 1500,
      position: 'top'
    });
    toast.present().then((data) => {
      this.dialer.callNumber(place.phone, true)
    });
    
  }
}
