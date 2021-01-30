import {Component, OnInit} from '@angular/core';
import {GoogleDriveService} from '@core/services/google-drive.service';
import * as LoginActions from '@core/store/actions/login.actions';
import {AppState} from '@core/store';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private driveService: GoogleDriveService, private store: Store<AppState>) {
  }

  ngOnInit() {
  }

  // TODO - remove later
  onTest() {
    this.driveService.getWeekFolderId('X').subscribe(x => {
      this.driveService.getFillRateReportId(x.id, 'X').subscribe(y => {
        console.log(x, y);
      });
    });
  }

  onLogin() {
    this.store.dispatch(LoginActions.PageAuthenticateAction());
  }
}
