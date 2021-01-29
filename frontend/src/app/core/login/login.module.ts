import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {LoginRoutingModule} from '@core/login/login-routing.module';
import {LoginComponent} from '@core/login/login.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule,
  ],
})
export class LoginModule {
}
