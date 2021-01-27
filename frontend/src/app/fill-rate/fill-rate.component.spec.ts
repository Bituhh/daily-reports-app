import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FillRateComponent } from './fill-rate.component';

describe('FillRateComponent', () => {
  let component: FillRateComponent;
  let fixture: ComponentFixture<FillRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillRateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FillRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
