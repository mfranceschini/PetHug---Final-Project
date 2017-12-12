import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController, Events, NavParams, ViewController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MainPage } from '../../pages/pages';
import { Api } from '../../providers/api';
import { WelcomePage } from '../welcome/welcome';
import { PlacePage } from '../place/place';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserPage } from '../../providers/user'


@Component({
  selector: 'page-place-register',
  templateUrl: 'place-register.html'
})
export class PlaceRegisterPage {
  @ViewChild('fileInput') fileInput;
    isReadyToSave: boolean;
    imageData: any;
    form: FormGroup;
    imageLoaded: boolean;
    placeForm: any;
    ipAddress: any;
    v_obj;
    v_fun;
 
  constructor(private user: UserPage, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, public viewCtrl: ViewController, formBuilder: FormBuilder, public navParams: NavParams, public api: Api, public loadingCtrl: LoadingController, public http: Http, public navCtrl: NavController, public toastCtrl: ToastController, public translateService: TranslateService,private events: Events) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      address: [''],
      phone: [''],
      email: [''],
      neighbor: [''],
      city: [''],
      type: ['']
    });

    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
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

  /* Máscaras ER */
  mascara(o,f){
    this.v_obj=o
    this.v_fun=f
    setTimeout(this.execmascara(), 1)
  }
  execmascara(){
    this.v_obj.phoneNumber=this.mtel(this.v_obj.form.controls.phone.value)   
  }
  mtel(v){
    v=v.replace(/\D/g,"");             //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    v=v.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    return v;
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
    this.placeForm = new Object()
    console.log("Salvando formulário")

    this.user.getUser().then((data) => {
      var usuario;
      var usr = JSON.parse(data);
      if (usr.id){
        usuario = usr.id
      }
      else {
        usuario = usr
      }

      this.placeForm = {
        'city': this.form.controls['city'].value,
        'neighbor': this.form.controls['neighbor'].value,
        'address': this.form.controls['address'].value,
        'name': this.form.controls['name'].value,
        'image': this.form.controls['profilePic'].value,
        'phone': this.form.controls['phone'].value,
        'email': this.form.controls['email'].value,
        'type': this.form.controls['type'].value,
        'user': usuario
        }

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        'form': this.placeForm
      };
      this.ipAddress = 'http://' + this.api.url
      if (this.ipAddress == 'http://undefined'){
        this.ipAddress = 'http://localhost'
      }

      this.http.post(this.ipAddress + ':3000/create_place', body, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          console.log("Retorno depois de criar estabelecimento")
          if (data.success == 'sucesso'){
            let toast = this.toastCtrl.create({
              message: "Estabelecimento cadastrado com sucesso!",
              duration: 3000,
              position: 'top'
            });
            toast.present();
            this.viewCtrl.dismiss(this.form.value);
            this.navCtrl.setRoot(MainPage);
            this.navCtrl.push(PlacePage);
          }
          else if (data.success == 'erro'){
            let toast = this.toastCtrl.create({
              message: "Erro ao cadastrar estabelecimento!",
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
