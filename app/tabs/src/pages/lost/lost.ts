import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { LostAnimals } from '../../providers/providers';
import { LostAnimal } from '../../models/lost-animal';
import { LostRegisterPage } from "../lost-register/lost-register";
import { Http } from '@angular/http';


@Component({
  selector: 'page-lost',
  templateUrl: 'lost.html'
})
export class LostPage {
  currentLostAnimals: LostAnimal[];

  constructor(public navCtrl: NavController, public lostAnimals: LostAnimals, public modalCtrl: ModalController, public http: Http) {
    this.currentLostAnimals = this.lostAnimals.query();
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
  deleteLostAnimal(animal) {
    this.lostAnimals.delete(animal);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openAnimal(animal: LostAnimal) {
    this.navCtrl.push(ItemDetailPage, {
      animal: animal
    });
  }
}
