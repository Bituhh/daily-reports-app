import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as LoginSelectors from '@core/store/selectors/login.selectors';
import {AppState} from '@core/store';
import {environment} from '@env/environment';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class GoogleDriveService {

  constructor(private store: Store<AppState>, private httpClient: HttpClient) {
  }

  // TODO - change weekNumber to number type
  getWeekFolderId(weekNumber: string): Observable<{ id: string }> {
    return this.store.select(LoginSelectors.accessTokenSelector).pipe(
      take(1),
      switchMap(accessToken => {
        let headers: HttpHeaders = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
        const params = {q: `title='Week ${weekNumber}'`};
        return this.httpClient.get<{ items: Children[] }>(GoogleDriveService.listFoldersApi(), {
          headers,
          params,
        }).pipe(
          switchMap(x => {
            return of({id: x.items[0].id});
          }),
        );
      }),
    );
  }

  // TODO - change weekNumber to number type
  getFillRateReportId(weekFolderId: string, weekNumber: string) {
    return this.store.select(LoginSelectors.accessTokenSelector).pipe(
      take(1),
      switchMap(accessToken => {
        let headers: HttpHeaders = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
        const params = {q: `title contains 'WK ${weekNumber} Fill Rate Report'`};
        return this.httpClient.get<{ items: Children[] }>(GoogleDriveService.listFoldersApi(weekFolderId), {
          headers,
          params,
        }).pipe(
          switchMap(x => {
            return of({id: x.items[0].id});
          }),
        );
      }),
    );
  }

  // Helper functions
  static listFoldersApi(id: string = environment.google.rootReportsFolderId) {
    return `https://www.googleapis.com/drive/v2/files/${id}/children`;
  };
}

interface Children {
  kind: 'drive#childReference',
  id: string,
  selfLink: string,
  childLink: string
}
