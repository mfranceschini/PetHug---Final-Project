import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { User } from '../../providers/user'
import { ListMasterPage } from "../list-master/list-master";
import { Animals } from '../../providers/providers';


@Component({
  selector: 'page-animal-register',
  templateUrl: 'animal-register.html'
})
export class AnimalRegisterPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  animal: any;

  form: FormGroup;

  imageLoaded: boolean;

  body: any;

  specie: any;

  imageData: any;

  animalForm: any;

  speciesList: any;

  breedsList: any;

  updatedBreedsList: any;

  sizesList: any;

  specieModel: any;

  animalsData: any;

  showLoading: boolean;

  animalModel: any;

  selectedSpecie: any;

  selectedBreed: any;

  selectedSize: any;

  breedModel: any;

  sizeModel: any;

  showSkip: boolean;

  loading: any;

  ipAddress: any;

  listMaster: any;

  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, public http: Http, public user: User, public animals: Animals, public modalCtrl: ModalController) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: [''],
      species: [''],
      breed: [''],
      gender: [''],
      size: [''],
      age: [''],
      weight: [''],
      status: [''],
    });

    this.imageLoaded = false;
    this.showLoading = false;
    this.showSkip = true;

    this.ipAddress = 'http://localhost'

    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Analisando imagem...'
    });

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.get(this.ipAddress + ':3000/animal_data', {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        this.animalsData = data;
        this.loadData(this.animalsData)
      });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  loadData(data) {
    console.log("Carregando listas dos animais...")
    this.speciesList = []
    this.breedsList = []
    this.sizesList = []
    var i;
    for (i=0;i<data.species.length;i++){
      this.speciesList.push(data.species[i])
    }
    for (i=0;i<data.breeds.length;i++){
      this.breedsList.push(data.breeds[i])
    }
    for (i=0;i<data.size.length;i++){
      this.sizesList.push(data.size[i])
    }
  }

  updateBreed(){
    this.updatedBreedsList = []
    var i, j;
    for (j=0;j<this.speciesList.length;j++){
      if (this.speciesList[j].nome == this.specieModel){
        this.selectedSpecie = this.speciesList[j].id
        break
      }
    }
    for (i=0;i<this.breedsList.length;i++){
      if (this.breedsList[i].especie_id == this.selectedSpecie){
      this.updatedBreedsList.push(this.breedsList[i])
    }
    }
  }

  ionViewDidLoad() {
  }

  getPicture() {
    // if (Camera['installed']()) {
    //   console.log("Camera instalada")
    //   this.camera.getPicture({
    //     destinationType: this.camera.DestinationType.DATA_URL,
    //     targetWidth: 96,
    //     targetHeight: 96
    //   }).then((data) => {
    //     // let toast = this.toastCtrl.create({
    //     //     message: "Pegando imagem",
    //     //     duration: 1000,
    //     //     position: 'bottom'
    //     //   });
    //     //   toast.present();
    //     this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
    //   }, (err) => {
    //     alert('Unable to take photo');
    //     this.fileInput.nativeElement.click();
    //   })
    // } else {
    //   console.log("Não achou a camera")
    //   // this.imageLoaded = true;
    //   this.fileInput.nativeElement.click();
    // }
    this.fileInput.nativeElement.click();
  }

  skipImage() {
    this.imageLoaded = true;
    this.showSkip = false;
  }

  processWebImage(event) {
    // let toast = this.toastCtrl.create({
    //         message: "Dentro process",
    //         duration: 2000,
    //         position: 'bottom'
    //       });
    //       toast.present();
    this.loading.present()
    console.log("Processando Imagem...")
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': this.imageData });

      var promise;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let body = {
        'img1': this.imageData
      };

      promise = this.http.post(this.ipAddress + ':3000/create_pet', body, {headers: headers})
        .map(res => res.json())
        .subscribe((data) => {
          console.log("Resultado de Análise Recebida!")
          let i = 0;
          for (i=0;i<data.image1.length;i++){
            if (data.image1[i] == 'whiskers' || data.image1[i] == 'cat like mammal' || data.image1[i] == 'dog breed' || data.image1[i] == 'mammal' || data.image1[i] == 'vertebrate' || data.image1[i] == 'dog like mammal'){
              data.image1.splice(i,1)
            }
            if (data.image1[i] == 'dog'){
              data.image1[i] = 'Cachorro'
            }
            else if (data.image1[i] == 'cat'){
              data.image1[i] = 'Gato'
            }
            else if (data.image1[i] == 'shetland sheepdog'){
              data.image1[i] = 'Pastor de Shetland'
            }
          }
          var j;
          for (j=0;j<this.speciesList.length;j++){
            for(i=0;i<data.image1.length;i++){
              if (this.speciesList[j].nome == data.image1[i]){
                this.specieModel = this.speciesList[j].nome
                Promise.resolve()
                this.imageLoaded = true
                this.loading.dismiss()
                this.updateBreed()
                break
              }
            }
          }
          //Sugere Raça
          for (j=0;j<this.breedsList.length;j++){
            for(i=0;i<data.image1.length;i++){
              if (this.breedsList[j].nome == data.image1[i]){
                this.breedModel = this.breedsList[j].nome
                Promise.resolve()
                this.imageLoaded = true
                break
              }
            }
          }
        },
        (err) => {
          let toast = this.toastCtrl.create({
            message: "Não foi possível analisar a imagem. Por favor, preencha os campos abaixo",
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.imageLoaded = true
          this.loading.dismiss()
        });
      Promise.all([promise]).then(function(data) {
        // all loaded
        console.log("Promise resolvida")
        // this.imageLoaded = true;
      }, function(err) {
        console.error('ERROR:', err);
        // one or more failed
      });
    };

    reader.readAsDataURL(event.target.files[0]);
    
  }
  

  base64ToByteArray(base64String) {
    try {
        var sliceSize = 1024;
        var byteCharacters = atob(base64String);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return byteArrays;
    } catch (e) {
        console.log("Couldn't convert to byte array: " + e);
        return undefined;
    }
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

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    this.animalForm = new Object()
    console.log("Salvando formulário")
    var j,i;
    for (j=0;j<this.breedsList.length;j++){
      if (this.breedsList[j].nome == this.breedModel){
        this.selectedBreed = this.breedsList[j].id
        break
      }
    }
    for (i=0;i<this.sizesList.length;i++){
      if (this.sizesList[i].nome == this.sizeModel){
        this.selectedSize = this.sizesList[i].id
        break
      }
    }

    this.animalForm = {
      'about': this.form.controls['about'].value,
      'age': this.form.controls['age'].value,
      'breed': this.selectedBreed,
      'gender': this.form.controls['gender'].value,
      'name': this.form.controls['name'].value,
      'size': this.selectedSize,
      'species': this.selectedSpecie,
      'status': 1,
      'weight': this.form.controls['weight'].value,
      'image': this.form.controls['profilePic'].value,
      'user': this.user._user.id
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = {
      'form': this.animalForm
    };

    this.http.post(this.ipAddress + ':3000/create_pet', body, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Retorno depois de criar animal")
        let toast = this.toastCtrl.create({
          message: "Animal Cadastrado com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.listMaster = new ListMasterPage(this.navCtrl, this.animals, this.modalCtrl, this.http, this.loadingCtrl, this.toastCtrl)
        this.listMaster.loadAnimals(true)
      });
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);

  }
}
