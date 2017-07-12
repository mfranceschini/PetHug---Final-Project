import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Animals } from '../../providers/providers';

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  animal: any;

  constructor(public navCtrl: NavController, navParams: NavParams, animals: Animals) {
    this.animal = navParams.get('animal') || animals.defaultAnimal;
  }

}
