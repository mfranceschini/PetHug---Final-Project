import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';
import { Storage } from '@ionic/storage';
import { FoundAnimal } from '../models/found-animal';
 
@Injectable()
export class FoundAnimals {
  foundAnimals: FoundAnimal[] = [];
  ipAddress: any;

  defaultFoundAnimal: any = {
    "species":"Cachorro",
    "breed":"Vira Lata",  
    "name": "Bob",
    "size":"Pequeno",
    "gender":"Macho",
    "profilePic": "assets/img/speakers/puppy.jpg",
    "city":"Campinas",
    "neighbor":"Notre Dame",
    "address":"Rua Alberto Macchi"
  }

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
        "city":"Campinas",
        "neighbor":"Notre Dame",
        "address":"Rua Alberto Macchi"
      }
    ];

    for (let animal of animals) {
      this.foundAnimals.push(new FoundAnimal(animal));
    } 
  }

  query(params?: any) {
    if (this.ipAddress == undefined){
      this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.ipAddress + ':3000/found_pet_list', {headers: headers})
  }

  add(animal: FoundAnimal) {
    this.foundAnimals.push(animal);
  }

  delete(animal: FoundAnimal) {
    console.log("funcao de deletar")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/delete_found_pet', animal, {headers: headers})
  }

}
