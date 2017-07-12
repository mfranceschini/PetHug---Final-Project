import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { FoundAnimal } from '../models/found-animal';

@Injectable()
export class FoundAnimals {

  constructor(public http: Http, public api: Api) {
  }

  query(params?: any) {
    console.log('lost-animal.ts com query')
    return this.api.get('/animal', params)
      .map(resp => resp.json()); 
  }

  add(item: FoundAnimal) {
  }

  delete(item: FoundAnimal) {
  }

}
