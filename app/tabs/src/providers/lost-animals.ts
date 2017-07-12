import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { LostAnimal } from '../models/lost-animal';

@Injectable()
export class LostAnimals {

  constructor(public http: Http, public api: Api) {
  }

  query(params?: any) {
    console.log('lost-animal.ts com query')
    return this.api.get('/animal', params)
      .map(resp => resp.json()); 
  }

  add(item: LostAnimal) {
  }

  delete(item: LostAnimal) {
  }

}
