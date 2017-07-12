import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { FoundAnimal } from '../../models/found-animal';

@Injectable()
export class FoundAnimals {
  foundAnimals: FoundAnimal[] = [];

  defaultFoundAnimal: any = {
    "species":"Cachorro",
    "breed":"Vira Lata",  
    "name": "Mel",
    "size":"Pequeno",
    "gender":"Femea",
    "profilePic": "assets/img/speakers/puppy.jpg",
    "location": "Campinas",
    "status":"Encontrado",
    "about": "Sou um animal muito feliz, gosto de correr e brincar."
  };


  constructor(public http: Http) {
    let foundAnimals = [
      {
        "species":"Cachorro",
        "breed":"Vira Lata",  
        "name": "Mel",
        "size":"Pequeno",
        "gender":"Femea",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "location": "Campinas",
        "status":"Encontrado",
        "about": "Sou um animal muito feliz, gosto de correr e brincar."
      }
    ];

    for (let animal of foundAnimals) {
      this.foundAnimals.push(new FoundAnimal(animal));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.foundAnimals;
    }

    return this.foundAnimals.filter((animal) => {
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

  add(animal: FoundAnimal) {
    this.foundAnimals.push(animal);
  }

  delete(animal: FoundAnimal) {
    this.foundAnimals.splice(this.foundAnimals.indexOf(animal), 1);
  }
}
