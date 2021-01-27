import {Component, OnInit} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;

  // TODO - move pages to ngrx store
  public pages = [
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

  constructor(private platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    // TODO - change this to find which path and highlight the menu
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.pages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
