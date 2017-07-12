import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { LostAnimal } from '../../models/lost-animal';

@Injectable()
export class LostAnimals {
  lostAnimals: LostAnimal[] = [];

  defaultLostAnimal: any = {
    "species":"Gato",
    "breed":"Persa",  
    "name": "John",
    "size":"Pequeno",
    "gender":"Macho",
    "profilePic": "assets/img/speakers/kitten.jpg",
    "location": "Barao Geraldo",
    "status":"Perdido",
    "about": "Sou um animal muito feliz, gosto de correr e brincar."
  };


  constructor(public http: Http) {
    let lostAnimals = [
      {
        "species":"Gato",
        "breed":"Persa",  
        "name": "John",
        "size":"Pequeno",
        "gender":"Macho",
        "profilePic": "assets/img/speakers/kitten.jpg",
        "location": "Barao Geraldo",
        "status":"Perdido",
        "about": "Sou um animal muito feliz, gosto de correr e brincar."
      }
    ];

    for (let animal of lostAnimals) {
      this.lostAnimals.push(new LostAnimal(animal));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.lostAnimals;
    }

    return this.lostAnimals.filter((animal) => {
      for (let key in params) {
        let field = animal[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return animal;
        } else if (field == params[key]) {
          return animal;
        }
      }
      return null;
    });
  }

  add(animal: LostAnimal) {
    this.lostAnimals.push(animal);
  }

  delete(animal: LostAnimal) {
    this.lostAnimals.splice(this.lostAnimals.indexOf(animal), 1);
  }
}
