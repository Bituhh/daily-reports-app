import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FillRateComponent} from '@app/fill-rate/fill-rate.component';

const routes: Routes = [
  {path: '', component: FillRateComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class FillRateRoutingModule {
}
