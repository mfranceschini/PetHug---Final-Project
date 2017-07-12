import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FoundRegisterPage } from './found-register';

@NgModule({
  declarations: [
    FoundRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(FoundRegisterPage),
  ],
  exports: [
    FoundRegisterPage
  ]
})
export class FoundRegisterPageModule {}
