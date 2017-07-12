import { Component } from '@angular/core';

/**
 * Generated class for the AnimalRegisterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'animal-register',
  templateUrl: 'animal-register.html'
})
export class AnimalRegisterComponent {

  text: string;

  constructor() {
    console.log('Hello AnimalRegisterComponent Component');
    this.text = 'Hello World';
  }

}
