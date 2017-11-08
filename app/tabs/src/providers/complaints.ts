import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Complaint } from '../models/complaint';
import { Api } from '../providers/api';
import { Storage } from '@ionic/storage';

@Injectable()
export class Complaints {
  complaints: Complaint[] = [];

  ipAddress: any;

  defaultComplaint: any = {
    "espécie":"Cachorro",
    "cidade":"Campinas",
    "bairro":"Cambuí",
    "endereco":"Rua Maria Monteiro",
    "imagem":"imagem.png",
    "descrição":"Animal mau tratado"
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

    let complaints = [
      {
        "espécie":"Cachorro",
        "cidade":"Campinas",
        "bairro":"Cambuí",
        "endereco":"Rua Maria Monteiro",
        "imagem":"imagem.png",
        "descrição":"Animal mau tratado"
      }
    ];

    for (let complaint of complaints) {
      this.complaints.push(new Complaint(complaint));
    } 
  }

  query(params?: any) {
    if (this.ipAddress == undefined){
      this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.ipAddress + ':3000/complaint_list', {headers: headers})
  }

  add(complaint: Complaint) {
    this.complaints.push(complaint);
  }

  delete(complaint: Complaint) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.ipAddress + ':3000/delete_complaint', complaint, {headers: headers})
  }

}
