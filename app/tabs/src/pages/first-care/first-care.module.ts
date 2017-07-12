import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstCarePage } from './first-care';

@NgModule({
  declarations: [
    FirstCarePage,
  ],
  imports: [
    IonicPageModule.forChild(FirstCarePage),
  ],
  exports: [
    FirstCarePage
  ]
})
export class FirstCarePageModule {}
