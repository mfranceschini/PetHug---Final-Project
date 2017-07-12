import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { FoundAnimals } from '../../providers/providers';
import { FoundAnimal } from '../../models/found-animal';
import { FoundRegisterPage } from "../found-register/found-register";
import { Http } from '@angular/http';


@Component({
  selector: 'page-found',
  templateUrl: 'found.html'
})
export class FoundPage {
  currentFoundAnimals: FoundAnimal[];

  constructor(public navCtrl: NavController, public foundAnimals: FoundAnimals, public modalCtrl: ModalController, public http: Http) {
    this.currentFoundAnimals = this.foundAnimals.query();
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
  addLostAnimal() {
    let addModal = this.modalCtrl.create(FoundRegisterPage);
    addModal.onDidDismiss(animal => {
      if (animal) {
        this.foundAnimals.add(animal);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteLostAnimal(animal) {
    this.foundAnimals.delete(animal);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openAnimal(animal: FoundAnimal) {
    this.navCtrl.push(ItemDetailPage, {
      animal: animal
    });
  }
}
