import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { FoundAnimals } from '../../providers/providers';
import { FoundAnimal } from '../../models/found-animal';
import { FoundRegisterPage } from '../found-register/found-register';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/api';

import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtml {
  constructor(private sanitizer:DomSanitizer){}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustUrl(html);
  }
}

@Component({
  selector: 'page-found',
  templateUrl: 'found.html'
})
export class FoundPage {
  currentFoundAnimals: any[];
  ipAddress: any;
  myInput: any[];
  val: any;

  constructor(public api: Api, public toastCtrl: ToastController, public navCtrl: NavController, public foundAnimals: FoundAnimals, public modalCtrl: ModalController, public http: Http) {
    this.loadAnimals(false)
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    
  }

  onInput(ev: any) {
    this.val = ev.target.value;

    if (this.val && this.val.trim() != '') {
      if (ev.inputType == "deleteContentBackward") {        
        this.currentFoundAnimals = []
        this.loadAnimals(false)
      }
      this.currentFoundAnimals = this.currentFoundAnimals.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.val.toLowerCase()) > -1 || 
                item.species.toLowerCase().indexOf(this.val.toLowerCase()) > -1 || 
                item.city.toLowerCase().indexOf(this.val.toLowerCase()) > -1 || 
                item.neighbor.toLowerCase().indexOf(this.val.toLowerCase()) > -1 ||                 
                item.breed.toLowerCase().indexOf(this.val.toLowerCase()) > -1);      
        })
    }
    else {
      this.currentFoundAnimals = []
      this.loadAnimals(false)
    }
  }

  onCancel(ev: any) {
    this.currentFoundAnimals = []
    this.loadAnimals(false)    
  }

  doRefresh(refresher) {
    this.myInput = null;
    setTimeout(() => {
      this.loadAnimals(true)
      refresher.complete()
      let toast = this.toastCtrl.create({
        message: "Animais atualizados!",
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
    this.currentFoundAnimals = []
    this.currentFoundAnimals.splice(0,this.currentFoundAnimals.length)
    this.foundAnimals.query().map(res => res.json())
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

          this.currentFoundAnimals.push({
            "species":d.especie_id.toString(),
            "breed":d.raca_id.toString(),  
            "name": d.nome.toString(),
            "size":d.porte_id.toString(),
            "gender":d.sexo.toString(),
            "profilePic": this.ipAddress + ':3000/images/' + d.imagem.toString(),
            "city":d.cidade.toString(),
            "neighbor":d.bairro.toString(),
            "address":d.endereco.toString(),
            "id": d.id.toString(),
            "user": d.responsavel_id.toString()
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
  addFoundAnimal() {
    this.navCtrl.push(FoundRegisterPage);
  }

  /**
   * Delete an item from the list of items.
   */
  deleteFoundAnimal(animal) {
    // this.loadingDel.present()
    console.log("Apagando animal")
    let ret = this.foundAnimals.delete(animal);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Animal Encontrado Excluído com Sucesso!",
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
  openFoundAnimal(animal: FoundAnimal) {
    this.navCtrl.push(ItemDetailPage, {
      animal: animal,
      "found": true
    });
  }
}
