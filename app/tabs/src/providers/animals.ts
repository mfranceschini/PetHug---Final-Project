import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Animal } from '../models/animal';
import { Api } from '../providers/api';
import { Storage } from '@ionic/storage';

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

  constructor(public http: Http, public api: Api, private storage: Storage) {
    
    if (this.api.url == undefined){
      this.api.getIP().then((data)=>{
        this.ipAddress = 'http://' + data
      })
    }
    else {
      this.ipAddress = 'http://' + this.api.url
    }

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
    if (this.ipAddress == undefined){
      this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.ipAddress + ':3000/pet_list', {headers: headers})
  }

  add(animal: Animal) {
    this.animals.push(animal);
  }

  delete(animal: Animal) {
    // this.animals.splice(this.animals.indexOf(animal), 1);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/delete_pet', animal, {headers: headers})
  }

}
