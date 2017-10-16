import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Place } from '../models/place';
import { Api } from '../providers/api';
import { Storage } from '@ionic/storage';

@Injectable()
export class Places {
  places: Place[] = [];

  ipAddress: any;

  defaultPlace: any = {
    "nome":"Brexó",
    "cidade":"Campinas",
    "bairro":"Cambuí",
    "endereco":"Rua Maria Monteiro",
    "telefone":"(19)3201-0483",
    "email":"brexo@contato.com",
    "imagem":"imagem.png"
  };

  constructor(public http: Http, public api: Api, private storage: Storage) {
    
    // if (this.api.url == undefined){
    //   this.api.getIP().then((data)=>{
    //     this.ipAddress = 'http://' + data
    //   })
    // }
    // else {
      this.ipAddress = 'http://' + this.api.url
    // }

    let places = [
      {
        "nome":"Brexó",
        "cidade":"Campinas",
        "bairro":"Cambuí",
        "endereco":"Rua Maria Monteiro",
        "telefone":"(19)3201-0483",
        "email":"brexo@contato.com",
        "imagem":"imagem.png"
      }
    ];

    for (let place of places) {
      this.places.push(new Place(place));
    } 
  }

  query(params?: any) {
    if (this.ipAddress == undefined){
      this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.ipAddress + ':3000/place_list', {headers: headers})
  }

  add(place: Place) {
    this.places.push(place);
  }

  delete(place: Place) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/delete_place', place, {headers: headers})
  }

}
