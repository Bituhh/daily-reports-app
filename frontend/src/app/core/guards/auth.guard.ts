import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import * as LoginSelectors from '@core/store/selectors/login.selectors';
import {AppState} from '@core/store';
import {Store} from '@ngrx/store';
import {from, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(LoginSelectors.isAuthenticatedSelector).pipe(switchMap(authenticated => {
      if (authenticated) {
        return of(true);
      }
      return from(this.router.navigate(['login']).then(() => false));
    }));
  }
}
