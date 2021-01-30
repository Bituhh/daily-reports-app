import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {Platform} from '@ionic/angular';
import {Google} from 'ng2-cordova-oauth/core';
import {OauthBrowser} from 'ng2-cordova-oauth/platform/browser';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova';
import {from, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private provider = new Google({
    clientId: environment.google.clientId,
    appScope: ['https://www.googleapis.com/auth/drive'],
    redirectUri: environment.google.redirectUri,
  });

  constructor(private platform: Platform) {
  }

  authenticate(): Observable<{ accessToken: string }> {
    return from(this.platform.ready().then(() => {
      let oauth = this.platform.is('cordova') ? new OauthCordova() : new OauthBrowser();
      return oauth.logInVia(this.provider).then((x: { access_token: string }) => {
        return {accessToken: x.access_token};
      });
    }));
  }
}
