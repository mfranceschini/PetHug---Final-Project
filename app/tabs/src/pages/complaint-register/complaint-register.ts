import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController, Events, NavParams, ViewController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../../pages/pages';
import { Api } from '../../providers/api';
import { UserPage } from '../../providers/user'
import { WelcomePage } from '../welcome/welcome';
import { ComplaintPage } from '../complaint/complaint';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';


@Component({
  selector: 'page-complaint-register',
  templateUrl: 'complaint-register.html'
})
export class ComplaintRegisterPage {
  @ViewChild('fileInput') fileInput;
    isReadyToSave: boolean;
    imageData: any;
    form: FormGroup;
    imageLoaded: boolean;
    complaintForm: any;
    ipAddress: any;
    speciesList: any;
    animalsData: any;
    selectedSpecie: any;
    specieModel: any;

  constructor(private nativeGeocoder: NativeGeocoder, public user: UserPage, private geolocation: Geolocation, public viewCtrl: ViewController, formBuilder: FormBuilder, public navParams: NavParams, public api: Api, public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public toastCtrl: ToastController, public translateService: TranslateService,private events: Events) {
    this.form = formBuilder.group({
      profilePic: [''],
      address: [''],
      about: [''],
      species: [''],
      neighbor: [''],
      city: ['']
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.ipAddress = 'http://' + this.api.url
    if (this.ipAddress == 'http://undefined'){
     this.ipAddress = 'http://localhost'
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.get(this.ipAddress + ':3000/animal_data', {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      this.animalsData = data;
      this.loadData(this.animalsData)
    });
  
  }

  getLocation() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.nativeGeocoder.reverseGeocode(position.coords.latitude, position.coords.longitude)
      .then((result: NativeGeocoderReverseResult) => {
        this.form.controls['city'].setValue(result.subAdministrativeArea)
        this.form.controls['neighbor'].setValue(result.subLocality)
        this.form.controls['address'].setValue(result.thoroughfare)        
        
      })
    }).catch((err)=>{
      let toast = this.toastCtrl.create({
        message: "Não foi possível possível obter a localização. Por favor, preencha os campos abaixo",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  loadData(data) {
    console.log("Carregando lista das espécies...")
    this.speciesList = []
    var i;
    for (i=0;i<data.species.length;i++){
      this.speciesList.push(data.species[i])
    }
  }

  ionViewDidLoad(){}

  getPicture() {
    this.fileInput.nativeElement.click();
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': this.imageData });
    }

    reader.readAsDataURL(event.target.files[0]);
    this.imageLoaded = true
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.complaintForm = new Object()
    console.log("Salvando formulário")
    var j;
    for (j=0;j<this.speciesList.length;j++){
      if (this.speciesList[j].nome == this.specieModel){
        this.selectedSpecie = this.speciesList[j].id
        break
      }
    }
    this.user.getUser().then((data) => {
      var usuario;
      var usr = JSON.parse(data);
      if (usr.id){
        usuario = usr.id
      }
      else {
        usuario = usr
      }

      this.complaintForm = {
        'city': this.form.controls['city'].value,
        'neighbor': this.form.controls['neighbor'].value,
        'address': this.form.controls['address'].value,
        'about': this.form.controls['about'].value,
        'image': this.form.controls['profilePic'].value,
        'species': this.selectedSpecie,
        'user': usuario      
        }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        'form': this.complaintForm
      };
      this.ipAddress = 'http://' + this.api.url
      if (this.ipAddress == 'http://undefined'){
        this.ipAddress = 'http://localhost'
      }

      this.http.post(this.ipAddress + ':3000/create_complaint', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          console.log("Retorno depois de criar denúncia")
          if (data.success == 'sucesso'){
            let toast = this.toastCtrl.create({
              message: "Denúncia cadastrada com sucesso!",
              duration: 3000,
              position: 'top'
            });
            toast.present();
            this.viewCtrl.dismiss(this.form.value);
            this.navCtrl.setRoot(ComplaintPage);
          }
          else if (data.success == 'erro'){
            let toast = this.toastCtrl.create({
              message: "Erro ao cadastrar denúncia!",
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
      if (!this.form.valid) { return; }
    })
  }
}
