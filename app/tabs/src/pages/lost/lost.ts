import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { LostAnimals } from '../../providers/providers';
import { LostAnimal } from '../../models/lost-animal';
import { LostRegisterPage } from '../lost-register/lost-register';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/api'


@Component({
  selector: 'page-lost',
  templateUrl: 'lost.html'
})
export class LostPage {
  currentLostAnimals: any[];
  ipAddress: any;

  constructor(public api: Api, public toastCtrl: ToastController, public navCtrl: NavController, public lostAnimals: LostAnimals, public modalCtrl: ModalController, public http: Http) {
    this.loadAnimals(false)
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadAnimals(true)
      refresher.complete()
      let toast = this.toastCtrl.create({
        message: "Animais Perdidos atualizados!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, 2000);
  }

  loadAnimals(loading){
    // if (loading){
    //   this.loadingUpdate.present()
    // }
    // this.loading.present()
    console.log("Carregando Animais Encontrados")
    this.currentLostAnimals = []
    this.currentLostAnimals.splice(0,this.currentLostAnimals.length)
    this.lostAnimals.query().map(res => res.json())
    .subscribe((data) => {
      this.ipAddress = 'http://' + this.api.url
      if (this.ipAddress == 'http://undefined'){
        this.ipAddress = 'http://localhost'
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.ipAddress + ':3000/animal_data', {headers: headers})
      .map(res => res.json())
      .subscribe(data2 => {
        var i;
        data.animals.forEach(d => {
          for (i=0;i<data2.species.length;i++){
            if (data2.species[i].id == d.especie_id){
              d.especie_id = data2.species[i].nome
            }
          }
          for (i=0;i<data2.breeds.length;i++){
            if (data2.breeds[i].id == d.raca_id){
              d.raca_id = data2.breeds[i].nome
            }
          }
          for (i=0;i<data2.size.length;i++){
            if (data2.size[i].id == d.porte_id){
              d.porte_id = data2.size[i].nome
            }
          }
          this.currentLostAnimals.push({
            "species":d.especie_id.toString(),
            "breed":d.raca_id.toString(),  
            "name": d.nome.toString(),
            "size":d.porte_id.toString(),
            "gender":d.sexo.toString(),
            "profilePic": d.imagem.toString(),
            "city":d.cidade.toString(),
            "neighbor":d.bairro.toString(),
            "address":d.endereco.toString(),
            "id": d.id.toString()
          })
          // this.loading.dismiss()
        });
        // if (!loading){
        
        // }
        // else if (loading){
        // this.loadingUpdate.dismiss()
        // }
      });
      
      
    }, (err) => {
      console.log('deu erro')
      console.log(err)
    });
    // if (loading){
    //   this.loadingUpdate.dismiss()
    // }
  }


  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addLostAnimal() {
    let addModal = this.modalCtrl.create(LostRegisterPage);
    addModal.onDidDismiss(animal => {
      if (animal) {
        this.lostAnimals.add(animal);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteFoundAnimal(animal) {
    // this.loadingDel.present()
    console.log("Apagando animal")
    let ret = this.lostAnimals.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Animal Perdido Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      // this.loadingDel.dismiss()
      this.loadAnimals(true)
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

  /**
   * Navigate to the detail page for this item.
   */
  openLostAnimal(animal: LostAnimal) {
    this.navCtrl.push(ItemDetailPage, {
      animal: animal
    });
  }
}
