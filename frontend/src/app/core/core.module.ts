import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CoreRoutingModule} from '@core/core-routing.module';
import {LoginComponent} from '@core/components/login/login.component';
import {LoginEffects} from '@core/store/effects/login.effects';
import {IonicModule} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    CoreRoutingModule,
    EffectsModule.forFeature([
      LoginEffects,
    ]),
  ],
})
export class CoreModule {
}
