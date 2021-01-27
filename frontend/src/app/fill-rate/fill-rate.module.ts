import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FillRateRoutingModule} from '@app/fill-rate/fill-rate-routing.module';
import {IonicModule} from '@ionic/angular';
import {FillRateComponent} from './fill-rate.component';

@NgModule({
  declarations: [FillRateComponent],
  imports: [
    CommonModule,
    IonicModule,
    FillRateRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [],
})
export class FillRateModule {
}
