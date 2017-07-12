import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Animals } from '../../providers/providers';
import { Animal } from '../../models/animal';
import { AnimalRegisterPage } from "../animal-register/animal-register";
import { Http } from '@angular/http';


@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentAnimals: Animal[];

  constructor(public navCtrl: NavController, public animals: Animals, public modalCtrl: ModalController, public http: Http) {
    this.currentAnimals = this.animals.query();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
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
    this.animals.delete(animal);
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
