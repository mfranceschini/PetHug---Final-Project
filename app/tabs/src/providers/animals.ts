import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { Animal } from '../models/animal';

@Injectable()
export class Animals {

  constructor(public http: Http, public api: Api) {
  }

  query(params?: any) {
    console.log('animal.ts com query')
    return this.api.get('/animal', params)
      .map(resp => resp.json()); 
  }

  add(item: Animal) {
  }

  delete(item: Animal) {
  }

}
