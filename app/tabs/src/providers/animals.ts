import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Animal } from '../models/animal';

@Injectable()
export class Animals {
  animals: Animal[] = [];

  ipAddress: any;

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
    this.ipAddress = 'http://localhost'
   
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.ipAddress + ':3000/pet_list', {headers: headers})
  }

  add(animal: Animal) {
    this.animals.push(animal);
  }

  delete(animal: Animal) {
    // this.animals.splice(this.animals.indexOf(animal), 1);
    this.ipAddress = 'http://localhost'
   
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/delete_pet', animal, {headers: headers})
  }

}
