import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-fill-rate',
  templateUrl: './fill-rate.component.html',
  styleUrls: ['./fill-rate.component.scss'],
})
export class FillRateComponent implements OnInit {


  fillRateForm: FormGroup;

  get fillVariance(): number {
    const filled = this.fillRateForm.get('filled').value ?? 0;
    const finalEPT = this.fillRateForm.get('finalEPT').value ?? 0;
    return filled - finalEPT;
  }

  get fillPercentage(): number {
    const filled = this.fillRateForm.get('filled').value ?? 0;
    const finalEPT = this.fillRateForm.get('finalEPT').value ?? 0;
    return filled / finalEPT;
  }

  get shiftAbsences(): number {
    const reportedAbsence = this.fillRateForm.get('reportedAbsence').value ?? 0;
    const unreportedAbsence = this.fillRateForm.get('unreportedAbsence').value ?? 0;
    const isolated = this.fillRateForm.get('isolated').value ?? 0;
    const longTermAbsence = this.fillRateForm.get('longTermAbsence').value ?? 0;
    return reportedAbsence + unreportedAbsence + isolated + longTermAbsence;
  }

  get absencePercentage(): number {
    const finalEPT = this.fillRateForm.get('finalEPT').value ?? 0;
    return this.shiftAbsences / finalEPT;
  }

  constructor() {
  }

  ngOnInit() {
    this.fillRateForm = new FormGroup({
      finalEPT: new FormControl(null, [Validators.required]),
      booked: new FormControl(null, [Validators.required]),
      filled: new FormControl(null, [Validators.required]),
      reportedAbsence: new FormControl(null, [Validators.required]),
      unreportedAbsence: new FormControl(null, [Validators.required]),
      isolated: new FormControl(null, [Validators.required]),
      longTermAbsence: new FormControl(null, [Validators.required]),
      narrative: new FormControl(null, [Validators.required]),
    });
  }

  onNarrativeInfo() {
    console.log('onNarrativeInfo');
  }
}
