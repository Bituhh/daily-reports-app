import {Injectable} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {NgrxUtilsService} from '@core/services/ngrx-utils.service';
import {createEffect} from '@ngrx/effects';
import * as LoginActions from '../actions/login.actions';

@Injectable({providedIn: 'root'})
export class LoginEffects {

  authenticate$ = createEffect(
    () => this.ngrxUtils.actionToAction({
      actionsToListenTo: [
        LoginActions.PageAuthenticateAction,
        LoginActions.RouterAuthenticateAction,
      ],
      actionsToDispatch: LoginActions.EffectAuthenticateAction,
    }),
  );
  authenticateEffect$ = createEffect(
    () => this.ngrxUtils.actionToServiceToAction({
      actionsToListenTo: [
        LoginActions.EffectAuthenticateAction,
      ],
      serviceMethod: this.authService.authenticate.bind(this.authService),
      successNavigation: navigate => navigate(['fill-rate'], {replaceUrl: true})
    }),
  );

  constructor(private ngrxUtils: NgrxUtilsService,
              private authService: AuthService) {
  }
}
