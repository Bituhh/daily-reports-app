import {Component, OnInit} from '@angular/core';
import {AppState} from '@core/store';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Platform} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as LoginSelectors from '@core/store/selectors/login.selectors';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;

  // TODO - move pages to ngrx store
  pages = [
    {
      title: 'Fill Rate',
      url: '/fill-rate',
      icon: 'pulse',
    },
  ];

  // TODO - move shifts to ngrx store
  shifts = [
    'Night',
    'NS3',
    'Hybrid',
    'AM',
    'PM',
    'Twilight',
  ];

  // TODO - move sites to ngrx store
  sites = [
    'TST1',
    'TST2',
    'TST3',
    'TST4',
    'TST5',
    'TST6',
  ];

  isAuthenticated$: Observable<boolean>;

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private store: Store<AppState>) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(LoginSelectors.isAuthenticatedSelector);
    // TODO - change this to find which path and highlight the menu
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.pages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
