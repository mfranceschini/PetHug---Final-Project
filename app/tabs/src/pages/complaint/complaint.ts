import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, LoadingController } from 'ionic-angular';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Complaints } from '../../providers/providers';
import { ComplaintRegisterPage } from '../complaint-register/complaint-register';
import { Http, Headers } from '@angular/http';
import { Api } from '../../providers/api'
import { UserPage } from '../../providers/user'

@Component({
  selector: 'page-complaint',
  templateUrl: 'complaint.html'
})
export class ComplaintPage {
  currentComplaints: any[];
  ipAddress: any;
  myInput: any;

  constructor(private user: UserPage, public api: Api, public toastCtrl: ToastController, public navCtrl: NavController, public complaints: Complaints, public modalCtrl: ModalController, public http: Http) {
    this.loadComplaint(false)
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  onInput(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() != '') {
      if (ev.inputType == "deleteContentBackward") {        
        this.currentComplaints = []
        this.loadComplaint(false)
      }
      this.currentComplaints = this.currentComplaints.filter((item) => {
        return (item.specie.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
                item.city.toLowerCase().indexOf(val.toLowerCase()) > -1 || 
                item.neighbor.toLowerCase().indexOf(val.toLowerCase()) > -1                
        );
      })
    }
    else {
      this.currentComplaints = []
      this.loadComplaint(false)
    }
  }

  onCancel(ev: any) {
    this.currentComplaints = []
    this.loadComplaint(false)    
  }

  doRefresh(refresher) {
    this.myInput = null;
    setTimeout(() => {
      this.loadComplaint(true)
      refresher.complete()
      let toast = this.toastCtrl.create({
        message: "Denúncias atualizados!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, 2000);
  }

  loadComplaint(loading){
    console.log("Carregando Denúncias")
    this.currentComplaints = []
    this.currentComplaints.splice(0,this.currentComplaints.length)
    this.complaints.query().map(res => res.json())
    .subscribe((data) => {
      this.ipAddress = 'http://' + this.api.url
      if (this.ipAddress == 'http://undefined'){
        this.ipAddress = 'http://localhost'
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.ipAddress + ':3000/animal_data', {headers: headers})
      .map(res => res.json())
      .subscribe(data2 => {
        var i;
        data.complaints.forEach(d => {
          for (i=0;i<data2.species.length;i++){
            if (data2.species[i].id == d.especie_id){
              d.especie_id = data2.species[i].nome
            }
          }
          this.currentComplaints.push({
            "profilePic": this.ipAddress + ':3000/images/complaints/' + d.imagem.toString(),
            "city":d.cidade.toString(),
            "neighbor":d.bairro.toString(),
            "address":d.endereco.toString(),
            "id": d.id.toString(),
            "about": d.descricao.toString(),
            "specie": d.especie_id.toString(),
            "user": d.responsavel_id.toString()
          })
          // this.loading.dismiss()
        });
        // if (!loading){
        
        // }
        // else if (loading){
        // this.loadingUpdate.dismiss()
        // }
      });
      
      
    }, (err) => {
      console.log('deu erro')
      console.log(JSON.stringify(err))
    });
  }


  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addComplaint() {
    let addModal = this.modalCtrl.create(ComplaintRegisterPage);
    addModal.onDidDismiss(complaint => {
      if (complaint) {
        this.complaints.add(complaint);
      }
    })
    addModal.present();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteComplaint(complaint) {
    console.log("Apagando denúncia")
    let ret = this.complaints.delete(complaint);
    ret.map(res => res.json())
    .subscribe((data) => {
      let toast = this.toastCtrl.create({
          message: "Denúncia Excluído com Sucesso!",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      this.loadComplaint(true)
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: "Erro ao Excluir Denúncia!",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  openComplaint(complaint) {
    this.user.getUserData(complaint.user)
    .map(res => res.json())
    .subscribe((user) => {
      let email = user.email
      var json = {
        "complaint": complaint,
        "email": email
      }
      this.navCtrl.push(ItemDetailPage, {
        animal: json,
        "complaint": true
      });
    })
  }
}
