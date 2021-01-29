import {Component, OnInit} from '@angular/core';
import {GoogleDriveService} from '@core/login/services/google-drive.service';
import {Platform} from '@ionic/angular';
import {Google} from 'ng2-cordova-oauth/core';
import {OauthBrowser} from 'ng2-cordova-oauth/platform/browser';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  provider: Google;
  accessToken: string;

  constructor(private platform: Platform, private driveService: GoogleDriveService) {
  }

  ngOnInit() {
    this.provider = new Google({
      clientId: '943094540000-7ggkrmj4ik9qh1ej7c9412beq57t08nq.apps.googleusercontent.com',
      appScope: ['https://www.googleapis.com/auth/drive'],
      redirectUri: 'http://localhost:8100',
    });
  }

  onTest() {
    this.driveService.getWeekFolderId(this.accessToken).subscribe(x => {
      this.driveService.getFillRateReportId(this.accessToken, x.id).subscribe(y => {
        console.log(x, y);
      });
    });
  }

  onLogin() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        new OauthCordova().logInVia(this.provider).then(x => {
          console.log(x);
        });
      } else {
        new OauthBrowser().logInVia(this.provider).then((x: any) => {
          this.accessToken = x.access_token;
          console.log(x);
        });
      }
    });
  }
}
