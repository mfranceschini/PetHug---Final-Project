import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnimalRegisterComponent } from './animal-register';

@NgModule({
  declarations: [
    AnimalRegisterComponent,
  ],
  imports: [
    IonicPageModule.forChild(AnimalRegisterComponent),
  ],
  exports: [
    AnimalRegisterComponent
  ]
})
export class AnimalRegisterComponentModule {}
