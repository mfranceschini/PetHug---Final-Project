import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Animal } from '../../models/animal';
 
@Injectable()
export class Animals {
  animals: Animal[] = [];

  defaultAnimal: any = {
    "species":"Cachorro",
    "breed":"Vira Lata",  
    "name": "Bob",
    "size":"Pequeno",
    "gender":"Macho",
    "profilePic": "assets/img/speakers/puppy.jpg",
    "age":"3",
    "weight":"4",
    "status":"Para adoção",
    "about": "Sou um animal muito feliz, gosto de correr e brincar."
  };


  constructor(public http: Http) {
    let animals = [
      {
        "species":"Cachorro",
        "breed":"Vira Lata",  
        "name": "Bob",
        "size":"Pequeno",
        "gender":"Macho",
        "profilePic": "assets/img/speakers/puppy.jpg",
        "age":"3",
        "weight":"4",
        "status":"Para adoção",
        "about": "Sou um animal muito feliz, gosto de correr e brincar."
      }
    ];

    for (let animal of animals) {
      this.animals.push(new Animal(animal));
    }
  }

  query(params?: any) {
    if (!params) {
      return this.animals;
    }

    return this.animals.filter((animal) => {
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

  add(animal: Animal) {
    this.animals.push(animal);
  }

  delete(animal: Animal) {
    this.animals.splice(this.animals.indexOf(animal), 1);
  }
}
