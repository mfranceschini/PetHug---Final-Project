import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Animals } from '../../providers/providers';
import { Animal } from '../../models/animal';
import { AnimalRegisterPage } from "../animal-register/animal-register";
import { Http, Headers } from '@angular/http';


@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentAnimals: any[];

  ipAddress: any;
  
  loading:any;
  loadingDel: any;
  loadingUpdate: any;

  constructor(public navCtrl: NavController, public animals: Animals, public modalCtrl: ModalController, public http: Http, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
   
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Carregando Pets...'
    });
    this.loadingDel = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Excluindo...'
    });
    this.loadingUpdate = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Atualizando...'
    });
    this.loading.present()
    this.loadAnimals(false)
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  loadAnimals(loading){
    if (loading){
      this.loadingUpdate.present()
    }
    console.log("Carregando Animais")
    this.currentAnimals = []
    this.currentAnimals.splice(0,this.currentAnimals.length)
    this.animals.query().map(res => res.json())
    .subscribe((data) => {
      data.animals.forEach(d => {
        this.currentAnimals.push({
          "species":d.especie_id.toString(),
          "breed":d.raca_id.toString(),  
          "name": d.nome.toString(),
          "size":d.porte_id.toString(),
          "gender":d.sexo.toString(),
          "profilePic": d.imagem.toString(),
          "age":d.idade.toString(),
          "weight":d.peso.toString(),
          "status":d.status_id.toString(),
          "about": d.descricao.toString(),
          "id": d.id.toString()
        })
      });
      this.loading.dismiss()
    }, (err) => {
      console.log('deu erro')
      this.loading.dismiss()
    });
    if (loading){
      this.loadingUpdate.dismiss()
    }
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addAnimal() {
    let addModal = this.modalCtrl.create(AnimalRegisterPage);
    addModal.onDidDismiss(animal => {
      if (animal) {
        this.animals.add(animal);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteAnimal(animal) {
    this.loadingDel.present()
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
      this.loadingDel.dismiss()
      this.loadAnimals(true)
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Animal!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.loadingDel.dismiss()
    });
  }

  /**
   * Navigate to the detail page for this item.
   */
  openAnimal(animal: Animal) {
    this.navCtrl.push(ItemDetailPage, {
      animal: animal
    });
  }
}
