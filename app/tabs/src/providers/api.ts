import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string;

  constructor(public http: Http, public storage: Storage) {
    this.url = "192.168.100.107" // EM CASA
    // this.url = "192.168.1.17" // NA CAMILA
    // this.url = "172.16.233.109" //NA PUC
    // this.url = "10.0.66.64" // NO STARBUCKS
    // this.url = "192.168.43.43" //NO CELULAR
  }

  setIP(string){
    if (string == null){
      console.log('não inseriu IP')
      string = 'localhost'
    }
    this.url = string;
    
    this.storage.set('ip', this.url);
    console.log('IP salvo!'+ this.url)
  }
  

  getIP(){
    // return this.storage.get('ip');
    return this.url
  }

  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options);
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }
}
